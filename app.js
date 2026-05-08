// ===== CONSTANTS =====
const STORAGE_KEY = 'dinero_v1'
const CLAUDE_API = 'https://api.anthropic.com/v1/messages'

const EXPENSE_CATS = [
  { id: 'housing',     name: 'Жильё + комуслуги',  icon: 'home',         color: '#6366f1' },
  { id: 'kaspi',       name: 'Каспи',               icon: 'credit-card',  color: '#f59e0b' },
  { id: 'otbasy',      name: 'Отбасы банк',         icon: 'landmark',     color: '#3b82f6' },
  { id: 'installment', name: 'Рассрочка',            icon: 'file-text',    color: '#8b5cf6' },
  { id: 'credit',      name: 'Кредит',               icon: 'alert-circle', color: '#ef4444' },
  { id: 'workout',     name: 'Тренировка',           icon: 'activity',     color: '#10b981' },
  { id: 'phone',       name: 'Тариф (телефон)',      icon: 'smartphone',   color: '#06b6d4' },
  { id: 'transport',   name: 'Транспорт',            icon: 'car',          color: '#f97316' },
  { id: 'food',        name: 'Еда',                  icon: 'shopping-bag', color: '#84cc16' },
  { id: 'other_exp',   name: 'Прочее',               icon: 'box',          color: '#6b7280' },
]

const INCOME_CATS = [
  { id: 'salary',       name: 'Зарплата',          icon: 'briefcase',    color: '#10b981' },
  { id: 'advance',      name: 'Аванс',             icon: 'wallet',       color: '#34d399' },
  { id: 'bonus',        name: 'Бонус / Допка',     icon: 'gift',         color: '#a3e635' },
  { id: 'compensation', name: 'Компенсация',       icon: 'shield',       color: '#4ade80' },
  { id: 'other_inc',    name: 'Прочие доходы',     icon: 'plus-circle',  color: '#6ee7b7' },
]

// ===== SVG ICONS =====
const ICONS = {
  'home':          '<path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1v-9.5z"/><path d="M9 21v-8h6v8"/>',
  'credit-card':   '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/>',
  'landmark':      '<line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polyline points="2 11 12 2 22 11"/>',
  'file-text':     '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  'alert-circle':  '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  'activity':      '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  'smartphone':    '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>',
  'car':           '<path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h11l4 4 1 3v3a2 2 0 01-2 2h-1"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="17.5" cy="17" r="1.5"/>',
  'shopping-bag':  '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>',
  'box':           '<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 001 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  'briefcase':     '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>',
  'wallet':        '<path d="M20 12V22H4a2 2 0 01-2-2V4a2 2 0 012-2h16v8"/><path d="M20 12a2 2 0 000 4h4V12z"/>',
  'gift':          '<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>',
  'shield':        '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  'plus-circle':   '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',
  'star':          '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  'settings':      '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>',
  'bar-chart':     '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  'download':      '<polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29"/>',
  'upload':        '<polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29"/>',
  'cpu':           '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>',
  'key':           '<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>',
  'alert-triangle':'<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  'check-circle':  '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  'trending-up':   '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  'trending-down': '<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>',
  'receipt':       '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1V2l-2 1-2-1-2 1-2-1-2 1-2-1z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/>',
  'info':          '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12.01" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/>',
  'help-circle':   '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  'tag':           '<path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
  'flag':          '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
  'target':        '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  'trash':         '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>',
  'edit-2':        '<path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>',
  'plus':          '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
}

function getIcon(name, size = 18) {
  const paths = ICONS[name] || ICONS['help-circle']
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex-shrink:0">${paths}</svg>`
}

const ALL_CATS = { expense: EXPENSE_CATS, income: INCOME_CATS }

const MONTH_NAMES = [
  'Январь','Февраль','Март','Апрель','Май','Июнь',
  'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'
]

// ===== STATE =====
let state = {
  tab: 'home',
  budgetSubtab: 'income',
  txFilter: 'all',
  viewMonthKey: '',
  analyticsMonthKey: '',
  txType: 'expense',
  txCategoryId: '',
  editingTx: null,
  openSubcats: new Set(),
  expandedGoals: new Set(),
}

// ===== STORAGE =====
function loadData() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData()
    if (!d.goals) d.goals = []
    if (!d.settings.catNames) d.settings.catNames = {}
    if (!d.settings.customCats) d.settings.customCats = { expense: [], income: [] }
    // Migrate goals: add monthlyPlans, add ids to existing contributions
    d.goals.forEach(g => {
      if (!g.monthlyPlans) g.monthlyPlans = []
      if (!g.contributions) g.contributions = []
      g.contributions.forEach(c => { if (!c.id) c.id = uid() })
    })
    return d
  } catch { return defaultData() }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

function defaultData() {
  return {
    months: {}, transactions: [], goals: [],
    settings: { claudeApiKey: '', currency: '₸', catNames: {}, customCats: { expense: [], income: [] } }
  }
}

let db = loadData()

function getMonthData(key) {
  if (!db.months[key]) db.months[key] = defaultMonth()
  return db.months[key]
}

function defaultMonth() {
  const income = {}
  getIncCats().forEach(c => income[c.id] = { plan: 0 })
  const expenses = {}
  getExpCats().forEach(c => expenses[c.id] = { plan: 0 })
  return { income, expenses, wishlist: [], analysis: null, subcats: {} }
}

// ===== DYNAMIC CATEGORY HELPERS =====
const CAT_COLORS = ['#6366f1','#f59e0b','#3b82f6','#8b5cf6','#ef4444','#10b981','#06b6d4','#f97316','#84cc16','#6b7280','#ec4899','#14b8a6']

function getExpCats() {
  const names = db?.settings?.catNames || {}
  const custom = (db?.settings?.customCats?.expense || [])
  return [
    ...EXPENSE_CATS.map(c => ({ ...c, name: names[c.id] || c.name })),
    ...custom.map(c => ({ ...c, icon: c.icon || 'tag' }))
  ]
}

function getIncCats() {
  const names = db?.settings?.catNames || {}
  const custom = (db?.settings?.customCats?.income || [])
  return [
    ...INCOME_CATS.map(c => ({ ...c, name: names[c.id] || c.name })),
    ...custom.map(c => ({ ...c, icon: c.icon || 'tag' }))
  ]
}

// ===== HELPERS =====
function fmt(n) {
  if (!n && n !== 0) return '—'
  return Math.round(n).toLocaleString('ru-RU') + ' ' + db.settings.currency
}

function fmtNum(n) {
  if (!n && n !== 0) return ''
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function fmtShort(n) {
  if (!n && n !== 0) return '0'
  const abs = Math.abs(n)
  if (abs >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (abs >= 1000) return (n / 1000).toFixed(0) + 'k'
  return String(Math.round(n))
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function monthKey(year, month) {
  return `${year}-${String(month).padStart(2, '0')}`
}

function parseKey(key) {
  const [y, m] = key.split('-')
  return { year: parseInt(y), month: parseInt(m) }
}

function monthLabel(key) {
  const { year, month } = parseKey(key)
  return `${MONTH_NAMES[month - 1]} ${year}`
}

function currentMonthKey() {
  const d = new Date()
  return monthKey(d.getFullYear(), d.getMonth() + 1)
}

function prevMonthKey(key) {
  const { year, month } = parseKey(key)
  return month === 1 ? monthKey(year - 1, 12) : monthKey(year, month - 1)
}

function nextMonthKey(key) {
  const { year, month } = parseKey(key)
  return month === 12 ? monthKey(year + 1, 1) : monthKey(year, month + 1)
}

function getCat(type, id) {
  const cats = type === 'expense' ? getExpCats() : getIncCats()
  return cats.find(c => c.id === id) || { id, name: id, icon: 'help-circle', color: '#999' }
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

// ===== COMPUTE ACTUALS =====
function getActuals(monthKey) {
  const txs = db.transactions.filter(t => t.monthKey === monthKey)
  const income = {}
  const expense = {}
  getIncCats().forEach(c => income[c.id] = 0)
  getExpCats().forEach(c => expense[c.id] = 0)
  txs.forEach(t => {
    if (t.type === 'income') income[t.categoryId] = (income[t.categoryId] || 0) + t.amount
    else expense[t.categoryId] = (expense[t.categoryId] || 0) + t.amount
  })
  return { income, expense }
}

function totalIncome(key) {
  const { income } = getActuals(key)
  return Object.values(income).reduce((a, b) => a + b, 0)
}

function totalExpense(key) {
  const { expense } = getActuals(key)
  return Object.values(expense).reduce((a, b) => a + b, 0)
}

function getEffectivePlan(m, type, catId) {
  const subs = (m.subcats || {})[catId] || []
  if (subs.length > 0) return subs.reduce((a, s) => a + (s.amount || 0), 0)
  const data = type === 'income' ? m.income[catId] : m.expenses[catId]
  return data?.plan || 0
}

function planTotalIncome(key) {
  const m = getMonthData(key)
  return getIncCats().reduce((a, c) => a + getEffectivePlan(m, 'income', c.id), 0)
}

function planTotalExpense(key) {
  const m = getMonthData(key)
  return getExpCats().reduce((a, c) => a + getEffectivePlan(m, 'expense', c.id), 0)
}

// ===== RENDER HELPERS =====
function el(id) { return document.getElementById(id) }

function setHTML(id, html) {
  const e = el(id)
  if (e) e.innerHTML = html
}

// ===== RENDER HOME =====
function renderHome() {
  const key = state.viewMonthKey
  const actuals = getActuals(key)
  const incTotal = Object.values(actuals.income).reduce((a, b) => a + b, 0)
  const expTotal = Object.values(actuals.expense).reduce((a, b) => a + b, 0)
  const balance = incTotal - expTotal
  const cur = db.settings.currency

  el('balance-amount').textContent = fmt(balance)
  el('home-income').textContent = fmtShort(incTotal) + ' ' + cur
  el('home-expense').textContent = fmtShort(expTotal) + ' ' + cur

  const m = getMonthData(key)
  const catItems = getExpCats().map(cat => {
    const plan = m.expenses[cat.id]?.plan || 0
    const actual = actuals.expense[cat.id] || 0
    if (plan === 0 && actual === 0) return ''
    const pct = plan > 0 ? Math.min((actual / plan) * 100, 100) : 0
    const over = plan > 0 && actual > plan
    return `
      <div class="cat-progress-item">
        <div class="cat-progress-header">
          <div class="cat-progress-name">
            <div class="cat-icon-wrap" style="background:${cat.color}18;color:${cat.color}">${getIcon(cat.icon, 16)}</div>
            <span>${cat.name}</span>
          </div>
          <div class="cat-progress-right">
            <div class="cat-progress-amounts">
              <span class="actual">${fmtShort(actual)}</span>${plan ? ' <span style="opacity:.45">/ ' + fmtShort(plan) + '</span>' : ''} ${cur}
            </div>
            ${over ? '<span class="badge badge-over">+' + fmtShort(actual - plan) + '</span>' : ''}
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%;background:${over ? 'var(--danger)' : cat.color}"></div>
        </div>
      </div>`
  }).join('')

  setHTML('home-cat-list', catItems || '<div class="cat-progress-item" style="color:var(--text-muted);font-size:13px;text-align:center;padding:32px">Нет данных за этот месяц</div>')
}

// ===== RENDER BUDGET =====
function renderBudget() {
  const key = state.viewMonthKey
  const m = getMonthData(key)
  const actuals = getActuals(key)
  const sub = state.budgetSubtab
  const cur = db.settings.currency

  function budgetRow(cat, baseActual, type) {
    const subs = (m.subcats || {})[cat.id] || []
    const effectivePlan = getEffectivePlan(m, type, cat.id)
    const actual = baseActual
    const diff = type === 'income' ? actual - effectivePlan : effectivePlan - actual
    const diffClass = diff > 0 ? 'diff-pos' : diff < 0 ? 'diff-neg' : ''
    const hasSubs = subs.length > 0
    const isCustom = !!(db.settings.customCats?.[type] || []).find(c => c.id === cat.id)

    const subsHtml = subs.map((s, i) => `
      <div class="subcat-row">
        <div class="subcat-dot" style="background:${cat.color}"></div>
        <input class="subcat-name-input" type="text" value="${s.name}" placeholder="Название..."
          onblur="updateSubcatName('${cat.id}','${type}',${i},this.value)">
        <input class="subcat-amount-input" type="text" inputmode="numeric"
          value="${s.amount ? fmtNum(s.amount) : ''}" placeholder="0"
          onfocus="this.value=this.value.replace(/\\s/g,'')"
          oninput="this.value=this.value.replace(/[^0-9]/g,'')"
          onblur="updateSubcatAmount('${cat.id}','${type}',${i},this.value)">
        <button class="subcat-del-btn" onclick="deleteSubcat('${cat.id}','${type}',${i})">${getIcon('trash',12)}</button>
      </div>`).join('')

    return `
      <div class="budget-row-wrap">
        <div class="budget-row" onclick="toggleSubcats('${cat.id}')">
          <div class="budget-cat-name">
            <span class="budget-cat-icon" style="color:${cat.color}">${getIcon(cat.icon, 16)}</span>
            <span class="cat-name-label" onclick="event.stopPropagation();openRenameCat('${cat.id}','${type}')">${cat.name}</span>
            ${hasSubs ? `<span class="subcat-badge">${subs.length}</span>` : ''}
            ${isCustom ? `<button class="cat-delete-btn" onclick="event.stopPropagation();deleteCustomCat('${cat.id}','${type}')">${getIcon('trash',12)}</button>` : ''}
          </div>
          <div class="budget-cell plan" onclick="event.stopPropagation()">
            ${hasSubs
              ? `<span class="plan-locked">${fmtNum(effectivePlan)}</span>`
              : `<input class="plan-input" type="text" inputmode="numeric"
                  value="${effectivePlan ? fmtNum(effectivePlan) : ''}" placeholder="0"
                  data-type="${type}" data-cat="${cat.id}"
                  onfocus="this.value=this.value.replace(/\\s/g,'')"
                  oninput="this.value=this.value.replace(/[^0-9]/g,'')"
                  onblur="updatePlan(this)">`}
          </div>
          <div class="budget-cell actual">${actual ? fmtShort(actual) : '—'}</div>
          <div class="budget-cell ${diffClass}">${diff ? (diffClass === 'diff-pos' ? '+' : '') + fmtShort(Math.abs(diff)) : '—'}</div>
        </div>
        <div class="subcats-wrap" id="subcats-${cat.id}" style="display:${state.openSubcats.has(cat.id) ? 'block' : 'none'}">
          ${subsHtml}
          <button class="subcat-add-btn" onclick="addSubcat('${cat.id}','${type}')">${getIcon('plus',13)} Добавить подпункт</button>
        </div>
      </div>`
  }

  if (sub === 'income') {
    let rows = getIncCats().map(cat => {
      const actual = actuals.income[cat.id] || 0
      return budgetRow(cat, actual, 'income')
    }).join('')

    const planTotal = planTotalIncome(key)
    const actualTotal = totalIncome(key)
    const diffTotal = actualTotal - planTotal

    setHTML('budget-content', `
      <div class="budget-row-header">
        <div>Категория</div><div style="text-align:right">План</div>
        <div style="text-align:right">Факт</div><div style="text-align:right">Разница</div>
      </div>
      ${rows}
      <div class="budget-add-cat-row">
        <button class="add-cat-btn" onclick="openAddCat('income')">${getIcon('plus',14)} Добавить категорию</button>
      </div>
      <div class="budget-totals-row">
        <div>Итого</div>
        <div style="text-align:right">${fmtShort(planTotal)} ${cur}</div>
        <div style="text-align:right">${fmtShort(actualTotal)} ${cur}</div>
        <div style="text-align:right;color:${diffTotal >= 0 ? 'var(--success)' : 'var(--danger)'}">
          ${diffTotal >= 0 ? '+' : ''}${fmtShort(diffTotal)}
        </div>
      </div>`)

  } else {
    let rows = getExpCats().map(cat => {
      const actual = actuals.expense[cat.id] || 0
      return budgetRow(cat, actual, 'expense')
    }).join('')

    const planTotal = planTotalExpense(key)
    const actualTotal = totalExpense(key)
    const diffTotal = planTotal - actualTotal

    setHTML('budget-content', `
      <div class="budget-row-header">
        <div>Категория</div><div style="text-align:right">План</div>
        <div style="text-align:right">Факт</div><div style="text-align:right">Остаток</div>
      </div>
      ${rows}
      <div class="budget-add-cat-row">
        <button class="add-cat-btn" onclick="openAddCat('expense')">${getIcon('plus',14)} Добавить категорию</button>
      </div>
      <div class="budget-totals-row">
        <div>Итого</div>
        <div style="text-align:right">${fmtShort(planTotal)} ${cur}</div>
        <div style="text-align:right">${fmtShort(actualTotal)} ${cur}</div>
        <div style="text-align:right;color:${diffTotal >= 0 ? 'var(--success)' : 'var(--danger)'}">
          ${diffTotal >= 0 ? '+' : ''}${fmtShort(diffTotal)}
        </div>
      </div>`)
  }
}

function updatePlan(input) {
  const key = state.viewMonthKey
  const m = getMonthData(key)
  const val = parseFloat(input.value.replace(/\s/g, '')) || 0
  const cat = input.dataset.cat
  const type = input.dataset.type
  if (type === 'income') {
    if (!m.income[cat]) m.income[cat] = { plan: 0 }
    m.income[cat].plan = val
  } else {
    if (!m.expenses[cat]) m.expenses[cat] = { plan: 0 }
    m.expenses[cat].plan = val
  }
  // Format display after save
  input.value = val ? fmtNum(val) : ''
  saveData()
  renderHome()
  renderAnalytics()
}

// ===== CATEGORY MANAGEMENT =====
function openRenameCat(catId, type) {
  const cats = type === 'expense' ? getExpCats() : getIncCats()
  const cat = cats.find(c => c.id === catId)
  if (!cat) return
  el('rename-cat-id').value = catId
  el('rename-cat-type').value = type
  el('rename-cat-input').value = cat.name
  el('rename-cat-modal-title').textContent = 'Переименовать'
  openModal('rename-cat-modal')
  setTimeout(() => el('rename-cat-input').focus(), 100)
}

function saveRenamedCat() {
  const catId = el('rename-cat-id').value
  const name = el('rename-cat-input').value.trim()
  if (!name) return
  const type = el('rename-cat-type').value
  const isCustom = !!(db.settings.customCats?.[type] || []).find(c => c.id === catId)
  if (isCustom) {
    const arr = db.settings.customCats[type]
    const idx = arr.findIndex(c => c.id === catId)
    if (idx >= 0) arr[idx].name = name
  } else {
    if (!db.settings.catNames) db.settings.catNames = {}
    db.settings.catNames[catId] = name
  }
  saveData()
  closeModal('rename-cat-modal')
  renderBudget()
}

function openAddCat(type) {
  el('add-cat-type').value = type
  el('add-cat-name-input').value = ''
  // Set active color
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'))
  document.querySelector('.color-swatch')?.classList.add('active')
  openModal('add-cat-modal')
  setTimeout(() => el('add-cat-name-input').focus(), 100)
}

function selectCatColor(el_) {
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'))
  el_.classList.add('active')
}

function saveNewCat() {
  const name = el('add-cat-name-input').value.trim()
  if (!name) { alert('Введи название'); return }
  const type = el('add-cat-type').value
  const activeSwatch = document.querySelector('.color-swatch.active')
  const color = activeSwatch?.dataset.color || CAT_COLORS[0]
  const newCat = { id: 'custom_' + uid(), name, color, icon: 'tag' }
  if (!db.settings.customCats) db.settings.customCats = { expense: [], income: [] }
  db.settings.customCats[type].push(newCat)
  // Initialize plan for this month
  const m = getMonthData(state.viewMonthKey)
  if (type === 'income') { if (!m.income[newCat.id]) m.income[newCat.id] = { plan: 0 } }
  else { if (!m.expenses[newCat.id]) m.expenses[newCat.id] = { plan: 0 } }
  saveData()
  closeModal('add-cat-modal')
  renderBudget()
}

function deleteCustomCat(catId, type) {
  if (!confirm('Удалить категорию?')) return
  db.settings.customCats[type] = (db.settings.customCats[type] || []).filter(c => c.id !== catId)
  saveData()
  renderBudget()
}

function toggleCatNote(catId) {
  const wrap = document.getElementById(`note-${catId}`)
  if (!wrap) return
  const isOpen = wrap.style.display !== 'none'
  // Close all other open notes first
  document.querySelectorAll('.cat-note-wrap').forEach(w => w.style.display = 'none')
  if (!isOpen) {
    wrap.style.display = 'block'
    wrap.querySelector('textarea')?.focus()
  }
}

function saveCatNote(catId, value) {
  const key = state.viewMonthKey
  const m = getMonthData(key)
  if (!m.notes) m.notes = {}
  m.notes[catId] = value.trim()
  saveData()
  // Update dot indicator without full re-render
  const row = document.getElementById(`note-${catId}`)?.closest('.budget-row-wrap')
  if (row) {
    const dot = row.querySelector('.note-dot')
    const catName = row.querySelector('.budget-cat-name span:nth-child(2)')
    if (value.trim()) {
      if (!dot) catName?.insertAdjacentHTML('afterend', '<span class="note-dot"></span>')
    } else {
      dot?.remove()
    }
  }
}

// ===== BUDGET SUBCATEGORIES =====
function toggleSubcats(catId) {
  const wrap = el('subcats-' + catId)
  if (!wrap) return
  if (state.openSubcats.has(catId)) {
    state.openSubcats.delete(catId)
    wrap.style.display = 'none'
  } else {
    state.openSubcats.add(catId)
    wrap.style.display = 'block'
  }
}

function addSubcat(catId, type) {
  const key = state.viewMonthKey
  const m = getMonthData(key)
  if (!m.subcats) m.subcats = {}
  if (!m.subcats[catId]) m.subcats[catId] = []
  m.subcats[catId].push({ name: '', amount: 0 })
  state.openSubcats.add(catId)
  saveData()
  renderBudget()
}

function updateSubcatName(catId, type, i, value) {
  const m = getMonthData(state.viewMonthKey)
  if (m.subcats?.[catId]?.[i] !== undefined) {
    m.subcats[catId][i].name = value
    saveData()
  }
}

function updateSubcatAmount(catId, type, i, value) {
  const m = getMonthData(state.viewMonthKey)
  if (m.subcats?.[catId]?.[i] !== undefined) {
    m.subcats[catId][i].amount = parseFloat(value.replace(/\s/g, '')) || 0
    saveData()
    renderBudget()
    renderHome()
  }
}

function deleteSubcat(catId, type, i) {
  const m = getMonthData(state.viewMonthKey)
  if (m.subcats?.[catId]) {
    m.subcats[catId].splice(i, 1)
    if (m.subcats[catId].length > 0) state.openSubcats.add(catId)
    else state.openSubcats.delete(catId)
    saveData()
    renderBudget()
    renderHome()
  }
}

// ===== RENDER TRANSACTIONS =====
function renderTransactions() {
  const key = state.viewMonthKey
  let txs = db.transactions.filter(t => t.monthKey === key)

  if (state.txFilter === 'income') txs = txs.filter(t => t.type === 'income')
  else if (state.txFilter === 'expense') txs = txs.filter(t => t.type === 'expense')

  txs.sort((a, b) => b.date.localeCompare(a.date))

  if (!txs.length) {
    setHTML('tx-list', `<div class="empty-state"><div class="empty-icon">${getIcon('receipt', 44)}</div><p>Транзакций нет.<br>Нажми + чтобы добавить</p></div>`)
    return
  }

  const groups = {}
  txs.forEach(t => {
    if (!groups[t.date]) groups[t.date] = []
    groups[t.date].push(t)
  })

  const html = Object.keys(groups).sort((a, b) => b.localeCompare(a)).map(date => {
    const d = new Date(date + 'T00:00:00')
    const label = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' })
    const items = groups[date].map(t => {
      const cat = getCat(t.type, t.categoryId)
      return `
        <div class="tx-item" onclick="openEditTx('${t.id}')">
          <div class="tx-icon" style="background:${cat.color}20;color:${cat.color}">${getIcon(cat.icon, 20)}</div>
          <div class="tx-info">
            <div class="tx-name">${cat.name}</div>
            <div class="tx-meta">${t.description || '—'}</div>
          </div>
          <div class="tx-amount ${t.type}">${t.type === 'income' ? '+' : '−'}${fmtShort(t.amount)} ${db.settings.currency}</div>
        </div>`
    }).join('')
    return `<div class="tx-date-group">${label}</div><div class="tx-list-group card">${items}</div>`
  }).join('')

  setHTML('tx-list', html)
}

// ===== RENDER WISHLIST =====
function renderWishlist() {
  const key = state.viewMonthKey
  const m = getMonthData(key)
  const wishes = m.wishlist || []
  const cur = db.settings.currency

  const total = wishes.filter(w => !w.done).reduce((a, w) => a + (w.amount || 0), 0)
  const count = wishes.filter(w => !w.done).length

  el('wish-total').textContent = fmt(total)
  el('wish-count').textContent = count + ' желаний'

  // Goals section
  const goals = db.goals || []
  const goalsHtml = goals.length ? `
    <div class="goals-section">
      <div class="goals-header">
        <div class="section-label">Мои цели</div>
        <button class="small-btn" onclick="openAddGoal()">${getIcon('plus',13)} Добавить цель</button>
      </div>
      ${goals.map(g => {
        const saved = (g.contributions || []).reduce((a, c) => a + c.amount, 0)
        const pct = g.target > 0 ? Math.min((saved / g.target) * 100, 100) : 0
        const remaining = Math.max(g.target - saved, 0)
        const isExpanded = state.expandedGoals.has(g.id)
        const plans = g.monthlyPlans || []

        // Month options for adding a new plan (next 24 months, excluding already added)
        const now = new Date()
        let monthOpts = ''
        for (let i = 0; i < 24; i++) {
          const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
          const mKey = monthKey(d.getFullYear(), d.getMonth() + 1)
          if (!plans.some(p => p.month === mKey)) {
            monthOpts += `<option value="${mKey}">${monthLabel(mKey)}</option>`
          }
        }

        const plansHtml = plans.map(p => `
          <div class="goal-plan-item ${p.done ? 'done' : ''}">
            <button class="goal-plan-check ${p.done ? 'done' : ''}" onclick="toggleMonthlyPlan('${g.id}','${p.id}')">
              ${p.done ? getIcon('check-circle', 15) : '<span class="goal-plan-circle"></span>'}
            </button>
            <div class="goal-plan-info">
              <span class="goal-plan-month">${monthLabel(p.month)}</span>
              <span class="goal-plan-amount" style="color:${g.color}">${fmtNum(p.amount)} ${cur}</span>
            </div>
            <button class="goal-plan-del" onclick="deleteMonthlyPlan('${g.id}','${p.id}')">${getIcon('trash', 12)}</button>
          </div>`).join('')

        const addPlanRow = monthOpts ? `
          <div class="goal-plan-add-row">
            <select class="goal-plan-month-sel" id="plan-month-${g.id}">${monthOpts}</select>
            <input class="goal-plan-amount-input" id="plan-amount-${g.id}" type="text" inputmode="numeric"
              placeholder="Сумма" oninput="this.value=this.value.replace(/[^0-9]/g,'')">
            <button class="goal-plan-add-btn" onclick="addMonthlyPlanInline('${g.id}')">${getIcon('plus', 14)}</button>
          </div>` : ''

        return `
        <div class="goal-card card">
          <div class="goal-card-header">
            <div class="goal-card-title">
              <span style="color:${g.color}">${getIcon('flag', 16)}</span>
              <span>${g.name}</span>
            </div>
            <div class="goal-card-actions">
              <button class="icon-btn-sm" onclick="toggleGoalPlans('${g.id}')" title="Ежемесячные планы">
                ${getIcon('flag', 13)}
                ${plans.length ? `<span class="goal-plans-badge">${plans.length}</span>` : ''}
              </button>
              <button class="icon-btn-sm" onclick="openEditGoal('${g.id}')">${getIcon('edit-2',13)}</button>
            </div>
          </div>
          <div class="goal-progress-bar">
            <div class="goal-progress-fill" style="width:${pct}%;background:${g.color}"></div>
          </div>
          <div class="goal-card-stats">
            <span class="goal-saved" style="color:${g.color}">${fmtNum(saved)} ${cur}</span>
            <span class="goal-sep">из</span>
            <span class="goal-target">${fmtNum(g.target)} ${cur}</span>
            <span class="goal-pct">${Math.round(pct)}%</span>
          </div>
          ${remaining > 0 ? `<div class="goal-remaining">Осталось: ${fmtNum(remaining)} ${cur}</div>` : `<div class="goal-remaining" style="color:var(--success)">Цель достигнута!</div>`}
          ${isExpanded ? `
          <div class="goal-plans-section">
            <div class="goal-plans-title">Ежемесячные взносы</div>
            ${plansHtml || '<div class="goal-plans-empty">Добавь первый план</div>'}
            ${addPlanRow}
          </div>` : ''}
          <button class="goal-contribute-btn" onclick="openContribution('${g.id}')">${getIcon('plus',14)} Внести взнос</button>
        </div>`
      }).join('')}
    </div>` : `
    <div class="goals-section">
      <div class="goals-header">
        <div class="section-label">Мои цели</div>
        <button class="small-btn" onclick="openAddGoal()">${getIcon('plus',13)} Добавить цель</button>
      </div>
      <div class="card" style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px">
        ${getIcon('target',32)}<br><br>Нет активных целей.<br>Добавь свою первую цель!
      </div>
    </div>`

  setHTML('wish-goals', goalsHtml)

  // Wishlist section
  if (!wishes.length) {
    setHTML('wish-list', `<div class="empty-state"><div class="empty-icon">${getIcon('star', 44)}</div><p>Хотелок нет.<br>Добавь что-нибудь!</p></div>`)
    return
  }

  const html = `<div class="card">` + wishes.map((w, i) => `
    <div class="wish-item">
      <div class="wish-checkbox ${w.done ? 'done' : ''}" onclick="toggleWish(${i})">
        ${w.done ? '✓' : ''}
      </div>
      <div class="wish-info">
        <div class="wish-name ${w.done ? 'done' : ''}">${w.name}</div>
        ${w.note ? `<div class="wish-note">${w.note}</div>` : ''}
      </div>
      ${w.amount ? `<div class="wish-amount">${fmtShort(w.amount)} ${cur}</div>` : ''}
      <button class="wish-delete-btn" onclick="deleteWish(${i})">✕</button>
    </div>`).join('') + `</div>`

  setHTML('wish-list', html)
}

// ===== GOALS =====
function openAddGoal() {
  el('goal-modal-title').textContent = 'Новая цель'
  el('goal-id-input').value = ''
  el('goal-name-input').value = ''
  el('goal-target-input').value = ''
  el('goal-monthly-input').value = ''
  document.querySelectorAll('.goal-color-swatch').forEach((s,i) => s.classList.toggle('active', i===0))
  el('goal-delete-btn').style.display = 'none'
  openModal('goal-modal')
  setTimeout(() => el('goal-name-input').focus(), 100)
}

function openEditGoal(id) {
  const g = (db.goals || []).find(g => g.id === id)
  if (!g) return
  el('goal-modal-title').textContent = 'Редактировать цель'
  el('goal-id-input').value = id
  el('goal-name-input').value = g.name
  el('goal-target-input').value = g.target || ''
  el('goal-monthly-input').value = g.monthly || ''
  document.querySelectorAll('.goal-color-swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.color === g.color)
  })
  el('goal-delete-btn').style.display = 'block'
  openModal('goal-modal')
}

function saveGoal() {
  const name = el('goal-name-input').value.trim()
  if (!name) { alert('Введи название'); return }
  const target = parseFloat(el('goal-target-input').value) || 0
  const monthly = parseFloat(el('goal-monthly-input').value) || 0
  const activeSwatch = document.querySelector('.goal-color-swatch.active')
  const color = activeSwatch?.dataset.color || '#7c6af5'
  const id = el('goal-id-input').value

  if (id) {
    const idx = db.goals.findIndex(g => g.id === id)
    if (idx >= 0) Object.assign(db.goals[idx], { name, target, monthly, color })
  } else {
    if (!db.goals) db.goals = []
    db.goals.push({ id: uid(), name, target, monthly, color, contributions: [] })
  }
  saveData()
  closeModal('goal-modal')
  renderWishlist()
}

function deleteGoal() {
  const id = el('goal-id-input').value
  if (!id || !confirm('Удалить цель и все взносы?')) return
  db.goals = (db.goals || []).filter(g => g.id !== id)
  saveData()
  closeModal('goal-modal')
  renderWishlist()
}

function openContribution(goalId) {
  el('contrib-goal-id').value = goalId
  el('contrib-amount-input').value = ''
  const g = (db.goals || []).find(g => g.id === goalId)
  el('contrib-modal-title').textContent = g ? 'Взнос: ' + g.name : 'Внести взнос'
  openModal('contrib-modal')
  setTimeout(() => el('contrib-amount-input').focus(), 100)
}

function saveContribution() {
  const goalId = el('contrib-goal-id').value
  const amount = parseFloat(el('contrib-amount-input').value) || 0
  if (!amount) { alert('Введи сумму'); return }
  const g = (db.goals || []).find(g => g.id === goalId)
  if (!g) return
  if (!g.contributions) g.contributions = []
  g.contributions.push({ amount, date: today() })
  saveData()
  closeModal('contrib-modal')
  renderWishlist()
}

function toggleGoalPlans(goalId) {
  if (state.expandedGoals.has(goalId)) {
    state.expandedGoals.delete(goalId)
  } else {
    state.expandedGoals.add(goalId)
  }
  renderWishlist()
}

function toggleMonthlyPlan(goalId, planId) {
  const g = (db.goals || []).find(g => g.id === goalId)
  if (!g) return
  const plan = (g.monthlyPlans || []).find(p => p.id === planId)
  if (!plan) return

  if (plan.done) {
    // Снять галочку — удалить взнос
    if (plan.contributionId) {
      g.contributions = (g.contributions || []).filter(c => c.id !== plan.contributionId)
      plan.contributionId = null
    }
    plan.done = false
  } else {
    // Поставить галочку — добавить взнос
    const contribId = uid()
    if (!g.contributions) g.contributions = []
    g.contributions.push({ id: contribId, amount: plan.amount, date: today() })
    plan.contributionId = contribId
    plan.done = true
  }
  saveData()
  renderWishlist()
}

function addMonthlyPlanInline(goalId) {
  const monthVal = el('plan-month-' + goalId)?.value
  const amountStr = el('plan-amount-' + goalId)?.value || ''
  const amount = parseFloat(amountStr.replace(/\s/g, '')) || 0
  if (!monthVal || !amount) { alert('Укажи месяц и сумму'); return }
  const g = (db.goals || []).find(g => g.id === goalId)
  if (!g) return
  if (!g.monthlyPlans) g.monthlyPlans = []
  g.monthlyPlans.push({ id: uid(), month: monthVal, amount, done: false, contributionId: null })
  // Sort by month
  g.monthlyPlans.sort((a, b) => a.month.localeCompare(b.month))
  saveData()
  renderWishlist()
}

function deleteMonthlyPlan(goalId, planId) {
  const g = (db.goals || []).find(g => g.id === goalId)
  if (!g) return
  const plan = (g.monthlyPlans || []).find(p => p.id === planId)
  if (plan?.contributionId) {
    g.contributions = (g.contributions || []).filter(c => c.id !== plan.contributionId)
  }
  g.monthlyPlans = (g.monthlyPlans || []).filter(p => p.id !== planId)
  saveData()
  renderWishlist()
}

function toggleWish(i) {
  const m = getMonthData(state.viewMonthKey)
  m.wishlist[i].done = !m.wishlist[i].done
  saveData()
  renderWishlist()
}

function deleteWish(i) {
  const m = getMonthData(state.viewMonthKey)
  m.wishlist.splice(i, 1)
  saveData()
  renderWishlist()
}

// ===== RENDER ANALYTICS =====
function renderAnalytics() {
  const key = state.analyticsMonthKey || state.viewMonthKey
  const actuals = getActuals(key)
  const m = getMonthData(key)
  const cur = db.settings.currency

  const incTotal = Object.values(actuals.income).reduce((a, b) => a + b, 0)
  const expTotal = Object.values(actuals.expense).reduce((a, b) => a + b, 0)
  const balance = incTotal - expTotal
  const savingsRate = incTotal > 0 ? ((balance / incTotal) * 100).toFixed(1) : 0
  const planInc = planTotalIncome(key)
  const planExp = planTotalExpense(key)

  el('analytics-savings').textContent = savingsRate + '%'
  el('analytics-savings').className = 'metric-value ' + (balance >= 0 ? 'positive' : 'negative')
  el('analytics-balance').textContent = fmtShort(balance) + ' ' + cur
  el('analytics-balance').className = 'metric-value ' + (balance >= 0 ? 'positive' : 'negative')
  el('analytics-income').textContent = fmtShort(incTotal) + ' ' + cur
  el('analytics-expense').textContent = fmtShort(expTotal) + ' ' + cur

  // Top overspent category
  let topOver = null, topOverAmt = 0
  getExpCats().forEach(cat => {
    const plan = m.expenses[cat.id]?.plan || 0
    const actual = actuals.expense[cat.id] || 0
    if (plan > 0 && actual > plan && actual - plan > topOverAmt) {
      topOver = cat
      topOverAmt = actual - plan
    }
  })
  el('analytics-top-over').innerHTML = topOver
    ? `<span style="display:inline-flex;align-items:center;gap:6px;color:${topOver.color}">${getIcon(topOver.icon, 16)}</span> ${topOver.name} <span style="color:var(--danger)">(+${fmtShort(topOverAmt)})</span>`
    : `<span style="display:inline-flex;align-items:center;gap:6px;color:var(--success)">${getIcon('check-circle', 16)} Нет перерасхода</span>`

  // Bar chart for expenses
  const expCats = getExpCats().filter(c => (actuals.expense[c.id] || 0) > 0 || (m.expenses[c.id]?.plan || 0) > 0)
  const maxVal = Math.max(...expCats.map(c => Math.max(actuals.expense[c.id] || 0, m.expenses[c.id]?.plan || 0)), 1)

  const chartHtml = expCats.slice(0, 6).map(c => {
    const actual = actuals.expense[c.id] || 0
    const plan = m.expenses[c.id]?.plan || 0
    const h = Math.round((actual / maxVal) * 80)
    const ph = Math.round((plan / maxVal) * 80)
    const over = plan > 0 && actual > plan
    return `
      <div class="chart-bar-wrap">
        ${plan > 0 ? `<div class="chart-bar" style="height:${ph}px;background:${c.color}30;border:1.5px dashed ${c.color};position:absolute;bottom:20px;width:calc(100%/${expCats.slice(0,6).length} - 10px)"></div>` : ''}
        <div class="chart-bar" style="height:${h}px;background:${over ? '#ef4444' : c.color}"></div>
        <div class="chart-bar-label" style="color:${c.color}">${getIcon(c.icon, 14)}</div>
      </div>`
  }).join('')

  setHTML('analytics-chart', `<div class="chart-bars" style="position:relative">${chartHtml || '<div style="color:var(--text-muted);font-size:12px;text-align:center;width:100%">Нет данных</div>'}</div>`)

  // API key check
  const hasKey = !!db.settings.claudeApiKey

  // Existing analysis
  const analysis = m.analysis
  if (analysis) {
    el('ai-result-block').style.display = 'block'
    el('ai-result-text').textContent = analysis.text
    el('ai-result-date').textContent = 'Анализ от ' + new Date(analysis.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
  } else {
    el('ai-result-block').style.display = 'none'
  }

  el('api-key-section').style.display = hasKey ? 'none' : 'block'
}

// ===== BUILD ANALYTICS MONTH SELECT =====
function buildAnalyticsSelect() {
  const now = new Date()
  let options = ''
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = monthKey(d.getFullYear(), d.getMonth() + 1)
    const selected = key === (state.analyticsMonthKey || state.viewMonthKey) ? 'selected' : ''
    options += `<option value="${key}" ${selected}>${monthLabel(key)}</option>`
  }
  el('analytics-month-sel').innerHTML = options
}

// ===== CLAUDE AI ANALYSIS =====
async function runAnalysis() {
  const key = state.analyticsMonthKey || state.viewMonthKey
  const apiKey = db.settings.claudeApiKey || el('inline-api-key')?.value?.trim()

  if (!apiKey) { alert('Введи API ключ Claude'); return }

  if (el('inline-api-key')?.value?.trim()) {
    db.settings.claudeApiKey = el('inline-api-key').value.trim()
    saveData()
    renderSettings()
  }

  const btn = el('ai-analyze-btn')
  btn.disabled = true
  btn.innerHTML = '<div class="loading-spinner"></div> Анализирую...'

  try {
    const prompt = buildPrompt(key)
    const res = await fetch(CLAUDE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error?.message || 'API error ' + res.status)
    }

    const data = await res.json()
    const text = data.content[0].text

    const m = getMonthData(key)
    m.analysis = { text, date: new Date().toISOString() }
    saveData()
    renderAnalytics()

  } catch (e) {
    alert('Ошибка: ' + e.message)
  } finally {
    btn.disabled = false
    btn.innerHTML = `${getIcon('cpu', 18)} Анализировать с Claude AI`
  }
}

function buildPrompt(key) {
  const m = getMonthData(key)
  const actuals = getActuals(key)
  const cur = db.settings.currency
  const label = monthLabel(key)

  const incLines = getIncCats().map(c => {
    const plan = m.income[c.id]?.plan || 0
    const actual = actuals.income[c.id] || 0
    if (!plan && !actual) return null
    const diff = actual - plan
    const pct = plan > 0 ? ((diff / plan) * 100).toFixed(0) : null
    return `  • ${c.name}: план ${plan.toLocaleString()} ${cur}, факт ${actual.toLocaleString()} ${cur}${pct ? ` (${diff >= 0 ? '+' : ''}${pct}%)` : ''}`
  }).filter(Boolean).join('\n')

  const expLines = getExpCats().map(c => {
    const plan = m.expenses[c.id]?.plan || 0
    const actual = actuals.expense[c.id] || 0
    if (!plan && !actual) return null
    const diff = actual - plan
    const over = plan > 0 && actual > plan
    const pct = plan > 0 ? Math.abs(((diff / plan) * 100)).toFixed(0) : null
    return `  • ${c.name}: план ${plan.toLocaleString()} ${cur}, факт ${actual.toLocaleString()} ${cur}${pct ? ` (${over ? 'ПЕРЕРАСХОД +' : 'экономия -'}${pct}%)` : ''}`
  }).filter(Boolean).join('\n')

  const wishLines = (m.wishlist || []).map(w =>
    `  • ${w.name}${w.amount ? ` — ${w.amount.toLocaleString()} ${cur}` : ''}${w.done ? ' ✓ куплено' : ''}${w.note ? ` (${w.note})` : ''}`
  ).join('\n')

  const incTotal = Object.values(actuals.income).reduce((a, b) => a + b, 0)
  const expTotal = Object.values(actuals.expense).reduce((a, b) => a + b, 0)
  const balance = incTotal - expTotal
  const savingsRate = incTotal > 0 ? ((balance / incTotal) * 100).toFixed(1) : 0

  return `Ты мой персональный финансовый помощник. Проанализируй мои финансы за ${label} и дай конкретные, полезные советы. Пиши на русском языке, дружелюбно но по делу.

📊 ДОХОДЫ:
${incLines || '  (нет данных)'}

💸 РАСХОДЫ:
${expLines || '  (нет данных)'}

⭐ ХОТЕЛКИ (желания):
${wishLines || '  (список пуст)'}

📈 ИТОГИ:
  • Общий доход: ${incTotal.toLocaleString()} ${cur}
  • Общий расход: ${expTotal.toLocaleString()} ${cur}
  • Остаток / Сбережения: ${balance.toLocaleString()} ${cur} (${savingsRate}% от дохода)

Дай анализ в следующем формате:

**Общая оценка ${label}**
[2-3 предложения об общей картине месяца]

**✅ Что было хорошо**
[bullet points]

**⚠️ На что обратить внимание**
[конкретные категории с перерасходом, почему это важно]

**💡 Советы на следующий месяц**
[конкретные, практичные рекомендации по суммам и категориям]

**⭐ По хотелкам**
[есть ли возможность купить что-то из списка? расставь приоритеты]`
}

// ===== NAVIGATION =====
function switchTab(tab) {
  state.tab = tab
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'))
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'))
  el('tab-' + tab)?.classList.add('active')
  el('nav-' + tab)?.classList.add('active')

  const fabTabs = ['home', 'transactions']
  el('fab').classList.toggle('hidden', !fabTabs.includes(tab))

  if (tab === 'home') renderHome()
  if (tab === 'budget') renderBudget()
  if (tab === 'transactions') renderTransactions()
  if (tab === 'wishlist') renderWishlist()
  if (tab === 'analytics') { buildAnalyticsSelect(); renderAnalytics() }
}

function updateMonthDisplay() {
  el('current-month-label').textContent = monthLabel(state.viewMonthKey)
}

function navMonth(dir) {
  state.viewMonthKey = dir > 0 ? nextMonthKey(state.viewMonthKey) : prevMonthKey(state.viewMonthKey)
  updateMonthDisplay()
  renderAll()
}

function renderAll() {
  renderHome()
  renderBudget()
  renderTransactions()
  renderWishlist()
  if (state.tab === 'analytics') { buildAnalyticsSelect(); renderAnalytics() }
}

// ===== TRANSACTION MODAL =====
function openAddTx() {
  state.editingTx = null
  state.txType = 'expense'
  state.txCategoryId = getExpCats()[0].id
  el('tx-modal-title').textContent = 'Добавить транзакцию'
  el('tx-amount-input').value = ''
  el('tx-date-input').value = today()
  el('tx-desc-input').value = ''
  renderTxTypeToggle()
  renderCategoryGrid()
  el('tx-delete-btn').style.display = 'none'
  openModal('tx-modal')
}

function openEditTx(id) {
  const tx = db.transactions.find(t => t.id === id)
  if (!tx) return
  state.editingTx = id
  state.txType = tx.type
  state.txCategoryId = tx.categoryId
  el('tx-modal-title').textContent = 'Редактировать'
  el('tx-amount-input').value = tx.amount
  el('tx-date-input').value = tx.date
  el('tx-desc-input').value = tx.description || ''
  renderTxTypeToggle()
  renderCategoryGrid()
  el('tx-delete-btn').style.display = 'block'
  openModal('tx-modal')
}

function renderTxTypeToggle() {
  el('type-income-btn').className = 'type-btn' + (state.txType === 'income' ? ' active income' : '')
  el('type-expense-btn').className = 'type-btn' + (state.txType === 'expense' ? ' active expense' : '')
}

function renderCategoryGrid() {
  const cats = state.txType === 'income' ? getIncCats() : getExpCats()
  const html = cats.map(c => `
    <button class="cat-btn ${c.id === state.txCategoryId ? 'selected' : ''}" onclick="selectCat('${c.id}')">
      <span class="cat-icon" style="color:${c.color}">${getIcon(c.icon, 22)}</span>
      <span class="cat-label">${c.name}</span>
    </button>`).join('')
  setHTML('tx-cat-grid', html)
}

function setTxType(type) {
  state.txType = type
  state.txCategoryId = type === 'income' ? getIncCats()[0].id : getExpCats()[0].id
  renderTxTypeToggle()
  renderCategoryGrid()
}

function selectCat(id) {
  state.txCategoryId = id
  renderCategoryGrid()
}

function saveTx() {
  const amount = parseFloat(el('tx-amount-input').value)
  if (!amount || amount <= 0) { alert('Введи сумму'); return }
  if (!state.txCategoryId) { alert('Выбери категорию'); return }
  const date = el('tx-date-input').value || today()
  const desc = el('tx-desc-input').value.trim()
  const dateObj = new Date(date + 'T00:00:00')
  const mKey = monthKey(dateObj.getFullYear(), dateObj.getMonth() + 1)

  if (state.editingTx) {
    const idx = db.transactions.findIndex(t => t.id === state.editingTx)
    if (idx >= 0) {
      db.transactions[idx] = { ...db.transactions[idx], type: state.txType, categoryId: state.txCategoryId, amount, date, description: desc, monthKey: mKey }
    }
  } else {
    db.transactions.push({ id: uid(), type: state.txType, categoryId: state.txCategoryId, amount, date, description: desc, monthKey: mKey })
  }

  saveData()
  closeModal('tx-modal')
  renderAll()
}

function deleteTx() {
  if (!state.editingTx) return
  if (!confirm('Удалить транзакцию?')) return
  db.transactions = db.transactions.filter(t => t.id !== state.editingTx)
  saveData()
  closeModal('tx-modal')
  renderAll()
}

// ===== WISHLIST MODAL =====
function openAddWish() {
  el('wish-name-input').value = ''
  el('wish-amount-input').value = ''
  el('wish-note-input').value = ''
  openModal('wish-modal')
}

function saveWish() {
  const name = el('wish-name-input').value.trim()
  if (!name) { alert('Введи название'); return }
  const amount = parseFloat(el('wish-amount-input').value) || 0
  const note = el('wish-note-input').value.trim()
  const m = getMonthData(state.viewMonthKey)
  m.wishlist.push({ id: uid(), name, amount, note, done: false })
  saveData()
  closeModal('wish-modal')
  renderWishlist()
}

// ===== SETTINGS =====
function openSettings() {
  renderSettings()
  openModal('settings-modal')
}

function renderSettings() {
  el('settings-api-key').value = db.settings.claudeApiKey || ''
  el('settings-currency').value = db.settings.currency || '₸'
}

function saveSettings() {
  db.settings.claudeApiKey = el('settings-api-key').value.trim()
  db.settings.currency = el('settings-currency').value.trim() || '₸'
  saveData()
  closeModal('settings-modal')
  renderAll()
}

function exportData() {
  const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `dinero-backup-${today()}.json`
  a.click()
}

function importData(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => {
    try {
      const imported = JSON.parse(ev.target.result)
      if (!imported.transactions || !imported.months) throw new Error('Неверный формат')
      if (!confirm('Заменить все данные импортированными?')) return
      db = imported
      saveData()
      closeModal('settings-modal')
      renderAll()
      alert('Данные импортированы')
    } catch(err) {
      alert('Ошибка импорта: ' + err.message)
    }
  }
  reader.readAsText(file)
}

// ===== MODAL HELPERS =====
function openModal(id) {
  el(id).classList.add('open')
  document.body.style.overflow = 'hidden'
}

function closeModal(id) {
  el(id).classList.remove('open')
  document.body.style.overflow = ''
}

// ===== FAB ACTION =====
function fabAction() {
  if (state.tab === 'home' || state.tab === 'transactions') openAddTx()
  else if (state.tab === 'wishlist') openAddWish()
}

// ===== INIT =====
function init() {
  state.viewMonthKey = currentMonthKey()
  state.analyticsMonthKey = currentMonthKey()
  updateMonthDisplay()

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {})
  }

  switchTab('home')
}

document.addEventListener('DOMContentLoaded', init)
