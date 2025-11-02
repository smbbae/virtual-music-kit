const initPiano = () => {
  const piano = document.createElement('div');
  piano.className = 'piano';
  document.body.appendChild(piano);

  const notes = [
    { name: 'C', color: 'white' },
    { name: 'Db', color: 'black' },
    { name: 'D', color: 'white' },
    { name: 'Eb', color: 'black' },
    { name: 'E', color: 'white' },
    { name: 'F', color: 'white' },
    { name: 'Gb', color: 'black' },
    { name: 'G', color: 'white' },
    { name: 'Ab', color: 'black' },
    { name: 'A', color: 'white' },
    { name: 'Bb', color: 'black' },
    { name: 'B', color: 'white' },
  ];

  let WHITE_KEYS = ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM'];
  let BLACK_KEYS = ['KeyS', 'KeyD', 'KeyG', 'KeyH', 'KeyJ'];

  let keyBindings = {
    C: 'KeyZ',
    Db: 'KeyS',
    D: 'KeyX',
    Eb: 'KeyD',
    E: 'KeyC',
    F: 'KeyV',
    Gb: 'KeyG',
    G: 'KeyB',
    Ab: 'KeyH',
    A: 'KeyN',
    Bb: 'KeyJ',
    B: 'KeyM',
  };

  const editContainer = document.createElement('div');
  editContainer.style.margin = '10px 0';
  editContainer.style.display = 'none';
  editContainer.style.textAlign = 'center';

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.placeholder = 'Enter new key (e.g. Q)';
  editInput.style.padding = '8px';
  editInput.style.fontSize = '16px';
  editInput.style.width = '200px';

  const editLabel = document.createElement('div');
  editLabel.textContent = 'Editing key:';
  editLabel.style.marginBottom = '6px';
  editLabel.style.fontWeight = 'bold';

  editContainer.appendChild(editLabel);
  editContainer.appendChild(editInput);
  document.body.insertBefore(editContainer, piano);

  let currentEditingNote = null;

  notes.forEach(({ name, color }) => {
    const key = document.createElement('div');
    key.classList.add('key', color);
    key.dataset.note = name;
    piano.appendChild(key);

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = name + '(' + keyBindings[name].replace('Key', '') + ')';
    label.style.fontSize = '12px';
    label.style.textAlign = 'center';

    const editBtn = document.createElement('button');
    editBtn.textContent = '✎';
    editBtn.className = 'edit-btn';
    editBtn.style.marginTop = '4px';
    editBtn.style.fontSize = '10px';
    editBtn.style.cursor = 'pointer';

    editBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      currentEditingNote = name;
      editLabel.textContent = `Editing key for ${name}:`;
      editInput.value = keyBindings[name].replace('Key', '');
      editContainer.style.display = 'block';
      editInput.focus();
    });

    key.appendChild(label);
    key.appendChild(editBtn);
    piano.appendChild(key);
  });

  notes.forEach(({ name }) => {
    const audio = document.createElement('audio');
    audio.id = name;
    audio.src = `notes/notes_${name}.mp3`;
    document.body.appendChild(audio);
  });

  const whiteKeys = document.querySelectorAll('.key.white');
  const blackKeys = document.querySelectorAll('.key.black');

  piano.addEventListener('click', (e) => {
    if (e.target.classList.contains('key')) {
      const note = e.target.dataset.note;
      const sound = document.getElementById(note);
      if (sound) {
        sound.currentTime = 0;
        sound.play();
      }
    }
  });

  const playNote = (key) => {
    if (!key) return;
    const note = key.dataset.note;
    const sound = document.getElementById(note);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  };

  document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const code = e.code;
    const note = Object.keys(keyBindings).find((n) => keyBindings[n] === code);
    if (note) {
      const keyEl = document.querySelector(`.key[data-note="${note}"]`);
      playNote(keyEl);
    }
  });

  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && currentEditingNote) {
      const newKey = e.target.value.trim().toUpperCase();
      if (!newKey) return;

      const newCode = 'Key' + newKey;

      const alreadyUsed = Object.values(keyBindings).includes(newCode);
      if (alreadyUsed) {
        alert('This key is already assigned to another note!');
        return;
      }

      keyBindings[currentEditingNote] = newCode;

      const keyEl = document.querySelector(
        `.key[data-note="${currentEditingNote}"]`
      );
      const label = keyEl.querySelector('.label');
      label.textContent = `${currentEditingNote} (${newKey})`;

      editContainer.style.display = 'none';
      currentEditingNote = null;
      e.target.value = '';
    }
  });

  const sequenceContainer = document.createElement('div');
  sequenceContainer.style.textAlign = 'center';
  sequenceContainer.style.marginTop = '20px';
  sequenceContainer.className = 'seqContainer';

  const seqLabel = document.createElement('div');
  seqLabel.textContent = 'enter sequence of assigned keys:';
  seqLabel.style.fontWeight = 'bold';
  seqLabel.style.marginBottom = '6px';

  const seqInput = document.createElement('input');
  seqInput.type = 'text';
  seqInput.placeholder = 'type your sequence...';
  seqInput.style.padding = '8px';
  seqInput.style.fontSize = '16px';
  seqInput.style.width = '300px';
  seqInput.id = 'seqInput';

  sequenceContainer.appendChild(seqLabel);
  sequenceContainer.appendChild(seqInput);
  document.body.appendChild(sequenceContainer);

  const maxLength = notes.length * 2;

  seqInput.addEventListener('input', (e) => {
    const alllowKeys = Object.values(keyBindings).map((k) =>
      k.replace('Key', '').toUpperCase()
    );

    let filtered = '';
    for (const ch of e.target.value.toUpperCase()) {
      if (alllowKeys.includes(ch)) filtered += ch;
    }

    if (filtered.length > maxLength) filtered = filtered.slice(0, maxLength);
    e.target.value = filtered;
  });

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (!isMobile) {
    document.body.appendChild(sequenceContainer);
  } else {
    const openBtn = document.createElement('button');
    openBtn.textContent = 'Open Sequence Input';
    openBtn.style.padding = '10px 16px';
    openBtn.style.fontSize = '16px';
    openBtn.style.borderRadius = '8px';
    openBtn.style.border = 'none';
    openBtn.style.backgroundColor = '#954cafff';
    openBtn.style.color = 'white';
    openBtn.style.cursor = 'pointer';
    openBtn.style.display = 'block';
    openBtn.style.margin = '20px auto';
    document.body.appendChild(openBtn);

    const modalOverlay = document.createElement('div');
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.width = '100%';
    modalOverlay.style.height = '100%';
    modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalOverlay.style.display = 'none';
    modalOverlay.style.justifyContent = 'center';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.style.zIndex = '1000';
    modalOverlay.className = 'modal';

    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '12px';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '400px';
    modalContent.style.textAlign = 'center';
    modalContent.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
    modalContent.appendChild(sequenceContainer);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.marginTop = '15px';
    closeBtn.style.padding = '8px 12px';
    closeBtn.style.backgroundColor = '#f44336';
    closeBtn.style.color = 'white';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '6px';
    closeBtn.style.cursor = 'pointer';

    modalContent.appendChild(closeBtn);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    openBtn.addEventListener('click', () => {
      modalOverlay.style.display = 'flex';
      seqInput.focus();
    });

    closeBtn.addEventListener('click', () => {
      modalOverlay.style.display = 'none';
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.style.display = 'none';
    });
  }
};

initPiano();
