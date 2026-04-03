let _toastTimer;

function showToast(msg, type = '') {
  const el = $('#toast');
  el.textContent = msg;
  el.className = 'toast-msg show ' + type;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { el.className = 'toast-msg'; }, 3000);
}
