const STORAGE_KEY = 'livro-caixa-transactions-v1';
const GOAL_STORAGE_KEY = 'livro-caixa-daily-goal-v1';

const categories = {
  income: ['Venda de marmitas', 'Encomendas', 'Bebidas', 'Sobremesas', 'Outros recebimentos'],
  expense: ['Ingredientes', 'Embalagens', 'Gás', 'Combustível / entrega', 'Taxas de aplicativos', 'Aluguel', 'Água / luz', 'Marketing', 'Manutenção', 'Outros gastos'],
};

const state = { transactions: loadTransactions() };
const form = document.querySelector('#transactionForm');
const transactionList = document.querySelector('#transactionList');
const categorySummary = document.querySelector('#categorySummary');
const startDateInput = document.querySelector('#startDate');
const endDateInput = document.querySelector('#endDate');
const categorySelect = document.querySelector('#category');
const filterCategory = document.querySelector('#filterCategory');
const goalForm = document.querySelector('#goalForm');
const goalValue = document.querySelector('#goalValue');

function loadTransactions() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
}

function loadGoal() {
  try {
    const saved = JSON.parse(localStorage.getItem(GOAL_STORAGE_KEY));
    return saved && saved.date === localDate() && ['meals', 'revenue'].includes(saved.type) && Number(saved.value) > 0 ? saved : null;
  } catch {
    return null;
  }
}

function updateGoalForm() {
  const type = document.querySelector('input[name="goalType"]:checked').value;
  const isRevenue = type === 'revenue';
  document.querySelector('#goalInputLabel').textContent = isRevenue ? 'Quanto você quer faturar?' : 'Quantas marmitas?';
  document.querySelector('#goalPrefix').hidden = !isRevenue;
  document.querySelector('#goalSuffix').hidden = isRevenue;
  goalValue.placeholder = isRevenue ? 'Ex.: 500,00' : 'Ex.: 30';
}

function renderGoal() {
  const goal = loadGoal();
  const feedback = document.querySelector('#goalFeedback');
  if (!goal) {
    feedback.textContent = 'Sua meta ficará salva neste dispositivo.';
    return;
  }
  document.querySelector(`input[name="goalType"][value="${goal.type}"]`).checked = true;
  goalValue.value = goal.type === 'revenue' ? Number(goal.value).toFixed(2).replace('.', ',') : String(goal.value);
  updateGoalForm();
  feedback.textContent = goal.type === 'revenue' ? `Meta de hoje: ${formatCurrency(goal.value)} em vendas.` : `Meta de hoje: ${goal.value} marmitas vendidas.`;
}

function submitGoal(event) {
  event.preventDefault();
  const type = document.querySelector('input[name="goalType"]:checked').value;
  const value = type === 'revenue' ? parseCurrency(goalValue.value) : Number(goalValue.value.replace(/[^\d]/g, ''));
  const feedback = document.querySelector('#goalFeedback');
  if (!Number.isFinite(value) || value <= 0) {
    feedback.textContent = type === 'revenue' ? 'Informe um valor maior que zero para a meta.' : 'Informe uma quantidade maior que zero para a meta.';
    goalValue.focus();
    return;
  }
  localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify({ type, value, date: localDate() }));
  renderGoal();
}

function localDate(value = new Date()) {
  const offset = value.getTimezoneOffset();
  return new Date(value.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(value) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T12:00:00`));
}

function parseCurrency(value) {
  const raw = value.trim().replace(/R\$\s?/g, '').replace(/\s/g, '');
  const hasComma = raw.includes(',');
  const normalized = hasComma
    ? raw.replace(/\./g, '').replace(',', '.')
    : raw.replace(/[^\d.]/g, '');
  return Number(normalized);
}

function selectedType() {
  return document.querySelector('input[name="type"]:checked').value;
}

function populateCategories(target, type, includeAll = false) {
  const value = target.value;
  target.innerHTML = includeAll ? '<option value="all">Todas</option>' : '';
  const available = includeAll ? [...categories.income, ...categories.expense] : categories[type];
  [...new Set(available)].forEach((category) => {
    const option = new Option(category, category);
    target.add(option);
  });
  target.value = available.includes(value) || value === 'all' ? value : target.options[0].value;
}

function resetPeriod() {
  const now = new Date();
  startDateInput.value = localDate(new Date(now.getFullYear(), now.getMonth(), 1));
  endDateInput.value = localDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
}

function setDailyHistoryFilters() {
  const today = localDate();
  startDateInput.value = today;
  endDateInput.value = today;
  document.querySelector('#filterType').value = 'all';
  filterCategory.value = 'all';
  document.querySelector('#filterPayment').value = 'all';
}

function getFilteredTransactions() {
  const type = document.querySelector('#filterType').value;
  const category = filterCategory.value;
  const payment = document.querySelector('#filterPayment').value;
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;
  return state.transactions
    .filter((item) => (!startDate || item.date >= startDate) && (!endDate || item.date <= endDate))
    .filter((item) => type === 'all' || item.type === type)
    .filter((item) => category === 'all' || item.category === category)
    .filter((item) => payment === 'all' || item.payment === payment)
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
}

function getPeriodTransactions() {
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;
  return state.transactions.filter((item) => (!startDate || item.date >= startDate) && (!endDate || item.date <= endDate));
}

function renderSummary() {
  const transactions = state.transactions.filter((item) => item.date === localDate());
  const income = transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
  const expense = transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
  const balance = income - expense;
  document.querySelector('[data-summary="income"]').textContent = formatCurrency(income);
  document.querySelector('[data-summary="expense"]').textContent = formatCurrency(expense);
  document.querySelector('[data-summary="balance"]').textContent = formatCurrency(balance);
  renderSalesGoal(transactions, income);
}

function renderSalesGoal(todayTransactions, income) {
  const goal = loadGoal();
  const description = document.querySelector('#salesGoalDescription');
  const value = document.querySelector('#salesGoalValue');
  const status = document.querySelector('#salesGoalStatus');
  const bar = document.querySelector('#salesGoalBar');
  if (!goal) {
    description.textContent = 'Defina sua meta na Home para acompanhar seu progresso.';
    value.textContent = '';
    status.textContent = 'Você ainda não definiu uma meta para hoje.';
    bar.style.width = '0%';
    return;
  }
  const current = goal.type === 'revenue'
    ? income
    : todayTransactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const percent = Math.min(100, (current / goal.value) * 100);
  const goalLabel = goal.type === 'revenue' ? formatCurrency(goal.value) : `${goal.value} marmitas`;
  const currentLabel = goal.type === 'revenue' ? formatCurrency(current) : `${current} marmitas`;
  description.textContent = `Meta de hoje: ${goalLabel}`;
  value.textContent = `${Math.round(percent)}%`;
  status.textContent = current >= goal.value ? `Meta atingida! Você chegou a ${currentLabel}.` : `${currentLabel} de ${goalLabel} até agora.`;
  bar.style.width = `${percent}%`;
}

function renderTransactions() {
  const transactions = getFilteredTransactions();
  document.querySelector('#transactionCount').textContent = transactions.length === 1 ? '1 lançamento encontrado' : `${transactions.length} lançamentos encontrados`;
  transactionList.innerHTML = '';
  if (!transactions.length) {
    transactionList.append(document.querySelector('#emptyStateTemplate').content.cloneNode(true));
    transactionList.querySelector('.open-from-empty').addEventListener('click', openNewTransaction);
    return;
  }
  transactions.forEach((item) => {
    const row = document.createElement('article');
    row.className = 'transaction-row';
    row.innerHTML = `
      <span class="transaction-type ${item.type}" aria-label="${item.type === 'income' ? 'Entrada' : 'Saída'}">${item.type === 'income' ? '↓' : '↑'}</span>
      <div class="transaction-description"><strong>${escapeHtml(item.description)}</strong><span>${escapeHtml(item.category)} · ${escapeHtml(item.payment)}</span></div>
      <time class="transaction-date" datetime="${item.date}">${formatDate(item.date)}</time>
      <strong class="transaction-value ${item.type}">${item.type === 'income' ? '+' : '−'} ${formatCurrency(item.amount)}</strong>
      <details class="row-actions"><summary aria-label="Ações para ${escapeHtml(item.description)}">•••</summary><div class="row-menu"><button type="button" data-edit="${item.id}">Editar</button><button class="delete-action" type="button" data-delete="${item.id}">Excluir</button></div></details>`;
    transactionList.append(row);
  });
}

function renderCategories() {
  const grouped = getPeriodTransactions().reduce((result, item) => {
    result[item.category] = (result[item.category] || 0) + item.amount;
    return result;
  }, {});
  const entries = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
  categorySummary.innerHTML = '';
  if (!entries.length) {
    categorySummary.innerHTML = '<p class="category-empty">Quando você registrar movimentações, verá aqui quais categorias mais movimentam o seu caixa.</p>';
    return;
  }
  const maxValue = entries[0][1];
  entries.forEach(([name, amount]) => {
    const related = getPeriodTransactions().find((item) => item.category === name);
    const item = document.createElement('div');
    item.className = 'category-item';
    item.innerHTML = `<div class="category-item-top"><span>${escapeHtml(name)}</span><strong>${formatCurrency(amount)}</strong></div><div class="category-track"><div class="category-bar ${related.type}" style="width:${Math.max(8, (amount / maxValue) * 100)}%"></div></div>`;
    categorySummary.append(item);
  });
}

function render() {
  renderSummary();
  renderTransactions();
  renderCategories();
}

function setActiveView(view) {
  document.querySelectorAll('[data-view]').forEach((section) => {
    section.hidden = section.dataset.view !== view;
  });
  document.querySelectorAll('[data-view-link]').forEach((link) => {
    const active = link.dataset.viewLink === view;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  if (view === 'history') {
    setDailyHistoryFilters();
    render();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach((element) => { element.textContent = ''; });
}

function updateFormCategories() {
  populateCategories(categorySelect, selectedType());
  const isIncome = selectedType() === 'income';
  const quantityField = document.querySelector('.quantity-field');
  const quantityInput = document.querySelector('#quantity');
  quantityField.hidden = !isIncome;
  quantityInput.disabled = !isIncome;
  if (!isIncome) quantityInput.value = '';
}

function openNewTransaction() {
  form.reset();
  clearErrors();
  document.querySelector('#transactionId').value = '';
  document.querySelector('#formContext').textContent = 'Novo lançamento';
  document.querySelector('#dialogTitle').textContent = 'Registre no seu caixa';
  document.querySelector('#date').value = localDate();
  updateFormCategories();
  document.querySelector('#futureWarning').hidden = true;
  document.querySelector('#cancelDialog').hidden = true;
  setActiveView('transactions');
  document.querySelector('#movementCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.querySelector('#description').focus();
}

function openEditTransaction(id) {
  const item = state.transactions.find((transaction) => transaction.id === id);
  if (!item) return;
  clearErrors();
  document.querySelector('#transactionId').value = item.id;
  document.querySelector(`input[name="type"][value="${item.type}"]`).checked = true;
  updateFormCategories();
  document.querySelector('#description').value = item.description;
  document.querySelector('#amount').value = item.amount.toFixed(2).replace('.', ',');
  document.querySelector('#quantity').value = item.quantity || '';
  document.querySelector('#date').value = item.date;
  categorySelect.value = item.category;
  document.querySelector('#payment').value = item.payment;
  document.querySelector('#note').value = item.note || '';
  document.querySelector('#formContext').textContent = 'Editar lançamento';
  document.querySelector('#dialogTitle').textContent = 'Corrigir o caixa';
  document.querySelector('#futureWarning').hidden = item.date <= localDate();
  document.querySelector('#cancelDialog').hidden = false;
  setActiveView('transactions');
  document.querySelector('#movementCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.querySelector('#description').focus();
}

function closeDialog() { openNewTransaction(); }

function validateForm() {
  clearErrors();
  const description = document.querySelector('#description').value.trim();
  const amount = parseCurrency(document.querySelector('#amount').value);
  const date = document.querySelector('#date').value;
  let valid = true;
  if (!description) { document.querySelector('#descriptionError').textContent = 'Informe uma descrição.'; valid = false; }
  if (!Number.isFinite(amount) || amount <= 0) { document.querySelector('#amountError').textContent = 'Informe um valor maior que zero.'; valid = false; }
  if (!date) { document.querySelector('#dateError').textContent = 'Informe uma data.'; valid = false; }
  if (!categorySelect.value) { document.querySelector('#categoryError').textContent = 'Selecione uma categoria.'; valid = false; }
  return valid ? { description, amount, date } : null;
}

function submitForm(event) {
  event.preventDefault();
  const validated = validateForm();
  if (!validated) return;
  const id = document.querySelector('#transactionId').value;
  const data = {
    id: id || crypto.randomUUID(),
    type: selectedType(),
    description: validated.description,
    amount: validated.amount,
    quantity: selectedType() === 'income' ? Number(document.querySelector('#quantity').value) || 0 : 0,
    date: validated.date,
    category: categorySelect.value,
    payment: document.querySelector('#payment').value,
    note: document.querySelector('#note').value.trim(),
    createdAt: id ? state.transactions.find((item) => item.id === id).createdAt : Date.now(),
  };
  state.transactions = id ? state.transactions.map((item) => item.id === id ? data : item) : [data, ...state.transactions];
  saveTransactions();
  openNewTransaction();
  render();
}

function deleteTransaction(id) {
  const item = state.transactions.find((transaction) => transaction.id === id);
  if (item && window.confirm(`Excluir o lançamento “${item.description}”? Esta ação não pode ser desfeita.`)) {
    state.transactions = state.transactions.filter((transaction) => transaction.id !== id);
    saveTransactions();
    render();
  }
}

function updateClock() {
  const now = new Date();
  document.querySelector('#todayLabel').textContent = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' }).format(now);
  document.querySelector('#historyDateLabel').textContent = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(now);
}

updateClock();
window.setInterval(updateClock, 30_000);
resetPeriod();
populateCategories(categorySelect, 'income');
populateCategories(filterCategory, 'income', true);
renderGoal();
render();

document.querySelector('#openTransaction').addEventListener('click', openNewTransaction);
document.querySelectorAll('[data-view-link]').forEach((link) => link.addEventListener('click', (event) => {
  event.preventDefault();
  setActiveView(link.dataset.viewLink);
  if (link.getAttribute('href') === '#resumo') document.querySelector('#resumo').scrollIntoView({ behavior: 'smooth', block: 'start' });
}));
document.querySelector('#cancelDialog').addEventListener('click', closeDialog);
form.addEventListener('submit', submitForm);
goalForm.addEventListener('submit', submitGoal);
document.querySelectorAll('input[name="goalType"]').forEach((input) => input.addEventListener('change', updateGoalForm));
document.querySelectorAll('input[name="type"]').forEach((input) => input.addEventListener('change', updateFormCategories));
document.querySelector('#date').addEventListener('change', (event) => { document.querySelector('#futureWarning').hidden = event.target.value <= localDate(); });
document.querySelector('#amount').addEventListener('blur', (event) => { const amount = parseCurrency(event.target.value); if (Number.isFinite(amount) && amount > 0) event.target.value = amount.toFixed(2).replace('.', ','); });
document.querySelector('#showFilters').addEventListener('click', (event) => { const filters = document.querySelector('#filters'); filters.hidden = !filters.hidden; event.currentTarget.setAttribute('aria-expanded', String(!filters.hidden)); });
document.querySelector('#clearFilters').addEventListener('click', () => { document.querySelector('#filterType').value = 'all'; filterCategory.value = 'all'; document.querySelector('#filterPayment').value = 'all'; render(); });
document.querySelectorAll('#startDate, #endDate, #filterType, #filterCategory, #filterPayment').forEach((input) => input.addEventListener('change', render));
document.querySelector('#currentMonth').addEventListener('click', () => { resetPeriod(); render(); });
transactionList.addEventListener('click', (event) => { const edit = event.target.closest('[data-edit]'); const remove = event.target.closest('[data-delete]'); if (edit) openEditTransaction(edit.dataset.edit); if (remove) deleteTransaction(remove.dataset.delete); });
window.addEventListener('beforeunload', (event) => { if (form.checkValidity() && document.querySelector('#description').value.trim()) { event.preventDefault(); event.returnValue = ''; } });
