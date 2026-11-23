'use strict';
/* ============ CATÁLOGO ============
   type: fixed = siempre lleva | on = lleva por defecto (se puede quitar)
         off = opcional sin costo | extra = opcional con costo (price)
   Los precios se pueden cambiar desde la pestaña Ajustes. */
const CATALOG = {
  hotdog: { name: 'Perro caliente', emoji: '🌭', price: 3, ing: [
    { id: 'salchicha', name: 'Salchicha', emoji: '🌭', type: 'fixed' },
    { id: 'pan', name: 'Pan', emoji: '🍞', type: 'fixed' },
    { id: 'papas', name: 'Papas hilo', emoji: '🍟', type: 'on' },
    { id: 'cebolla', name: 'Cebolla', emoji: '🧅', type: 'on' },
    { id: 'repollo', name: 'Repollo', emoji: '🥬', type: 'on' },
    { id: 'ketchup', name: 'Ketchup', emoji: '🍅', type: 'on' },
    { id: 'mayo', name: 'Mayonesa', emoji: '🥚', type: 'on' },
    { id: 'mostaza', name: 'Mostaza', emoji: '🟡', type: 'on' },
    { id: 'queso', name: 'Queso', emoji: '🧀', type: 'on' },
    { id: 'ajo', name: 'Salsa de ajo', emoji: '🧄', type: 'off' },
    { id: 'doritos', name: 'Doritos', emoji: '🔺', type: 'off' },
    { id: 'picante', name: 'Salsa picante', emoji: '🌶️', type: 'off' },
    { id: 'rosada', name: 'Salsa rosada', emoji: '🩷', type: 'off' },
    { id: 'tocino', name: 'Tocino', emoji: '🥓', type: 'extra', price: 1 },
    { id: 'maiz', name: 'Maíz', emoji: '🌽', type: 'extra', price: 0.5 },
  ]},
  burger: { name: 'Hamburguesa', emoji: '🍔', price: 5,
    variants: [
      { id: 'simple', name: 'Simple', price: 5, meats: [['Carne', '🥩']] },
      { id: 'doble', name: 'Doble', price: 7, meats: [['Carne', '🥩'], ['Pollo', '🍗']] },
      { id: 'triple', name: 'Triple', price: 9, meats: [['Carne', '🥩'], ['Pollo', '🍗'], ['Chuleta', '🍖']] },
    ], ing: [
    { id: 'pan', name: 'Pan', emoji: '🍞', type: 'fixed' },
    { id: 'lechuga', name: 'Lechuga', emoji: '🥬', type: 'on' },
    { id: 'tomate', name: 'Tomate', emoji: '🍅', type: 'on' },
    { id: 'cebolla', name: 'Cebolla', emoji: '🧅', type: 'on' },
    { id: 'ketchup', name: 'Ketchup', emoji: '🍅', type: 'on' },
    { id: 'mayo', name: 'Mayonesa', emoji: '🥚', type: 'on' },
    { id: 'mostaza', name: 'Mostaza', emoji: '🟡', type: 'on' },
    { id: 'queso', name: 'Queso', emoji: '🧀', type: 'on' },
    { id: 'ajo', name: 'Salsa de ajo', emoji: '🧄', type: 'off' },
    { id: 'doritos', name: 'Doritos', emoji: '🔺', type: 'off' },
    { id: 'picante', name: 'Salsa picante', emoji: '🌶️', type: 'off' },
    { id: 'rosada', name: 'Salsa rosada', emoji: '🩷', type: 'off' },
    { id: 'tocino', name: 'Tocino', emoji: '🥓', type: 'extra', price: 1 },
    { id: 'maiz', name: 'Maíz', emoji: '🌽', type: 'extra', price: 0.5 },
  ]},
  // Provisional: ajusta los ingredientes del pepito cuando los definamos.
  pepito: { name: 'Pepito', emoji: '🥪', price: 5.5, ing: [
    { id: 'pan', name: 'Pan', emoji: '🍞', type: 'fixed' },
    { id: 'carne', name: 'Carne', emoji: '🥩', type: 'fixed' },
    { id: 'lechuga', name: 'Lechuga', emoji: '🥬', type: 'on' },
    { id: 'tomate', name: 'Tomate', emoji: '🍅', type: 'on' },
    { id: 'ketchup', name: 'Ketchup', emoji: '🔴', type: 'on' },
    { id: 'mayo', name: 'Mayonesa', emoji: '🥚', type: 'on' },
    { id: 'mostaza', name: 'Mostaza', emoji: '🟡', type: 'on' },
    { id: 'cebolla', name: 'Cebolla', emoji: '🧅', type: 'off' },
    { id: 'papas', name: 'Papas hilo', emoji: '🍟', type: 'off' },
    { id: 'queso', name: 'Queso', emoji: '🧀', type: 'off' },
    { id: 'tocino', name: 'Tocino', emoji: '🥓', type: 'extra', price: 1 },
    { id: 'maiz', name: 'Maíz', emoji: '🌽', type: 'extra', price: 0.5 },
  ]},
};

/* ============ ESTADO ============ */
const load = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = s => document.querySelector(s);
const today = () => new Date().toISOString().slice(0, 10);

const S = {
  orders: load('cr_orders', []),
  draft: load('cr_draft', { customer: '', items: [] }),
  counter: load('cr_counter', { date: today(), n: 0 }),
  prices: load('cr_prices', {}),
  tab: 'new', filter: 'pending', builder: null,
};
const persist = () => { save('cr_orders', S.orders); save('cr_draft', S.draft); save('cr_counter', S.counter); save('cr_prices', S.prices); };

/* ============ LÓGICA ============ */
const variantOf = (pid, v) => CATALOG[pid].variants?.find(x => x.id === v) ?? CATALOG[pid].variants?.[0];
const baseP = (pid, v) => { const vr = variantOf(pid, v);
  if (!vr) return S.prices[pid] ?? CATALOG[pid].price;
  const first = vr === CATALOG[pid].variants[0];   // el precio antiguo de "Hamburguesa" pasa a "Simple"
  return S.prices[pid + '.' + vr.id] ?? (first ? S.prices[pid] : undefined) ?? vr.price; };
const extraP = (pid, ing) => S.prices[pid + '.' + ing.id] ?? ing.price;
const money = n => '$' + Number(n).toLocaleString('es-CO', { maximumFractionDigits: 2 });
const itemName = it => { const vr = variantOf(it.pid, it.v); return CATALOG[it.pid].name + (vr ? ' ' + vr.name.toLowerCase() : ''); };
const defaults = pid => CATALOG[pid].ing.filter(i => i.type === 'on').map(i => i.id);
const unit = (pid, sel, v) => baseP(pid, v) + CATALOG[pid].ing
  .filter(i => i.type === 'extra' && sel.includes(i.id)).reduce((t, i) => t + extraP(pid, i), 0);
const lineTotal = it => unit(it.pid, it.sel, it.v) * it.qty;
const orderTotal = o => o.items.reduce((t, it) => t + lineTotal(it), 0);

function tagsOf(it) {
  const tags = [];
  for (const i of CATALOG[it.pid].ing) {
    const has = it.sel.includes(i.id);
    if (i.type === 'on' && !has) tags.push(['sin', 'SIN ' + i.name.toLowerCase()]);
    else if (i.type === 'off' && has) tags.push(['con', 'CON ' + i.name.toLowerCase()]);
    else if (i.type === 'extra' && has) tags.push(['extra', 'EXTRA ' + i.name.toLowerCase()]);
  }
  return tags.length ? tags : [['full', 'Normal (completo)']];
}
const tagsHtml = it => tagsOf(it).map(([c, t]) => `<span class="tag ${c}">${esc(t)}</span>`).join('');

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 1600);
}
const ago = ts => { const m = Math.floor((Date.now() - ts) / 60000); return m < 1 ? 'ahora' : m < 60 ? `hace ${m} min` : `hace ${Math.floor(m / 60)} h`; };
const hhmm = ts => new Date(ts).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });

/* ============ VISTAS ============ */
function render() {
  const pending = S.orders.filter(o => o.status === 'pending').length;
  $('#tabs').innerHTML = [['new', '➕', 'Nuevo'], ['orders', '📋', 'Pedidos'], ['settings', '⚙️', 'Ajustes']]
    .map(([k, ic, l]) => `<button class="${S.tab === k ? 'on' : ''}" data-act="tab" data-v="${k}">
      <span class="ic">${ic}</span>${l}${k === 'orders' && pending ? `<span class="badge">${pending}</span>` : ''}</button>`).join('');
  const titles = { new: 'Nuevo pedido', orders: 'Pedidos', settings: 'Ajustes' };
  $('#top').innerHTML = `<h1>🌭 ${titles[S.tab]}</h1><small>${S.tab === 'new' ? 'Pedido #' + (nextNum()) : ''}</small>`;
  const v = $('#view');
  v.innerHTML = S.tab === 'new' ? viewNew() : S.tab === 'orders' ? viewOrders() : viewSettings();
}
const nextNum = () => (S.counter.date === today() ? S.counter.n : 0) + 1;

function viewNew() {
  const d = S.draft;
  const prods = Object.entries(CATALOG).map(([id, p]) => `
    <button class="prod" data-act="add" data-pid="${id}"><span class="em">${p.emoji}</span>
    <span class="nm">${p.name}</span><span class="pr">${p.variants ? 'desde ' + money(Math.min(...p.variants.map(v => baseP(id, v.id)))) : money(baseP(id))}</span></button>`).join('');
  const lines = d.items.map((it, i) => `
    <div class="line">
      <span class="em">${CATALOG[it.pid].emoji}</span>
      <div class="tt">${it.qty}× ${itemName(it)}</div><div class="amt">${money(lineTotal(it))}</div>
      <div class="tags">${tagsHtml(it)}</div>
      <div class="acts">
        <div class="step"><button data-act="qty" data-i="${i}" data-d="-1">−</button><b>${it.qty}</b><button data-act="qty" data-i="${i}" data-d="1">+</button></div>
        <button class="btn sm" data-act="edit" data-i="${i}">✏️ Editar</button>
        <button class="btn sm" data-act="dup" data-i="${i}">⧉ Otro igual</button>
        <span class="sp"></span>
        <button class="btn sm bad" data-act="del" data-i="${i}">🗑</button>
      </div>
    </div>`).join('');
  const total = d.items.reduce((t, it) => t + lineTotal(it), 0);
  const count = d.items.reduce((t, it) => t + it.qty, 0);
  return `
    <input class="name-in" id="cust" placeholder="Cliente (opcional)" value="${esc(d.customer)}" autocomplete="off">
    <h2 class="sec">Toca para agregar</h2><div class="products">${prods}</div>
    <h2 class="sec">En este pedido ${count ? '(' + count + ')' : ''}</h2>
    ${lines || `<div class="empty"><span class="em">🛎️</span>Aún no hay nada.<br>Elige un producto arriba.</div>`}
    ${d.items.length ? `<div class="cta"><button class="btn pri" data-act="send"><span>👨‍🍳 Enviar a cocina</span><span>${money(total)}</span></button></div>` : ''}`;
}

function viewOrders() {
  const f = S.filter;
  const cnt = s => S.orders.filter(o => o.status === s).length;
  const list = S.orders.filter(o => o.status === f).sort((a, b) => f === 'done' ? b.created - a.created : a.created - b.created);
  const sold = S.orders.reduce((t, o) => t + orderTotal(o), 0);
  const cards = list.map(o => `
    <div class="ord ${o.status}">
      <div class="hd"><span><span class="num">#${o.num}</span> <span class="who">${esc(o.customer || '')}</span></span>
        <span class="when">${hhmm(o.created)} · ${ago(o.created)}</span></div>
      ${o.items.map(it => `<div class="it"><span class="q">${it.qty}× <span class="ie">${CATALOG[it.pid].emoji}</span> ${itemName(it)}</span>${variantOf(it.pid, it.v) ? `<small class="meats"> · ${variantOf(it.pid, it.v).meats.map(m => m[0]).join(' + ')}</small>` : ''}<br>${tagsHtml(it)}</div>`).join('')}
      <div class="ft"><b>${money(orderTotal(o))}</b><span class="sp"></span>
        ${o.status !== 'pending' ? `<button class="btn sm" data-act="back" data-id="${o.id}">↩</button>` : ''}
        <button class="btn sm bad" data-act="cancel" data-id="${o.id}">🗑</button>
        ${o.status === 'pending' ? `<button class="btn ok" data-act="next" data-id="${o.id}">✅ Listo</button>` : ''}
        ${o.status === 'ready' ? `<button class="btn warn" data-act="next" data-id="${o.id}">🤝 Entregado</button>` : ''}
      </div>
    </div>`).join('');
  const lbl = { pending: '⏳ En cocina', ready: '✅ Listos', done: '🤝 Entregados' };
  return `
    <div class="sum"><span>Pedidos de hoy: <b>${S.orders.length}</b></span><span>Total: <b>${money(sold)}</b></span></div>
    <div class="seg">${Object.entries(lbl).map(([k, l]) => `<button class="${f === k ? 'on' : ''}" data-act="filter" data-v="${k}">${l} (${cnt(k)})</button>`).join('')}</div>
    ${cards || `<div class="empty"><span class="em">😴</span>Nada por aquí.</div>`}`;
}

function viewSettings() {
  const rows = Object.entries(CATALOG).map(([pid, p]) => `
    <div class="set">${p.variants
      ? p.variants.map(v => `<div class="row"><span class="l"><b>${p.emoji} ${p.name} ${v.name.toLowerCase()}</b><br><small>Precio base</small></span>
      <input type="number" step="any" min="0" inputmode="decimal" data-price="${pid}.${v.id}" value="${baseP(pid, v.id)}"></div>`).join('')
      : `<div class="row"><span class="l"><b>${p.emoji} ${p.name}</b><br><small>Precio base</small></span>
      <input type="number" step="any" min="0" inputmode="decimal" data-price="${pid}" value="${baseP(pid)}"></div>`}
      ${p.ing.filter(i => i.type === 'extra').map(i => `<div class="row"><span class="l">${i.emoji} Extra ${i.name.toLowerCase()}</span>
        <input type="number" step="0.1" min="0" inputmode="decimal" data-price="${pid}.${i.id}" value="${extraP(pid, i)}"></div>`).join('')}
    </div>`).join('');
  return `<h2 class="sec">Precios</h2>${rows}
    <h2 class="sec">Día</h2>
    <button class="btn bad" style="width:100%;padding:14px" data-act="reset">Cerrar día (borrar pedidos de hoy)</button>
    <p class="empty" style="padding:14px"><small>Los datos se guardan en este teléfono.</small></p>`;
}

/* ============ CONSTRUCTOR ============ */
function openBuilder(pid, item, idx) {
  S.builder = { pid, v: item?.v ?? CATALOG[pid].variants?.[0].id, sel: item ? [...item.sel] : defaults(pid), qty: item ? item.qty : 1, idx: idx ?? null };
  renderBuilder();
}
function renderBuilder() {
  const b = S.builder, sh = $('#sheet');
  if (!b) { sh.hidden = true; return; }
  const p = CATALOG[b.pid];
  const grp = (type, title) => {
    const items = p.ing.filter(i => i.type === type);
    if (!items.length) return '';
    return `<h2 class="sec">${title}</h2><div class="grid">${items.map(i => {
      const on = b.sel.includes(i.id);
      const st = i.type === 'on' ? (on ? '✓ CON' : 'SIN') : i.type === 'off' ? (on ? '✓ CON' : '+ agregar') : (on ? '✓ ' : '+ ') + money(extraP(b.pid, i));
      // (b.v se usa abajo para el total)
      return `<button class="tile ${on ? 'on' : 'off'} ${i.type === 'on' ? 'def' : ''} ${i.type === 'extra' ? 'xtra' : ''}" data-act="tog" data-id="${i.id}">
        <span class="em">${i.emoji}</span><span class="nm">${i.name}</span><span class="st">${st}</span></button>`;
    }).join('')}</div>`;
  };
  const vr = variantOf(b.pid, b.v);
  const fixedList = [...p.ing.filter(i => i.type === 'fixed').map(i => [i.name, i.emoji]), ...(vr ? vr.meats : [])];
  const fixed = fixedList.map(([n, e]) => `<span class="c">${e} ${n}</span>`).join('');
  const picker = p.variants ? `<div class="vars">${p.variants.map(v => `<button class="${v.id === b.v ? 'on' : ''}" data-act="bvar" data-v="${v.id}">
      <b>${v.name}</b><span>${v.meats.map(m => m[1]).join('')}</span><small>${money(baseP(b.pid, v.id))}</small></button>`).join('')}</div>` : '';
  sh.innerHTML = `
    <div class="sh-head"><button class="x" data-act="closeSheet">✕</button><h2>${p.emoji} ${p.name}${vr ? ' ' + vr.name.toLowerCase() : ''}</h2></div>
    <div class="sh-body">
      ${picker}
      <div class="fixed">Siempre lleva: ${fixed}</div>
      ${grp('on', 'Incluidos · toca para quitar')}${grp('off', 'Opcionales · toca para agregar')}${grp('extra', 'Extras con costo')}
    </div>
    <div class="sh-foot">
      <div class="step"><button data-act="bqty" data-d="-1">−</button><b>${b.qty}</b><button data-act="bqty" data-d="1">+</button></div>
      <button class="btn pri" data-act="bsave"><span>${b.idx === null ? 'Agregar' : 'Guardar'}</span><span>${money(unit(b.pid, b.sel, b.v) * b.qty)}</span></button>
    </div>`;
  const keep = sh.querySelector('.sh-body'); sh.hidden = false;
  if (b.scroll) keep.scrollTop = b.scroll;
}

/* ============ EVENTOS ============ */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act, d = S.draft, i = +el.dataset.i, id = +el.dataset.id;
  const ord = () => S.orders.find(o => o.id === id);
  const b = S.builder;
  switch (a) {
    case 'tab': S.tab = el.dataset.v; break;
    case 'filter': S.filter = el.dataset.v; break;
    case 'add': openBuilder(el.dataset.pid); return;
    case 'edit': openBuilder(d.items[i].pid, d.items[i], i); return;
    case 'dup': { const c = JSON.parse(JSON.stringify(d.items[i])); c.qty = 1; d.items.splice(i + 1, 0, c); openBuilder(c.pid, c, i + 1); return; }
    case 'del': d.items.splice(i, 1); break;
    case 'qty': d.items[i].qty = Math.max(1, d.items[i].qty + +el.dataset.d); break;
    case 'send': {
      if (!d.items.length) return;
      if (S.counter.date !== today()) S.counter = { date: today(), n: 0 };
      S.counter.n++;
      S.orders.push({ id: Date.now(), num: S.counter.n, customer: d.customer.trim(), items: d.items, status: 'pending', created: Date.now() });
      S.draft = { customer: '', items: [] }; S.tab = 'orders'; S.filter = 'pending';
      toast('Pedido #' + S.counter.n + ' enviado 👨‍🍳'); break;
    }
    case 'next': { const o = ord(); o.status = o.status === 'pending' ? 'ready' : 'done'; break; }
    case 'back': { const o = ord(); o.status = o.status === 'done' ? 'ready' : 'pending'; break; }
    case 'cancel': if (confirm('¿Eliminar este pedido?')) S.orders = S.orders.filter(o => o.id !== id); break;
    case 'reset': if (confirm('¿Borrar todos los pedidos y reiniciar la numeración?')) { S.orders = []; S.counter = { date: today(), n: 0 }; } break;
    case 'closeSheet': S.builder = null; renderBuilder(); return;
    case 'tog': {
      b.scroll = $('#sheet .sh-body').scrollTop;
      const k = el.dataset.id; b.sel = b.sel.includes(k) ? b.sel.filter(x => x !== k) : [...b.sel, k];
      renderBuilder(); return;
    }
    case 'bvar': b.scroll = $('#sheet .sh-body').scrollTop; b.v = el.dataset.v; renderBuilder(); return;
    case 'bqty': b.scroll = $('#sheet .sh-body').scrollTop; b.qty = Math.max(1, b.qty + +el.dataset.d); renderBuilder(); return;
    case 'bsave': {
      const item = { pid: b.pid, v: b.v, sel: b.sel, qty: b.qty };
      if (b.idx === null) d.items.push(item); else d.items[b.idx] = item;
      S.builder = null; renderBuilder(); toast('Agregado ✔'); break;
    }
  }
  persist(); render();
});
document.addEventListener('input', e => {
  if (e.target.id === 'cust') { S.draft.customer = e.target.value; persist(); }
  else if (e.target.dataset.price) {
    const v = parseFloat(e.target.value); if (!isNaN(v) && v >= 0) { S.prices[e.target.dataset.price] = v; persist(); }
  }
});
setInterval(() => { if (S.tab === 'orders' && !document.activeElement?.matches('input')) render(); }, 30000);

render();
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
