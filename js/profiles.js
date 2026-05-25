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

const list = document.getElementById('profiles-list');
const addBtn = list.querySelector('.add-btn');

async function loadPersonas() {
    const response = await fetch('/api/personas');
    const personas = await response.json();

    personas.forEach(p => {
        list.insertBefore(createCard(p), addBtn);
    });
}

const modal = new bootstrap.Modal(document.getElementById('addProfileModal'));
const nameInput = document.getElementById('new-persona-name');
const errorDiv = document.getElementById('persona-error');
const saveBtn = document.getElementById('save-persona-btn');

addBtn.addEventListener('click', () => {
    nameInput.value = '';
    errorDiv.classList.add('d-none');
    errorDiv.textContent = '';
    modal.show();
});

async function submitNewPersona() {
    const name = nameInput.value.trim();

    if (!name) {
        errorDiv.textContent = 'Name is required.';
        errorDiv.classList.remove('d-none');
        return;
    }

    const response = await fetch('/api/personas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name })
    });

    const data = await response.json();

    if (!response.ok) {
        errorDiv.textContent = data.error || 'Could not add profile.';
        errorDiv.classList.remove('d-none');
        return;
    }

    list.insertBefore(createCard(data), addBtn);
    modal.hide();
}

saveBtn.addEventListener('click', submitNewPersona);

nameInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') submitNewPersona();
});

document.addEventListener('DOMContentLoaded', loadPersonas);