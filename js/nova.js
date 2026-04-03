async function loadCatSelect() {
  const sel = $('#desp-cat');

  if (!$('#desp-data').value) $('#desp-data').value = today();

  sel.innerHTML = '<option value="">Carregando…</option>';
  try {
    const cats = await api.categorias.list();
    if (!cats.length) {
      sel.innerHTML = '<option value="">Nenhuma categoria disponível</option>';
      return;
    }
    sel.innerHTML =
      '<option value="">Selecione…</option>' +
      cats.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
  } catch {
    sel.innerHTML = '<option value="">Erro ao carregar</option>';
  }
}

$('#btn-add-desp').addEventListener('click', async () => {
  const desc  = $('#desp-desc').value.trim();
  const valor = parseFloat($('#desp-valor').value);
  const data  = $('#desp-data').value;
  const catId = $('#desp-cat').value;

  if (!desc)             { showToast('Informe a descrição.', 'error'); return; }
  if (!valor || valor <= 0) { showToast('Informe um valor válido.', 'error'); return; }
  if (!data)             { showToast('Informe a data.', 'error'); return; }
  if (!catId)            { showToast('Selecione uma categoria.', 'error'); return; }

  try {
    await api.despesas.create({ descricao: desc, valor, data, categoria_id: catId });
    showToast('Despesa registrada!', 'success');

    $('#desp-desc').value  = '';
    $('#desp-valor').value = '';
    $('#desp-data').value  = today();
    $('#desp-cat').value   = '';

    navigate('despesas');
  } catch (err) {
    const erros = err.data?.erros || [err.data?.erro] || ['Erro ao registrar despesa.'];
    showToast(erros[0], 'error');
  }
});
