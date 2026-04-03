const PAGE_LABELS = {
  dashboard:  'Dashboard',
  despesas:   'Despesas',
  nova:       'Nova Despesa',
  categorias: 'Categorias',
};

function navigate(page) {
  $$('.page').forEach(p => p.classList.remove('active'));
  $$('.nav-btn').forEach(b => b.classList.remove('active'));

  $(`#page-${page}`).classList.add('active');
  $(`.nav-btn[data-page="${page}"]`).classList.add('active');

  $('#header-subtitle').textContent = PAGE_LABELS[page] || '';

  $('#fab').classList.toggle('active', page === 'nova');

  if (page === 'dashboard')  loadDashboard();
  if (page === 'despesas')   loadDespesas();
  if (page === 'categorias') loadCategorias();
  if (page === 'nova')       loadCatSelect();
}

$$('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => navigate(btn.dataset.page));
});

$('#fab').addEventListener('click', () => navigate('nova'));
$('#dash-see-all').addEventListener('click', () => navigate('despesas'));
