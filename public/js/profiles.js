const list     = document.getElementById('profiles-list');
const addBtn   = list.querySelector('.add-btn');
const manageBtn = document.querySelector('.manage-profiles');
const msgDiv   = document.getElementById('profile-message');

let manageMode    = false;
let personas      = [];
let editingPersona = null;

// --- card builders ---

function createCard(persona) {
    const a = document.createElement('a');
    a.href = `interface.html?persona=${persona.id}`;
    a.className = 'profile-link text-decoration-none';
    a.addEventListener('click', function () {
        sessionStorage.setItem('streamflix_active_persona', persona.id);
    });

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

function createManageCard(persona) {
    const div = document.createElement('div');
    div.className = 'profile manage-card';

    const iconDiv = document.createElement('div');
    iconDiv.className = 'profile-icon';

    const img = document.createElement('img');
    img.src = persona.avatar;
    img.alt = persona.name;
    iconDiv.appendChild(img);

    const overlay = document.createElement('div');
    overlay.className = 'manage-overlay';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-sm manage-edit-btn';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => openEditModal(persona));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-sm manage-delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => confirmDelete(persona));

    overlay.appendChild(editBtn);
    overlay.appendChild(deleteBtn);

    const span = document.createElement('span');
    span.className = 'profile-name';
    span.textContent = persona.name;

    div.appendChild(iconDiv);
    div.appendChild(overlay);
    div.appendChild(span);

    return div;
}

// --- data loading & rendering ---

async function loadPersonas() {
    const response = await fetch('/api/personas');
    if (!response.ok) {
        showMessage('Could not load profiles.', 'error');
        return;
    }
    personas = await response.json();
    renderPersonas();
}

function renderPersonas() {
    list.querySelectorAll('.profile-link, .manage-card').forEach(el => el.remove());
    personas.forEach(p => {
        list.insertBefore(manageMode ? createManageCard(p) : createCard(p), addBtn);
    });
    addBtn.style.display  = manageMode ? 'none' : '';
    manageBtn.textContent = manageMode ? 'Done' : 'Manage Profiles';
}

// --- status message ---

function showMessage(text, type) {
    msgDiv.textContent = text;
    msgDiv.className   = type;
    setTimeout(() => {
        msgDiv.className   = 'd-none';
        msgDiv.textContent = '';
    }, 3000);
}

// --- manage mode toggle ---

manageBtn.addEventListener('click', () => {
    manageMode = !manageMode;
    renderPersonas();
});

// --- add profile modal ---

const addModal  = new bootstrap.Modal(document.getElementById('addProfileModal'));
const nameInput = document.getElementById('new-persona-name');
const errorDiv  = document.getElementById('persona-error');
const saveBtn   = document.getElementById('save-persona-btn');

addBtn.addEventListener('click', () => {
    nameInput.value = '';
    errorDiv.classList.add('d-none');
    errorDiv.textContent = '';
    addModal.show();
});

async function submitNewPersona() {
    const name = nameInput.value.trim();
    if (!name) {
        errorDiv.textContent = 'Name is required.';
        errorDiv.classList.remove('d-none');
        return;
    }
    const response = await fetch('/api/personas', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name }),
    });
    const data = await response.json();
    if (!response.ok) {
        errorDiv.textContent = data.error || 'Could not add profile.';
        errorDiv.classList.remove('d-none');
        return;
    }
    personas.push(data);
    renderPersonas();
    addModal.hide();
}

saveBtn.addEventListener('click', submitNewPersona);
nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') submitNewPersona(); });

// --- edit profile modal ---

const editModal      = new bootstrap.Modal(document.getElementById('editProfileModal'));
const editNameInput  = document.getElementById('edit-persona-name');
const editErrorDiv   = document.getElementById('edit-persona-error');
const saveEditBtn    = document.getElementById('save-edit-btn');

function openEditModal(persona) {
    editingPersona = persona;
    editNameInput.value = persona.name;
    editErrorDiv.classList.add('d-none');
    editErrorDiv.textContent = '';
    editModal.show();
}

async function submitEdit() {
    const name = editNameInput.value.trim();
    if (!name) {
        editErrorDiv.textContent = 'Name is required.';
        editErrorDiv.classList.remove('d-none');
        return;
    }
    const response = await fetch(`/api/personas/${editingPersona.id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name }),
    });
    const data = await response.json();
    if (!response.ok) {
        editErrorDiv.textContent = data.error || 'Could not update profile.';
        editErrorDiv.classList.remove('d-none');
        return;
    }
    const idx = personas.findIndex(p => p.id === editingPersona.id);
    if (idx !== -1) personas[idx] = data;
    editModal.hide();
    renderPersonas();
    showMessage('Profile updated.', 'success');
}

saveEditBtn.addEventListener('click', submitEdit);
editNameInput.addEventListener('keydown', e => { if (e.key === 'Enter') submitEdit(); });

// --- delete profile ---

async function confirmDelete(persona) {
    if (!window.confirm(`Delete profile "${persona.name}"? This cannot be undone.`)) return;
    const response = await fetch(`/api/personas/${persona.id}`, { method: 'DELETE' });
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        showMessage(data.error || 'Could not delete profile.', 'error');
        return;
    }
    personas = personas.filter(p => p.id !== persona.id);
    renderPersonas();
    showMessage('Profile deleted.', 'success');
}

document.addEventListener('DOMContentLoaded', loadPersonas);
