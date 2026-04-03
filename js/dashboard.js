async function loadDashboard() {
  const ini = firstOfMonth();
  const fim = today();

  $('#dash-period').textContent = `${fmtDate(ini)} – ${fmtDate(fim)}`;

  try {
    const resumo = await api.despesas.resumo();
    renderResumo(resumo);
  } catch {
    $('#dash-resumo').innerHTML = '<p class="empty-state">Erro ao carregar resumo.</p>';
  }

  try {
    const despMes = await api.despesas.periodo(ini, fim);
    const total = despMes.reduce((s, d) => s + d.valor, 0);
    $('#dash-total').textContent = fmt(total);
    renderRecentes(despMes.slice().reverse().slice(0, 5));
  } catch {
    $('#dash-total').textContent = fmt(0);
    $('#dash-recent').innerHTML = '<p class="empty-state">Nenhuma despesa este mês.</p>';
  }
}

function renderResumo(resumo) {
  const el = $('#dash-resumo');
  const total = resumo.reduce((s, r) => s + r.total, 0);

  if (!resumo.length || total === 0) {
    el.innerHTML = '<p class="empty-state">Sem dados para exibir.</p>';
    return;
  }

  const items = resumo
    .filter(r => r.total > 0)
    .map(r => {
      const pct = (r.total / total) * 100;
      return `
        <div class="resumo-item">
          <div class="resumo-top">
            <span class="resumo-nome">${r.categoria_nome}</span>
            <span class="resumo-valor">${fmt(r.total)}</span>
          </div>
          <div class="resumo-bar-track">
            <div class="resumo-bar-fill" style="width:${pct.toFixed(1)}%"></div>
          </div>
          <p class="resumo-qt">${r.quantidade} despesa${r.quantidade !== 1 ? 's' : ''} · ${pct.toFixed(0)}%</p>
        </div>
      `;
    }).join('');

  el.innerHTML = items || '<p class="empty-state">Nenhuma despesa registrada.</p>';
}

function renderRecentes(despesas) {
  const el = $('#dash-recent');
  if (!despesas.length) {
    el.innerHTML = '<p class="empty-state">Nenhuma despesa este mês.</p>';
    return;
  }
  el.innerHTML = despesas.map(d => expenseCard(d)).join('');
  attachCardEvents(el);
}
