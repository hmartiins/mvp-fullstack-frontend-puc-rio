const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function fmt(value) {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency', currency: 'BRL',
  });
}

function fmtDate(iso) {
  if (!iso) return '';
  const [, m, d] = iso.split('-');
  const y = iso.split('-')[0];
  return `${d}/${m}/${y}`;
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function firstOfMonth() {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().split('T')[0];
}

/* deterministic color index from a string */
function colorIdx(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffffffff;
  return Math.abs(h) % 8;
}

const CAT_ICONS = ['◆', '●', '▲', '★', '♦', '◉', '▶', '◐'];
