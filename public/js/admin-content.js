let allContent = [];
let editingId = null;

function showMessage(text, type) {
  const el = document.getElementById('adminMessage');
  el.textContent = text;
  el.classList.remove('hidden', 'admin-message-success', 'admin-message-error');
  el.classList.add(`admin-message-${type}`);
}

function clearMessage() {
  const el = document.getElementById('adminMessage');
  el.classList.add('hidden');
  el.textContent = '';
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// shared response handler for the admin CRUD calls below — surfaces
// 401/403/400/500 consistently so each caller doesn't repeat this logic
async function handleResponse(res) {
  let data = null;
  try {
    data = await res.json();
  } catch (err) {
    data = null;
  }

  if (res.status === 401) {
    window.location.href = '/';
    return null;
  }
  if (res.status === 403) {
    showMessage('Admin access is required for this action.', 'error');
    return null;
  }
  if (!res.ok) {
    showMessage((data && (data.error || data.message)) || 'Something went wrong.', 'error');
    return null;
  }
  return data;
}

async function checkAdminAccess() {
  try {
    const res = await fetch('/api/auth/me');
    if (res.status === 401) {
      window.location.href = '/';
      return false;
    }

    const data = await res.json();
    if (!data.authenticated || !data.user || data.user.role !== 'admin') {
      document.getElementById('adminForbidden').classList.remove('hidden');
      document.getElementById('adminPageContent').classList.add('hidden');
      return false;
    }

    document.getElementById('adminForbidden').classList.add('hidden');
    document.getElementById('adminPageContent').classList.remove('hidden');
    return true;
  } catch (err) {
    document.getElementById('adminForbidden').classList.remove('hidden');
    document.getElementById('adminPageContent').classList.add('hidden');
    return false;
  }
}

async function loadContent() {
  try {
    const res = await fetch('/api/admin/content');
    const data = await handleResponse(res);
    if (!data) return;

    allContent = data.items || [];
    renderTable();
  } catch (err) {
    showMessage('Could not load content.', 'error');
  }
}

function renderTable() {
  const tbody = document.getElementById('adminContentBody');

  if (!allContent.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="admin-empty">No content yet.</td></tr>';
    return;
  }

  tbody.innerHTML = allContent.map(item => `
    <tr>
      <td>${item.id}</td>
      <td>${escapeHtml(item.title)}</td>
      <td>${escapeHtml(item.type)}</td>
      <td>${escapeHtml(item.genre)}</td>
      <td>${item.year}</td>
      <td>${escapeHtml(item.rating)}</td>
      <td>${item.isPopular ? 'Yes' : 'No'}</td>
      <td class="admin-row-actions">
        <button type="button" class="admin-edit-btn" data-id="${item.id}">Edit</button>
        <button type="button" class="admin-delete-btn" data-id="${item.id}">Delete</button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.admin-edit-btn').forEach(btn => {
    btn.addEventListener('click', () => startEdit(Number(btn.dataset.id)));
  });
  tbody.querySelectorAll('.admin-delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteContentItem(Number(btn.dataset.id)));
  });
}

function startEdit(id) {
  const item = allContent.find(i => i.id === id);
  if (!item) return;

  editingId = id;
  document.getElementById('contentTitle').value = item.title || '';
  document.getElementById('contentType').value = item.type || '';
  document.getElementById('contentGenre').value = item.genre || '';
  document.getElementById('contentYear').value = item.year ?? '';
  document.getElementById('contentRating').value = item.rating || '';
  document.getElementById('contentDescription').value = item.description || '';
  document.getElementById('contentLanguage').value = item.language || '';
  document.getElementById('contentImg').value = item.img || '';
  document.getElementById('contentPersonas').value = (item.personas || []).join(',');
  document.getElementById('contentBaseLikeCount').value = item.baseLikeCount ?? '';
  document.getElementById('contentIsPopular').checked = !!item.isPopular;

  document.getElementById('contentSubmitBtn').textContent = 'Update Content';
  document.getElementById('contentCancelBtn').classList.remove('hidden');
  clearMessage();
  document.getElementById('contentTitle').focus();
}

function resetForm() {
  editingId = null;
  document.getElementById('contentForm').reset();
  document.getElementById('contentSubmitBtn').textContent = 'Add Content';
  document.getElementById('contentCancelBtn').classList.add('hidden');
}

function buildPayload() {
  const personasRaw = document.getElementById('contentPersonas').value.trim();
  const personas = personasRaw ? personasRaw.split(',').map(p => p.trim()).filter(Boolean) : [];

  const payload = {
    title: document.getElementById('contentTitle').value.trim(),
    type: document.getElementById('contentType').value.trim(),
    genre: document.getElementById('contentGenre').value.trim(),
    year: Number(document.getElementById('contentYear').value),
    rating: document.getElementById('contentRating').value.trim(),
    description: document.getElementById('contentDescription').value.trim(),
    isPopular: document.getElementById('contentIsPopular').checked,
  };

  const language = document.getElementById('contentLanguage').value.trim();
  const img = document.getElementById('contentImg').value.trim();
  const baseLikeCount = document.getElementById('contentBaseLikeCount').value;

  if (language) payload.language = language;
  if (img) payload.img = img;
  if (personas.length) payload.personas = personas;
  if (baseLikeCount !== '') payload.baseLikeCount = Number(baseLikeCount);

  return payload;
}

function validatePayload(payload) {
  if (!payload.title) return 'Title is required.';
  if (!payload.type) return 'Type is required.';
  if (!payload.genre) return 'Genre is required.';
  if (!Number.isFinite(payload.year)) return 'Year must be a number.';
  if (!payload.rating) return 'Rating is required.';
  if (!payload.description) return 'Description is required.';
  return '';
}

async function handleFormSubmit(event) {
  event.preventDefault();
  clearMessage();

  const payload = buildPayload();
  const error = validatePayload(payload);
  if (error) {
    showMessage(error, 'error');
    return;
  }

  try {
    const res = editingId
      ? await fetch(`/api/admin/content/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

    const data = await handleResponse(res);
    if (!data) return;

    showMessage(editingId ? 'Content updated successfully.' : 'Content created successfully.', 'success');
    resetForm();
    loadContent();
  } catch (err) {
    showMessage('Could not save content.', 'error');
  }
}

async function deleteContentItem(id) {
  const confirmed = confirm('Are you sure you want to delete this content item?');
  if (!confirmed) return;

  try {
    const res = await fetch(`/api/admin/content/${id}`, { method: 'DELETE' });
    const data = await handleResponse(res);
    if (!data) return;

    if (editingId === id) resetForm();
    showMessage('Content deleted successfully.', 'success');
    loadContent();
  } catch (err) {
    showMessage('Could not delete content.', 'error');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const isAdmin = await checkAdminAccess();
  if (!isAdmin) return;

  document.getElementById('contentForm').addEventListener('submit', handleFormSubmit);
  document.getElementById('contentCancelBtn').addEventListener('click', resetForm);

  document.getElementById('locationForm').addEventListener('submit', handleLocationSubmit);
  document.getElementById('locationCancelBtn').addEventListener('click', resetLocationForm);

  loadContent();
  loadLocations();
});

// ---- Locations ----

let allLocations = [];
let editingLocationId = null;

function showLocationMessage(text, type) {
  const el = document.getElementById('locationMessage');
  el.textContent = text;
  el.classList.remove('hidden', 'admin-message-success', 'admin-message-error');
  el.classList.add(`admin-message-${type}`);
}

function clearLocationMessage() {
  const el = document.getElementById('locationMessage');
  el.classList.add('hidden');
  el.textContent = '';
}

async function loadLocations() {
  try {
    const res  = await fetch('/api/admin/locations');
    const data = await handleResponse(res);
    if (!data) return;
    allLocations = data.locations || [];
    renderLocationsTable();
  } catch (err) {
    showLocationMessage('Could not load locations.', 'error');
  }
}

function renderLocationsTable() {
  const tbody = document.getElementById('adminLocationsBody');
  if (!allLocations.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="admin-empty">No locations yet.</td></tr>';
    return;
  }
  tbody.innerHTML = allLocations.map(loc => `
    <tr>
      <td>${escapeHtml(loc.name)}</td>
      <td>${escapeHtml(loc.address)}</td>
      <td>${loc.lat}</td>
      <td>${loc.lng}</td>
      <td class="admin-row-actions">
        <button type="button" class="admin-edit-btn" data-id="${loc._id}">Edit</button>
        <button type="button" class="admin-delete-btn" data-id="${loc._id}">Delete</button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.admin-edit-btn').forEach(btn => {
    btn.addEventListener('click', () => startLocationEdit(btn.dataset.id));
  });
  tbody.querySelectorAll('.admin-delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteLocation(btn.dataset.id));
  });
}

function startLocationEdit(id) {
  const loc = allLocations.find(l => l._id === id);
  if (!loc) return;
  editingLocationId = id;
  document.getElementById('locationName').value    = loc.name    || '';
  document.getElementById('locationAddress').value = loc.address || '';
  document.getElementById('locationLat').value     = loc.lat     ?? '';
  document.getElementById('locationLng').value     = loc.lng     ?? '';
  document.getElementById('locationSubmitBtn').textContent = 'Update Location';
  document.getElementById('locationCancelBtn').classList.remove('hidden');
  clearLocationMessage();
  document.getElementById('locationName').focus();
}

function resetLocationForm() {
  editingLocationId = null;
  document.getElementById('locationForm').reset();
  document.getElementById('locationSubmitBtn').textContent = 'Add Location';
  document.getElementById('locationCancelBtn').classList.add('hidden');
}

async function handleLocationSubmit(event) {
  event.preventDefault();
  clearLocationMessage();

  const name    = document.getElementById('locationName').value.trim();
  const address = document.getElementById('locationAddress').value.trim();
  const lat     = parseFloat(document.getElementById('locationLat').value);
  const lng     = parseFloat(document.getElementById('locationLng').value);

  if (!name)                 return showLocationMessage('Name is required.', 'error');
  if (!address)              return showLocationMessage('Address is required.', 'error');
  if (!Number.isFinite(lat)) return showLocationMessage('Latitude must be a number.', 'error');
  if (!Number.isFinite(lng)) return showLocationMessage('Longitude must be a number.', 'error');

  const payload = { name, address, lat, lng };

  try {
    const res = editingLocationId
      ? await fetch(`/api/admin/locations/${editingLocationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/admin/locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

    const data = await handleResponse(res);
    if (!data) return;

    showLocationMessage(editingLocationId ? 'Location updated.' : 'Location created.', 'success');
    resetLocationForm();
    loadLocations();
  } catch (err) {
    showLocationMessage('Could not save location.', 'error');
  }
}

async function deleteLocation(id) {
  if (!confirm('Delete this location?')) return;
  try {
    const res  = await fetch(`/api/admin/locations/${id}`, { method: 'DELETE' });
    const data = await handleResponse(res);
    if (!data) return;
    if (editingLocationId === id) resetLocationForm();
    showLocationMessage('Location deleted.', 'success');
    loadLocations();
  } catch (err) {
    showLocationMessage('Could not delete location.', 'error');
  }
}
