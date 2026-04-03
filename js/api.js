/* ============================================================
   api.js — client for controle-gastos-api (http://localhost:5001)
   ============================================================ */

const BASE = 'http://localhost:5001';

/* helper: fetch + JSON */
async function request(method, path, body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== null) opts.body = JSON.stringify(body);
  const res = await fetch(BASE + path, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, data };
  return data;
}

/* ---- CATEGORIAS ---- */
const api = {
  categorias: {
    list: ()         => request('GET',    '/categorias'),
    create: (body)   => request('POST',   '/categorias', body),
    remove: (id)     => request('DELETE', `/categorias/${id}`),
  },

  despesas: {
    list: ()           => request('GET',    '/despesas'),
    get:  (id)         => request('GET',    `/despesas/${id}`),
    create: (body)     => request('POST',   '/despesas', body),
    remove: (id)       => request('DELETE', `/despesas/${id}`),
    resumo: ()         => request('GET',    '/despesas/resumo'),
    periodo: (ini, fim) =>
      request('GET', `/despesas/periodo?data_inicio=${ini}&data_fim=${fim}`),
  },
};
