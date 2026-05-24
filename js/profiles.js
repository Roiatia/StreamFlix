// build a persona card element using DOM methods (avoids innerHTML with user data)
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

// fetch all personas from the server and render them on page load
fetch('/api/personas')
    .then(res => res.json())
    .then(personas => {
        personas.forEach(p => list.insertBefore(createCard(p), addBtn));
    });

// --- Add Profile modal ---

const modal     = new bootstrap.Modal(document.getElementById('addProfileModal'));
const nameInput = document.getElementById('new-persona-name');
const errorDiv  = document.getElementById('persona-error');
const saveBtn   = document.getElementById('save-persona-btn');

// clicking the Add Profile button opens the modal and resets its state
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

    // send the new persona to the server
    fetch('/api/personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    })
        .then(res => res.json().then(data => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
            if (!ok) {
                errorDiv.textContent = data.error || 'Something went wrong.';
                errorDiv.classList.remove('d-none');
                return;
            }
            // add the new card to the page and close the modal
            list.insertBefore(createCard(data), addBtn);
            modal.hide();
        });
}

saveBtn.addEventListener('click', submitNewPersona);

// pressing Enter in the name field also submits
nameInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') submitNewPersona();
});
