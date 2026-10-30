(() => {
  const dialog = document.getElementById('budget-dialog');
  const entryForm = document.getElementById('hero-calculator-form');
  if (!dialog || !entryForm) return;

  // Categories and line items follow the supplied Monthly worksheet. All entries start blank.
  const categories = [
    {id: 'charitable', name: 'Charitable', range: '5–10%', items: ['Charitable Gifts']},
    {id: 'savings', name: 'Savings', range: '5–10%', items: ['College Fund', 'Emergency Fund', 'Retirement Fund']},
    {id: 'investing', name: 'Investing', range: '10–20%', items: ['Roth IRA', 'Traditional IRA', 'Educational IRA', 'Brokerage']},
    {id: 'housing', name: 'Housing', range: '20–30%', items: ['1st Mortgage', '2nd Mortgage', 'Furniture', 'Homeowners Insurance', 'Maintenance & Repairs', 'Real Estate Taxes']},
    {id: 'utilities', name: 'Utilities', range: '5–10%', items: ['Cable', 'Cell Phone', 'Electric', 'Garbage', 'Gas', 'Internet', 'Phone', 'Water']},
    {id: 'food', name: 'Food', range: '5–15%', items: ['Grocery', 'Restaurants']},
    {id: 'transportation', name: 'Transportation', range: '10–15%', items: ['Car Insurance', 'Car Payment', 'Car Replacement', 'Gas & Oil', 'License & Taxes', 'Other Car Repairs', 'Repairs & Tires']},
    {id: 'clothing', name: 'Clothing', range: '2–7%', items: ['Adults', 'Children', 'Cleaning / Laundry']},
    {id: 'medical', name: 'Medical / Health', range: '5–10%', items: ['Dentist', 'Disability Insurance', 'Doctor', 'Drugs', 'Health Insurance', 'Optometrist']},
    {id: 'personal', name: 'Personal', range: '5–10%', items: ['Alimony', 'Baby Sitter', 'Birthday Fund', 'Child Care', 'Child Commissions', 'Child Support', 'Christmas Fund', 'Cosmetics', 'Education / Adult', 'Hair Care', 'Life Insurance', 'Life Insurance (additional)', 'Miscellaneous', 'Organization Dues', 'School Supplies', 'School Tuition', 'Subscriptions', 'Toiletries', 'Tutoring', 'You Money']},
    {id: 'recreation', name: 'Recreation', range: '5–10%', items: ['Entertainment', 'Vacation']},
    {id: 'debts', name: 'Debts', range: '', items: ['Debt payments']}
  ];
  const incomeItems = ['Paycheck', 'Additional income 1', 'Additional income 2'];
  const money = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});
  const months = Array.from({length: 12}, (_, index) => new Intl.DateTimeFormat('en-US', {month: 'long'}).format(new Date(2024, index, 1)));
  const fields = {
    month: document.getElementById('budget-month'), year: document.getElementById('budget-year'),
    tabs: document.getElementById('budget-week-tabs'), income: document.getElementById('budget-income-fields'),
    categories: document.getElementById('budget-category-fields'), weekHeading: document.getElementById('budget-week-heading'),
    weekSummary: document.getElementById('budget-week-summary'), monthSummary: document.getElementById('budget-month-summary'),
    annualSummary: document.getElementById('budget-annual-summary'), categorySummary: document.getElementById('budget-category-summary')
  };
  const budgets = new Map();
  const today = new Date();
  let selectedMonth = today.getMonth();
  let selectedYear = today.getFullYear();
  let selectedWeek = 0;

  function key(year, month) { return `${year}-${month}`; }
  function budgetFor(year = selectedYear, month = selectedMonth) {
    const id = key(year, month);
    if (!budgets.has(id)) budgets.set(id, {rollover: 0, weeks: Array.from({length: 5}, () => ({}))});
    return budgets.get(id);
  }
  function cents(value) { return Math.round((Number(value) || 0) * 100); }
  function amount(value) { return money.format((value || 0) / 100); }
  function total(week, prefix) {
    return Object.entries(week).reduce((sum, [id, value]) => sum + (id.startsWith(prefix) ? value : 0), 0);
  }
  function weekTotals(week) {
    const income = total(week, 'income-');
    const out = total(week, 'expense-');
    return {income, out, left: income - out};
  }
  function monthTotals(budget) {
    const totals = budget.weeks.reduce((sum, week) => {
      const item = weekTotals(week);
      sum.income += item.income;
      sum.out += item.out;
      return sum;
    }, {income: 0, out: 0});
    totals.available = totals.income + budget.rollover;
    totals.left = totals.available - totals.out;
    return totals;
  }
  function annualTotals() {
    return months.reduce((sum, _, month) => {
      const budget = budgets.get(key(selectedYear, month));
      if (!budget) return sum;
      const item = monthTotals(budget);
      sum.income += item.income;
      sum.out += item.out;
      sum.rollover += budget.rollover;
      return sum;
    }, {income: 0, out: 0, rollover: 0});
  }
  function makeInput(label, id, value) {
    const wrapper = document.createElement('label');
    wrapper.className = 'budget-money-field';
    const title = document.createElement('span');
    title.textContent = label;
    const input = document.createElement('input');
    input.type = 'number';
    input.inputMode = 'decimal';
    input.min = '0';
    input.max = '1000000000';
    input.step = '0.01';
    input.placeholder = '0.00';
    input.dataset.budgetId = id;
    input.setAttribute('aria-label', `${label}, week ${selectedWeek + 1}, US dollars`);
    if (value) input.value = (value / 100).toFixed(2);
    wrapper.append(title, input);
    return wrapper;
  }
  function renderInputs() {
    const budget = budgetFor();
    const week = budget.weeks[selectedWeek];
    fields.weekHeading.textContent = `${months[selectedMonth]} · Week ${selectedWeek + 1}`;
    fields.income.replaceChildren();
    const incomeBlock = document.createElement('section');
    incomeBlock.className = 'budget-income-block';
    incomeBlock.innerHTML = '<h4>Income</h4><div class="budget-field-grid"></div>';
    incomeItems.forEach((label, index) => incomeBlock.querySelector('.budget-field-grid').append(makeInput(label, `income-${index}`, week[`income-${index}`])));
    fields.income.append(incomeBlock);
    if (selectedWeek === 0) {
      const rollover = makeInput('Balance carried into this month', 'rollover', budget.rollover);
      rollover.querySelector('input').setAttribute('aria-label', 'Balance carried into this month, US dollars');
      incomeBlock.querySelector('.budget-field-grid').append(rollover);
    }
    fields.categories.replaceChildren();
    categories.forEach((category) => {
      const section = document.createElement('details');
      section.className = 'budget-category';
      const summary = document.createElement('summary');
      const title = document.createElement('strong');
      title.textContent = category.name;
      const reference = document.createElement('span');
      reference.textContent = category.range ? `Worksheet reference: ${category.range}` : '';
      const subtotal = document.createElement('output');
      subtotal.dataset.categoryTotal = category.id;
      summary.append(title, reference, subtotal);
      const grid = document.createElement('div');
      grid.className = 'budget-field-grid';
      category.items.forEach((label, index) => grid.append(makeInput(label, `expense-${category.id}-${index}`, week[`expense-${category.id}-${index}`])));
      section.append(summary, grid);
      fields.categories.append(section);
    });
    renderTotals();
  }
  function pair(label, value, strong = false) {
    const row = document.createElement('div');
    row.className = strong ? 'budget-result-row is-strong' : 'budget-result-row';
    const text = document.createElement('span');
    text.textContent = label;
    const output = document.createElement('output');
    output.textContent = amount(value);
    row.append(text, output);
    return row;
  }
  function renderTotals() {
    const budget = budgetFor();
    const week = budget.weeks[selectedWeek];
    const weekly = weekTotals(week);
    const monthly = monthTotals(budget);
    const annual = annualTotals();
    fields.weekSummary.replaceChildren();
    fields.monthSummary.replaceChildren();
    fields.annualSummary.replaceChildren();
    const weekTitle = document.createElement('h4'); weekTitle.textContent = `Week ${selectedWeek + 1}`;
    fields.weekSummary.append(weekTitle, pair('Income', weekly.income), pair('Spending & allocations', weekly.out), pair('Remaining', weekly.left, true));
    const monthTitle = document.createElement('h4'); monthTitle.textContent = months[selectedMonth];
    fields.monthSummary.append(monthTitle, pair('Income', monthly.income), pair('Carried balance', budget.rollover), pair('Total available', monthly.available), pair('Spending & allocations', monthly.out), pair('Remaining', monthly.left, true));
    const annualTitle = document.createElement('h4'); annualTitle.textContent = `${selectedYear} entered totals`;
    fields.annualSummary.append(annualTitle, pair('Income', annual.income), pair('Spending & allocations', annual.out), pair('Income less allocations', annual.income - annual.out, true));
    fields.categorySummary.replaceChildren();
    categories.forEach((category) => {
      const prefix = `expense-${category.id}-`;
      const weeklyTotal = total(week, prefix);
      const monthlyTotal = budget.weeks.reduce((sum, item) => sum + total(item, prefix), 0);
      const output = fields.categories.querySelector(`[data-category-total="${category.id}"]`);
      if (output) output.textContent = amount(weeklyTotal);
      fields.categorySummary.append(pair(category.name, monthlyTotal));
    });
    Array.from(fields.tabs.children).forEach((button, index) => {
      const totals = weekTotals(budget.weeks[index]);
      button.classList.toggle('is-selected', index === selectedWeek);
      button.setAttribute('aria-pressed', String(index === selectedWeek));
      button.querySelector('small').textContent = amount(totals.left);
    });
  }

  months.forEach((name, index) => {
    const option = document.createElement('option'); option.value = String(index); option.textContent = name; fields.month.append(option);
  });
  fields.month.value = String(selectedMonth);
  fields.year.value = String(selectedYear);
  for (let index = 0; index < 5; index++) {
    const button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = `<span>Week ${index + 1}</span><small>$0.00</small>`;
    button.addEventListener('click', () => { selectedWeek = index; renderInputs(); });
    fields.tabs.append(button);
  }
  function changePeriod() {
    const year = Number(fields.year.value);
    if (!Number.isInteger(year) || year < 1900 || year > 2100) return;
    selectedYear = year;
    selectedMonth = Number(fields.month.value);
    selectedWeek = 0;
    renderInputs();
  }
  fields.month.addEventListener('change', changePeriod);
  fields.year.addEventListener('change', changePeriod);
  dialog.addEventListener('input', (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !input.dataset.budgetId) return;
    input.setAttribute('aria-invalid', String(!input.validity.valid));
    if (!input.validity.valid) return;
    const value = cents(input.value);
    const budget = budgetFor();
    if (input.dataset.budgetId === 'rollover') budget.rollover = value;
    else budget.weeks[selectedWeek][input.dataset.budgetId] = value;
    renderTotals();
  });
  document.getElementById('budget-clear-month').addEventListener('click', () => {
    if (!window.confirm(`Clear all entries for ${months[selectedMonth]} ${selectedYear}?`)) return;
    budgets.delete(key(selectedYear, selectedMonth));
    renderInputs();
    fields.income.querySelector('input')?.focus();
  });
  document.getElementById('budget-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  entryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!entryForm.reportValidity()) return;
    renderInputs();
    dialog.showModal();
    dialog.querySelector('.budget-dialog-body').scrollTop = 0;
    document.getElementById('budget-dialog-close').focus();
  });
})();
