// build a clickable card for one persona
function createCard(persona) {
    const a = document.createElement('a');
    a.href = `interface.html?persona=${persona.id}`;
    a.className = 'profile-link text-decoration-none';

    const div = document.createElement('div');
    div.className = 'profile';

    const iconDiv = document.createElement('div');
    iconDiv.className = 'profile-icon';

    const img = document.createElement('img');
    img.src = persona.avatar;
    img.alt = persona.name;
    iconDiv.appendChild(img);

    const span = document.createElement('span');
    span.className = 'profile-name';
    span.textContent = persona.name;

    div.appendChild(iconDiv);
    div.appendChild(span);
    a.appendChild(div);
    return a;
}

const list   = document.getElementById('profiles-list');
const addBtn = list.querySelector('.add-btn');

// TODO(partner): replace this local list with GET /api/personas
const localPersonas = [
    {
        id: 'roi',
        name: 'Roi',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'
    },
    {
        id: 'dan',
        name: 'Dan',
        avatar: 'https://ih1.redbubble.net/image.618427277.3222/flat,1000x1000,075,f.u2.jpg'
    },
    {
        id: 'guest',
        name: 'Guest',
        avatar: 'https://ih1.redbubble.net/image.618427277.3222/flat,1000x1000,075,f.u2.jpg'
    }
];

localPersonas.forEach(p => list.insertBefore(createCard(p), addBtn));

const modal     = new bootstrap.Modal(document.getElementById('addProfileModal'));
const nameInput = document.getElementById('new-persona-name');
const errorDiv  = document.getElementById('persona-error');
const saveBtn   = document.getElementById('save-persona-btn');

// open the modal and clear any leftover state from last time
addBtn.addEventListener('click', () => {
    nameInput.value = '';
    errorDiv.classList.add('d-none');
    errorDiv.textContent = '';
    modal.show();
});

function submitNewPersona() {
    const name = nameInput.value.trim();

    if (!name) {
        errorDiv.textContent = 'Name is required.';
        errorDiv.classList.remove('d-none');
        return;
    }

    // TODO(partner): replace this local add with POST /api/personas
    const id = name.toLowerCase().replace(/\s+/g, '-');
    const newPersona = {
        id,
        name,
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'
    };

    list.insertBefore(createCard(newPersona), addBtn);
    modal.hide();
}

saveBtn.addEventListener('click', submitNewPersona);

// pressing Enter in the name field also submits
nameInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') submitNewPersona();
});
