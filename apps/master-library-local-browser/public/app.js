const $ = (id) => document.getElementById(id);
const notice = (message = '') => { $('notice').textContent = message; };
const api = async (path, init = {}) => {
  const isMultipart = typeof FormData !== 'undefined' && init.body instanceof FormData;
  const response = await fetch(path, { credentials: 'same-origin', ...init, headers: { ...(init.body && !isMultipart ? { 'content-type': 'application/json' } : {}), ...(init.headers || {}) } });
  const body = response.status === 204 ? undefined : await response.json().catch(() => undefined);
  if (response.status === 401 || response.status === 403) { showLogin(); throw new Error('Authentication is required.'); }
  if (!response.ok) throw new Error(body?.error?.code || 'The local service is unavailable.');
  return body;
};
let selected;
const showLogin = () => { $('login-card').hidden = false; $('library-card').hidden = true; selected = undefined; };
const showLibrary = () => { $('login-card').hidden = true; $('library-card').hidden = false; };
const selectVersion = (publicationId, versionId) => { selected = { publicationId, versionId }; $('selection').textContent = `${publicationId} · ${versionId}`; $('acquisition-form').hidden = false; $('receipt').hidden = true; };
const renderCatalog = (page) => {
  const items = page?.items || [];
  $('catalog').replaceChildren();
  if (!items.length) { $('catalog').innerHTML = '<p class="empty">The Master Catalog is empty.</p>'; return; }
  for (const item of items) {
    const element = document.createElement('article'); element.className = 'publication';
    const title = item.title || item.publicationId; const versions = item.versions || (item.versionId ? [{ versionId: item.versionId }] : []);
    element.innerHTML = `<h3></h3><p><code></code></p><div class="versions"></div>`; element.querySelector('h3').textContent = title; element.querySelector('code').textContent = item.publicationId;
    for (const version of versions) { const row = document.createElement('div'); row.className = 'version'; const id = version.versionId || version.id; row.innerHTML = '<code></code><button type="button">Select acquisition</button><a>Download</a>'; row.querySelector('code').textContent = id; row.querySelector('button').onclick = () => selectVersion(item.publicationId, id); const download = row.querySelector('a'); download.href = `/local/api/publications/${encodeURIComponent(item.publicationId)}/versions/${encodeURIComponent(id)}/content`; download.textContent = 'Download'; element.querySelector('.versions').append(row); }
    $('catalog').append(element);
  }
};
const loadCatalog = async () => { $('catalog-status').textContent = 'Loading catalog…'; try { renderCatalog(await api('/local/api/catalog')); $('catalog-status').textContent = 'Catalog ready.'; } catch (error) { $('catalog-status').textContent = 'Catalog unavailable.'; notice(error.message); } };
const ingestMessage = (result, operation) => operation?.state === 'reconciliation-required'
  ? `Upload accepted as ${result?.operationId ?? 'an ingest operation'}. Recovery is in progress; the catalog will refresh when registration completes.`
  : result?.outcome === 'duplicate'
  ? `Duplicate source: existing publication ${result.publicationId} remains registered. Catalog refreshed.`
  : `Upload accepted as ${result?.operationId ?? 'an ingest operation'}. Catalog refreshed.`;
const ingestError = (error) => {
  if (error.message === 'ingest.validation-failed') return 'The file or metadata was rejected. Select a valid PDF or EPUB and complete every field.';
  if (error.message === 'ingest.idempotency-conflict') return 'This submission conflicts with an earlier idempotency key. Start a new upload.';
  if (error.message === 'infrastructure.transient') return 'Upload unavailable. The service will recover before protected traffic resumes.';
  return error.message;
};
$('login-form').addEventListener('submit', async (event) => { event.preventDefault(); notice(); const form = new FormData(event.currentTarget); try { await api('/local/auth/login', { method: 'POST', body: JSON.stringify({ email: form.get('email'), password: form.get('password') }) }); showLibrary(); await loadCatalog(); } catch (error) { notice(error.message === 'Authentication is required.' ? 'Invalid email or password.' : error.message); } });
$('logout').addEventListener('click', async () => { await fetch('/local/auth/logout', { method: 'POST', credentials: 'same-origin' }); showLogin(); notice('Signed out.'); });
$('acquisition-form').addEventListener('submit', async (event) => { event.preventDefault(); if (!selected) return; notice(); try { const targetLocalLibraryId = $('target-local-library').value; const result = await api('/local/api/acquisitions', { method: 'POST', headers: { 'idempotency-key': crypto.randomUUID() }, body: JSON.stringify({ ...selected, targetLocalLibraryId }) }); $('receipt').textContent = JSON.stringify(result, null, 2); $('receipt').hidden = false; } catch (error) { notice(error.message); } });
$('ingest-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const source = form.get('source');
  const authors = String(form.get('authors') ?? '').split(',').map(author => author.trim()).filter(Boolean);
  const status = $('ingest-status');
  const submit = $('ingest-submit');
  if (!(source instanceof File)) { status.textContent = 'Choose a PDF or EPUB source file.'; return; }
  const upload = new FormData();
  upload.append('metadata', JSON.stringify({ title: String(form.get('title') ?? '').trim(), authors }));
  upload.append('source', source, source.name);
  submit.disabled = true;
  status.textContent = 'Upload submitted. Streaming source bytes…';
  try {
    const result = await api('/local/api/publications:ingest', { method: 'POST', headers: { 'idempotency-key': crypto.randomUUID() }, body: upload });
    const operation = result?.operationId ? await api(`/local/api/ingest-operations/${encodeURIComponent(result.operationId)}`) : undefined;
    status.textContent = ingestMessage(result, operation);
    if (operation?.state !== 'reconciliation-required') await loadCatalog();
  } catch (error) {
    status.textContent = ingestError(error);
  } finally {
    submit.disabled = false;
  }
});
showLogin();
