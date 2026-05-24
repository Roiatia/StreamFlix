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

async function loadPersonas() {
    const res = await fetch('/api/personas');

    if (!res.ok) {
        throw new Error('Failed to load personas.');
    }

    const personas = await res.json();
    personas.forEach(p => list.insertBefore(createCard(p), addBtn));
}

loadPersonas().catch(err => {
    console.error(err);
});

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

    // TODO: replace this local add with POST /api/personas
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
