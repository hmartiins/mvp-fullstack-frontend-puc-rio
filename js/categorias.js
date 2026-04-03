let _categorias = [];
let _resumo     = [];

async function loadCategorias() {
  const el = $('#cat-list');
  el.innerHTML = '<p class="empty-state">Carregando…</p>';

  try {
    /* fetch list and spending summary in parallel */
    [_categorias, _resumo] = await Promise.all([
      api.categorias.list(),
      api.despesas.resumo(),
    ]);

    $('#cat-count').textContent = _categorias.length;

    if (!_categorias.length) {
      el.innerHTML = '<p class="empty-state">Nenhuma categoria cadastrada.</p>';
      return;
    }

    el.innerHTML = _categorias.map(c => {
      const ci   = colorIdx(c.nome);
      const icon = CAT_ICONS[ci];
      const res  = _resumo.find(r => r.categoria_id === c.id);
      const total = res ? res.total : 0;
      const qt    = res ? res.quantidade : 0;
      const subtitle = c.descricao
        || (qt ? `${qt} despesa${qt !== 1 ? 's' : ''} · ${fmt(total)}` : 'Sem despesas');

      return `
        <div class="cat-card">
          <div class="cat-dot dot-${ci}">${icon}</div>
          <div class="cat-info">
            <p class="cat-nome">${c.nome}</p>
            <p class="cat-desc">${subtitle}</p>
          </div>
          <button class="cat-delete" data-id="${c.id}" data-nome="${c.nome}" title="Excluir">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      `;
    }).join('');

    $$('.cat-delete').forEach(btn => {
      btn.addEventListener('click', () => deleteCategoria(btn.dataset.id, btn.dataset.nome));
    });

  } catch {
    el.innerHTML = '<p class="empty-state">Erro ao carregar categorias.</p>';
  }
}

async function deleteCategoria(id, nome) {
  if (!confirm(`Excluir a categoria "${nome}"?`)) return;
  try {
    await api.categorias.remove(id);
    showToast('Categoria excluída.', 'success');
    loadCategorias();
  } catch (err) {
    showToast(err.data?.erro || 'Erro ao excluir.', 'error');
  }
}

/* ---- add category ---- */
$('#btn-add-cat').addEventListener('click', async () => {
  const nome = $('#cat-nome').value.trim();
  const desc = $('#cat-desc').value.trim();

  if (!nome) { showToast('Informe o nome da categoria.', 'error'); return; }

  try {
    await api.categorias.create({ nome, descricao: desc || null });
    showToast('Categoria criada!', 'success');
    $('#cat-nome').value = '';
    $('#cat-desc').value = '';
    loadCategorias();
  } catch (err) {
    showToast(err.data?.erro || 'Erro ao criar categoria.', 'error');
  }
});
