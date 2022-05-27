import { storage as localStorage, session as sessionStorage } from './storage';

const BUSINESS_ID_LOCAL_STORAGE_KEY = 'business_id';
const BUSINESS_ID_SESSION_STORAGE_KEY = 'business_id';

// When a new tab is opened, we want to default to the business
// last selected, which can be found in local storage.
const current = localStorage.get<string>(BUSINESS_ID_LOCAL_STORAGE_KEY);
if (current) {
  sessionStorage.set(BUSINESS_ID_SESSION_STORAGE_KEY, current);
}

// Whenever a business is selected in the UI, this function should
// be called to set both local and session storage.
function setCurrentBusinessId(id: string) {
  sessionStorage.set(BUSINESS_ID_SESSION_STORAGE_KEY, id);
  localStorage.set(BUSINESS_ID_LOCAL_STORAGE_KEY, id);
}

// Call to get the current businessId (stored in session storage).
function getCurrentBusinessId(): string | null {
  const id = sessionStorage.get<string>(BUSINESS_ID_SESSION_STORAGE_KEY);
  if (!id) {
    // eslint-disable-next-line no-console
    console.error('getCurrentBusinessId was called, but no businessId was set');
  }
  return id;
}

function clearCurrentBusinessId() {
  sessionStorage.remove(BUSINESS_ID_SESSION_STORAGE_KEY);
  localStorage.remove(BUSINESS_ID_LOCAL_STORAGE_KEY);
}

export { setCurrentBusinessId, getCurrentBusinessId, clearCurrentBusinessId };
