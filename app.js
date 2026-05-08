// ===== CONSTANTS =====
const STORAGE_KEY = 'dinero_v1'
const CLAUDE_API = 'https://api.anthropic.com/v1/messages'

const EXPENSE_CATS = [
  { id: 'housing',     name: 'Жильё + комуслуги',  icon: '🏠', color: '#6366f1' },
  { id: 'kaspi',       name: 'Каспи',               icon: '💳', color: '#f59e0b' },
  { id: 'otbasy',      name: 'Отбасы банк',         icon: '🏛️', color: '#3b82f6' },
  { id: 'installment', name: 'Рассрочка',            icon: '📋', color: '#8b5cf6' },
  { id: 'credit',      name: 'Кредит',               icon: '🏦', color: '#ef4444' },
  { id: 'workout',     name: 'Тренировка',           icon: '💪', color: '#10b981' },
  { id: 'phone',       name: 'Тариф (телефон)',      icon: '📱', color: '#06b6d4' },
  { id: 'transport',   name: 'Транспорт',            icon: '🚗', color: '#f97316' },
  { id: 'food',        name: 'Еда',                  icon: '🍔', color: '#84cc16' },
  { id: 'other_exp',   name: 'Прочее',               icon: '📦', color: '#6b7280' },
]

const INCOME_CATS = [
  { id: 'salary',       name: 'Зарплата',          icon: '💰', color: '#10b981' },
  { id: 'advance',      name: 'Аванс',             icon: '💵', color: '#34d399' },
  { id: 'bonus',        name: 'Бонус / Допка',     icon: '🎁', color: '#a3e635' },
  { id: 'compensation', name: 'Компенсация',       icon: '💸', color: '#4ade80' },
  { id: 'other_inc',    name: 'Прочие доходы',     icon: '➕', color: '#6ee7b7' },
]

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
}

// ===== STORAGE =====
function loadData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData()
  } catch { return defaultData() }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

function defaultData() {
  return { months: {}, transactions: [], settings: { claudeApiKey: '', currency: '₸' } }
}

let db = loadData()

function getMonthData(key) {
  if (!db.months[key]) db.months[key] = defaultMonth()
  return db.months[key]
}

function defaultMonth() {
  const income = {}
  INCOME_CATS.forEach(c => income[c.id] = { plan: 0 })
  const expenses = {}
  EXPENSE_CATS.forEach(c => expenses[c.id] = { plan: 0 })
  return { income, expenses, wishlist: [], analysis: null }
}

// ===== HELPERS =====
function fmt(n) {
  if (!n && n !== 0) return '—'
  return Math.round(n).toLocaleString('ru-RU') + ' ' + db.settings.currency
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
  return (type === 'expense' ? EXPENSE_CATS : INCOME_CATS).find(c => c.id === id) ||
    { id, name: id, icon: '❓', color: '#999' }
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

// ===== COMPUTE ACTUALS =====
function getActuals(monthKey) {
  const txs = db.transactions.filter(t => t.monthKey === monthKey)
  const income = {}
  const expense = {}
  INCOME_CATS.forEach(c => income[c.id] = 0)
  EXPENSE_CATS.forEach(c => expense[c.id] = 0)
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

function planTotalIncome(key) {
  const m = getMonthData(key)
  return Object.values(m.income).reduce((a, c) => a + (c.plan || 0), 0)
}

function planTotalExpense(key) {
  const m = getMonthData(key)
  return Object.values(m.expenses).reduce((a, c) => a + (c.plan || 0), 0)
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
  el('home-income').textContent = '↑ ' + fmtShort(incTotal) + ' ' + cur
  el('home-expense').textContent = '↓ ' + fmtShort(expTotal) + ' ' + cur

  const m = getMonthData(key)
  const catItems = EXPENSE_CATS.map(cat => {
    const plan = m.expenses[cat.id]?.plan || 0
    const actual = actuals.expense[cat.id] || 0
    if (plan === 0 && actual === 0) return ''
    const pct = plan > 0 ? Math.min((actual / plan) * 100, 100) : 0
    const over = plan > 0 && actual > plan
    return `
      <div class="cat-progress-item">
        <div class="cat-progress-header">
          <div class="cat-progress-name">
            <span>${cat.icon}</span>
            <span>${cat.name}</span>
          </div>
          <div class="cat-progress-amounts">
            <span class="actual">${fmtShort(actual)}</span>
            ${plan ? ' / ' + fmtShort(plan) : ''} ${cur}
            ${over ? '<span class="badge badge-over">+' + fmtShort(actual - plan) + '</span>' : ''}
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill ${over ? 'over' : ''}" style="width:${pct}%;background:${cat.color}"></div>
        </div>
      </div>`
  }).join('')

  setHTML('home-cat-list', catItems || '<div class="cat-progress-item" style="color:var(--text-muted);font-size:13px;text-align:center;padding:20px">Нет данных за этот месяц</div>')
}

// ===== RENDER BUDGET =====
function renderBudget() {
  const key = state.viewMonthKey
  const m = getMonthData(key)
  const actuals = getActuals(key)
  const sub = state.budgetSubtab
  const cur = db.settings.currency

  if (sub === 'income') {
    let rows = INCOME_CATS.map(cat => {
      const plan = m.income[cat.id]?.plan || 0
      const actual = actuals.income[cat.id] || 0
      const diff = actual - plan
      return `
        <div class="budget-row">
          <div class="budget-cat-name">
            <span>${cat.icon}</span><span>${cat.name}</span>
          </div>
          <div class="budget-cell plan">
            <input class="plan-input" type="number" value="${plan || ''}" placeholder="0"
              data-type="income" data-cat="${cat.id}" onchange="updatePlan(this)" oninput="updatePlan(this)">
          </div>
          <div class="budget-cell actual">${actual ? fmtShort(actual) : '—'}</div>
          <div class="budget-cell ${diff > 0 ? 'diff-pos' : diff < 0 ? 'diff-neg' : ''}">${diff ? (diff > 0 ? '+' : '') + fmtShort(diff) : '—'}</div>
        </div>`
    }).join('')

    const planTotal = planTotalIncome(key)
    const actualTotal = totalIncome(key)
    const diffTotal = actualTotal - planTotal

    setHTML('budget-content', `
      <div class="budget-row budget-row-header">
        <div>Категория</div><div style="text-align:right">План</div>
        <div style="text-align:right">Факт</div><div style="text-align:right">Разница</div>
      </div>
      ${rows}
      <div class="budget-totals-row">
        <div>Итого</div>
        <div style="text-align:right">${fmtShort(planTotal)} ${cur}</div>
        <div style="text-align:right">${fmtShort(actualTotal)} ${cur}</div>
        <div style="text-align:right;color:${diffTotal >= 0 ? 'var(--success)' : 'var(--danger)'}">
          ${diffTotal >= 0 ? '+' : ''}${fmtShort(diffTotal)}
        </div>
      </div>`)

  } else {
    let rows = EXPENSE_CATS.map(cat => {
      const plan = m.expenses[cat.id]?.plan || 0
      const actual = actuals.expense[cat.id] || 0
      const diff = plan - actual
      return `
        <div class="budget-row">
          <div class="budget-cat-name">
            <span>${cat.icon}</span><span>${cat.name}</span>
          </div>
          <div class="budget-cell plan">
            <input class="plan-input" type="number" value="${plan || ''}" placeholder="0"
              data-type="expense" data-cat="${cat.id}" onchange="updatePlan(this)" oninput="updatePlan(this)">
          </div>
          <div class="budget-cell actual">${actual ? fmtShort(actual) : '—'}</div>
          <div class="budget-cell ${diff > 0 ? 'diff-pos' : diff < 0 ? 'diff-neg' : ''}">${diff ? (diff > 0 ? '+' : '') + fmtShort(diff) : '—'}</div>
        </div>`
    }).join('')

    const planTotal = planTotalExpense(key)
    const actualTotal = totalExpense(key)
    const diffTotal = planTotal - actualTotal

    setHTML('budget-content', `
      <div class="budget-row budget-row-header">
        <div>Категория</div><div style="text-align:right">План</div>
        <div style="text-align:right">Факт</div><div style="text-align:right">Остаток</div>
      </div>
      ${rows}
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
  const val = parseFloat(input.value) || 0
  const cat = input.dataset.cat
  const type = input.dataset.type
  if (type === 'income') {
    if (!m.income[cat]) m.income[cat] = { plan: 0 }
    m.income[cat].plan = val
  } else {
    if (!m.expenses[cat]) m.expenses[cat] = { plan: 0 }
    m.expenses[cat].plan = val
  }
  saveData()
  renderHome()
  renderAnalytics()
}

// ===== RENDER TRANSACTIONS =====
function renderTransactions() {
  const key = state.viewMonthKey
  let txs = db.transactions.filter(t => t.monthKey === key)

  if (state.txFilter === 'income') txs = txs.filter(t => t.type === 'income')
  else if (state.txFilter === 'expense') txs = txs.filter(t => t.type === 'expense')

  txs.sort((a, b) => b.date.localeCompare(a.date))

  if (!txs.length) {
    setHTML('tx-list', `<div class="empty-state"><div class="empty-icon">💸</div><p>Транзакций нет.<br>Нажми + чтобы добавить</p></div>`)
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
          <div class="tx-icon" style="background:${cat.color}20">${cat.icon}</div>
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

  const total = wishes.filter(w => !w.done).reduce((a, w) => a + (w.amount || 0), 0)
  const count = wishes.filter(w => !w.done).length

  el('wish-total').textContent = fmt(total)
  el('wish-count').textContent = count + ' желаний'

  if (!wishes.length) {
    setHTML('wish-list', `<div class="empty-state"><div class="empty-icon">⭐</div><p>Хотелок нет.<br>Добавь что-нибудь!</p></div>`)
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
      ${w.amount ? `<div class="wish-amount">${fmtShort(w.amount)} ${db.settings.currency}</div>` : ''}
      <button class="wish-delete-btn" onclick="deleteWish(${i})">✕</button>
    </div>`).join('') + `</div>`

  setHTML('wish-list', html)
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
  EXPENSE_CATS.forEach(cat => {
    const plan = m.expenses[cat.id]?.plan || 0
    const actual = actuals.expense[cat.id] || 0
    if (plan > 0 && actual > plan && actual - plan > topOverAmt) {
      topOver = cat
      topOverAmt = actual - plan
    }
  })
  el('analytics-top-over').textContent = topOver
    ? topOver.icon + ' ' + topOver.name + ' (+' + fmtShort(topOverAmt) + ')'
    : '✅ Нет перерасхода'

  // Bar chart for expenses
  const expCats = EXPENSE_CATS.filter(c => (actuals.expense[c.id] || 0) > 0 || (m.expenses[c.id]?.plan || 0) > 0)
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
        <div class="chart-bar-label">${c.icon}</div>
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
    btn.innerHTML = '🤖 Анализировать с Claude AI'
  }
}

function buildPrompt(key) {
  const m = getMonthData(key)
  const actuals = getActuals(key)
  const cur = db.settings.currency
  const label = monthLabel(key)

  const incLines = INCOME_CATS.map(c => {
    const plan = m.income[c.id]?.plan || 0
    const actual = actuals.income[c.id] || 0
    if (!plan && !actual) return null
    const diff = actual - plan
    const pct = plan > 0 ? ((diff / plan) * 100).toFixed(0) : null
    return `  • ${c.name}: план ${plan.toLocaleString()} ${cur}, факт ${actual.toLocaleString()} ${cur}${pct ? ` (${diff >= 0 ? '+' : ''}${pct}%)` : ''}`
  }).filter(Boolean).join('\n')

  const expLines = EXPENSE_CATS.map(c => {
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
  state.txCategoryId = EXPENSE_CATS[0].id
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
  const cats = state.txType === 'income' ? INCOME_CATS : EXPENSE_CATS
  const html = cats.map(c => `
    <button class="cat-btn ${c.id === state.txCategoryId ? 'selected' : ''}" onclick="selectCat('${c.id}')">
      <span class="cat-icon">${c.icon}</span>
      <span class="cat-label">${c.name}</span>
    </button>`).join('')
  setHTML('tx-cat-grid', html)
}

function setTxType(type) {
  state.txType = type
  state.txCategoryId = type === 'income' ? INCOME_CATS[0].id : EXPENSE_CATS[0].id
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
