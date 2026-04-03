

let _allDespesas = [];

function expenseCard(d) {
  return `
    <div class="expense-card" data-id="${d.id}">
      <span class="expense-desc">${d.descricao}</span>
      <span class="expense-amount">${fmt(d.valor)}</span>
      <div class="expense-meta">
        <span class="cat-badge">${d.categoria_nome}</span>
        <span class="date-text">${fmtDate(d.data)}</span>
      </div>
      <button class="expense-delete" data-id="${d.id}" title="Excluir" aria-label="Excluir despesa">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14H6L5 6"/>
          <path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4h6v2"/>
        </svg>
      </button>
    </div>
  `;
}

function attachCardEvents(container) {
  $$('.expense-card', container).forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.expense-delete')) return;
      openDetail(card.dataset.id);
    });
  });

  $$('.expense-delete', container).forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteDespesa(btn.dataset.id);
    });
  });
}

async function loadDespesas(filtered = null) {
  const el = $('#despesas-list');
  el.innerHTML = '<p class="empty-state">Carregando…</p>';

  try {
    if (!filtered) {
      _allDespesas = await api.despesas.list();
      filtered = _allDespesas;
    }
    $('#despesas-count').textContent = filtered.length;
    if (!filtered.length) {
      el.innerHTML = '<p class="empty-state">Nenhuma despesa encontrada.</p>';
      return;
    }
    el.innerHTML = filtered.map(d => expenseCard(d)).join('');
    attachCardEvents(el);
  } catch {
    el.innerHTML = '<p class="empty-state">Erro ao carregar despesas.</p>';
  }
}

async function deleteDespesa(id) {
  if (!confirm('Excluir esta despesa?')) return;
  try {
    await api.despesas.remove(id);
    showToast('Despesa excluída.', 'success');
    if ($('#page-despesas').classList.contains('active')) loadDespesas();
    else loadDashboard();
  } catch {
    showToast('Erro ao excluir despesa.', 'error');
  }
}

async function openDetail(id) {
  try {
    const d = await api.despesas.get(id);
    $('#modal-body').innerHTML = `
      <div class="modal-row">
        <span class="modal-key">Descrição</span>
        <span class="modal-val">${d.descricao}</span>
      </div>
      <div class="modal-row">
        <span class="modal-key">Valor</span>
        <span class="modal-val" style="color:var(--emerald);font-weight:700">${fmt(d.valor)}</span>
      </div>
      <div class="modal-row">
        <span class="modal-key">Data</span>
        <span class="modal-val">${fmtDate(d.data)}</span>
      </div>
      <div class="modal-row">
        <span class="modal-key">Categoria</span>
        <span class="modal-val"><span class="cat-badge">${d.categoria_nome}</span></span>
      </div>
      <div class="modal-row">
        <span class="modal-key">ID</span>
        <span class="modal-val" style="font-size:.7rem;color:var(--text-faint)">${d.id}</span>
      </div>
      <div class="modal-actions">
        <button class="btn-danger w-100" id="modal-delete">Excluir despesa</button>
      </div>
    `;
    $('#modal-overlay').classList.remove('hidden');

    $('#modal-delete').addEventListener('click', () => {
      closeModal();
      deleteDespesa(d.id);
    });
  } catch {
    showToast('Erro ao carregar detalhes.', 'error');
  }
}

function closeModal() {
  $('#modal-overlay').classList.add('hidden');
}

$('#btn-filtrar').addEventListener('click', async () => {
  const ini = $('#f-inicio').value;
  const fim = $('#f-fim').value;
  if (!ini || !fim) { showToast('Informe as duas datas.', 'error'); return; }
  if (ini > fim)    { showToast('Data inicial maior que final.', 'error'); return; }
  try {
    const data = await api.despesas.periodo(ini, fim);
    loadDespesas(data);
  } catch {
    showToast('Erro ao filtrar despesas.', 'error');
  }
});

$('#btn-limpar').addEventListener('click', () => {
  $('#f-inicio').value = '';
  $('#f-fim').value    = '';
  loadDespesas();
});

$('#modal-close').addEventListener('click', closeModal);
$('#modal-overlay').addEventListener('click', (e) => {
  if (e.target === $('#modal-overlay')) closeModal();
});
