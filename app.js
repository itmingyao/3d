const STORAGE_KEY = 'work-plan-dashboard-v1';

const PRIORITIES = ['重要紧急', '重要不紧急', '紧急不重要', '不重要不紧急'];
const STATUS_LABELS = {
  pending: '□ 未完成',
  completed: '☑ 已完成',
  canceled: '✘ 取消/不做',
};

const state = {
  tasks: loadTasks(),
  viewMonth: startOfMonth(new Date()),
  selectedDate: isoDate(new Date()),
};

const elements = {
  todayStartCount: document.getElementById('todayStartCount'),
  todayDueCount: document.getElementById('todayDueCount'),
  todayDoneCount: document.getElementById('todayDoneCount'),
  todayRate: document.getElementById('todayRate'),
  totalCount: document.getElementById('totalCount'),
  overdueCount: document.getElementById('overdueCount'),
  monthLabel: document.getElementById('monthLabel'),
  selectedLabel: document.getElementById('selectedLabel'),
  selectedSummary: document.getElementById('selectedSummary'),
  calendarGrid: document.getElementById('calendarGrid'),
  taskForm: document.getElementById('taskForm'),
  taskIdInput: document.getElementById('taskIdInput'),
  planDateInput: document.getElementById('planDateInput'),
  titleInput: document.getElementById('titleInput'),
  priorityInput: document.getElementById('priorityInput'),
  dueDateInput: document.getElementById('dueDateInput'),
  statusInput: document.getElementById('statusInput'),
  notesInput: document.getElementById('notesInput'),
  searchInput: document.getElementById('searchInput'),
  priorityFilter: document.getElementById('priorityFilter'),
  statusFilter: document.getElementById('statusFilter'),
  tableDateLabel: document.getElementById('tableDateLabel'),
  taskTableBody: document.getElementById('taskTableBody'),
  statusBar: document.getElementById('statusBar'),
  importInput: document.getElementById('importInput'),
  lists: {
    '重要紧急': document.getElementById('listUrgentImportant'),
    '重要不紧急': document.getElementById('listImportant'),
    '紧急不重要': document.getElementById('listUrgent'),
    '不重要不紧急': document.getElementById('listLow'),
  },
};

document.getElementById('prevMonthBtn').addEventListener('click', () => {
  state.viewMonth = addMonths(state.viewMonth, -1);
  render();
});

document.getElementById('nextMonthBtn').addEventListener('click', () => {
  state.viewMonth = addMonths(state.viewMonth, 1);
  render();
});

document.getElementById('todayBtn').addEventListener('click', () => {
  state.selectedDate = isoDate(new Date());
  state.viewMonth = startOfMonth(new Date(`${state.selectedDate}T00:00:00`));
  resetForm();
  render();
});

document.getElementById('exportBtn').addEventListener('click', exportTasks);
document.getElementById('clearBtn').addEventListener('click', clearAllTasks);
document.getElementById('cancelEditBtn').addEventListener('click', resetForm);

elements.taskForm.addEventListener('submit', saveTaskFromForm);
elements.importInput.addEventListener('change', handleImportFile);
elements.searchInput.addEventListener('input', renderTaskTable);
elements.priorityFilter.addEventListener('change', renderTaskTable);
elements.statusFilter.addEventListener('change', renderTaskTable);

resetForm();
render();

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedTasks();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeTask).filter(Boolean) : seedTasks();
  } catch {
    return seedTasks();
  }
}

function seedTasks() {
  const today = isoDate(new Date());
  return [
    createTask({
      planDate: today,
      title: 'H 项目可行性研究',
      priority: '重要不紧急',
      dueDate: today,
      status: 'pending',
      notes: '示例任务，可直接编辑或删除',
    }),
    createTask({
      planDate: today,
      title: '参加 Y 项目采购',
      priority: '重要紧急',
      dueDate: today,
      status: 'completed',
      notes: '',
    }),
    createTask({
      planDate: today,
      title: 'N 项目采购管理',
      priority: '紧急不重要',
      dueDate: today,
      status: 'pending',
      notes: '',
    }),
  ];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks, null, 2));
}

function render() {
  renderMetrics();
  renderCalendar();
  renderSelectedDay();
  renderTaskTable();
}

function renderMetrics() {
  const today = isoDate(new Date());
  const activeTasks = state.tasks.filter((task) => task.status !== 'canceled');
  const todayStart = activeTasks.filter((task) => task.planDate === today);
  const todayDue = activeTasks.filter((task) => task.dueDate === today);
  const todayDone = todayStart.filter((task) => task.status === 'completed');
  const overdue = activeTasks.filter((task) => task.status !== 'completed' && task.dueDate < today);
  const rate = todayStart.length ? Math.round((todayDone.length / todayStart.length) * 100) : 0;

  elements.todayStartCount.textContent = todayStart.length;
  elements.todayDueCount.textContent = todayDue.length;
  elements.todayDoneCount.textContent = todayDone.length;
  elements.todayRate.textContent = `${rate}%`;
  elements.totalCount.textContent = activeTasks.length;
  elements.overdueCount.textContent = overdue.length;
}

function renderCalendar() {
  const monthStart = startOfMonth(state.viewMonth);
  const firstDay = monthStart.getDay();
  const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
  const today = isoDate(new Date());
  const cells = [];

  elements.monthLabel.textContent = monthStart.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });

  for (let i = 0; i < firstDay; i += 1) {
    cells.push('<div class="empty-cell" aria-hidden="true"></div>');
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
    const key = isoDate(date);
    const planned = state.tasks.filter((task) => task.planDate === key).length;
    const due = state.tasks.filter((task) => task.dueDate === key && task.status === 'pending').length;
    const classes = ['day-cell'];
    if (key === today) classes.push('today');
    if (key === state.selectedDate) classes.push('selected');

    const counts = [];
    if (planned) counts.push(`<span>始${planned}</span>`);
    if (due) counts.push(`<span>止${due}</span>`);

    cells.push(`
      <button class="${classes.join(' ')}" type="button" data-date="${key}" aria-label="${key}">
        <span class="day-num">${day}</span>
        <span class="day-counts">${counts.join('')}</span>
      </button>
    `);
  }

  elements.calendarGrid.innerHTML = cells.join('');
  elements.calendarGrid.querySelectorAll('[data-date]').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedDate = button.dataset.date;
      state.viewMonth = startOfMonth(new Date(`${state.selectedDate}T00:00:00`));
      elements.planDateInput.value = state.selectedDate;
      elements.dueDateInput.value = state.selectedDate;
      render();
    });
  });
}

function renderSelectedDay() {
  elements.selectedLabel.textContent = prettyDate(state.selectedDate);
  const selectedTasks = state.tasks
    .filter((task) => isTaskRelevantToDate(task, state.selectedDate))
    .sort(sortTasks);

  elements.selectedSummary.textContent = `${selectedTasks.length} 项`;

  for (const priority of PRIORITIES) {
    const tasks = selectedTasks.filter((task) => task.priority === priority);
    elements.lists[priority].innerHTML = tasks.length
      ? tasks.map(renderMiniTask).join('')
      : '<p class="empty-note">此类暂无任务</p>';
  }

  document.querySelectorAll('[data-toggle-status]').forEach((button) => {
    button.addEventListener('click', () => toggleCompleted(button.dataset.toggleStatus));
  });
}

function renderMiniTask(task) {
  return `
    <article class="mini-task ${task.status === 'completed' ? 'done' : ''}">
      <strong>${escapeHtml(task.title)}</strong>
      <div class="mini-task-meta">
        <span>${escapeHtml(STATUS_LABELS[task.status])}</span>
      </div>
      <button class="text-button" type="button" data-toggle-status="${task.id}">
        ${task.status === 'completed' ? '标为未完成' : '标为完成'}
      </button>
    </article>
  `;
}

function renderTaskTable() {
  const query = elements.searchInput.value.trim().toLowerCase();
  const priority = elements.priorityFilter.value;
  const status = elements.statusFilter.value;
  elements.tableDateLabel.textContent = prettyDate(state.selectedDate);
  const rows = state.tasks
    .filter((task) => isTaskRelevantToDate(task, state.selectedDate))
    .filter((task) => !priority || task.priority === priority)
    .filter((task) => !status || task.status === status)
    .filter((task) => {
      if (!query) return true;
      return `${task.title} ${task.notes} ${task.planDate} ${task.dueDate}`.toLowerCase().includes(query);
    })
    .sort(sortTasks);

  if (!rows.length) {
    elements.taskTableBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="7">
          <strong>没有匹配的任务</strong>
          <span>可调整筛选条件，或在上方新增任务。</span>
        </td>
      </tr>
    `;
    return;
  }

  elements.taskTableBody.innerHTML = rows.map((task, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHtml(task.planDate)}</td>
      <td>
        <strong>${escapeHtml(task.title)}</strong>
        ${task.notes ? `<div class="mini-task-meta">${escapeHtml(task.notes)}</div>` : ''}
      </td>
      <td><span class="priority-badge ${priorityClass(task.priority)}">${escapeHtml(task.priority)}</span></td>
      <td>${escapeHtml(task.dueDate)}</td>
      <td><span class="status-badge ${task.status}">${escapeHtml(STATUS_LABELS[task.status])}</span></td>
      <td>
        <div class="row-actions">
          <button class="text-button" type="button" data-edit="${task.id}">编辑</button>
          <button class="text-button" type="button" data-toggle-status="${task.id}">${task.status === 'completed' ? '未完成' : '完成'}</button>
          <button class="text-button delete" type="button" data-delete="${task.id}">删除</button>
        </div>
      </td>
    </tr>
  `).join('');

  elements.taskTableBody.querySelectorAll('[data-edit]').forEach((button) => {
    button.addEventListener('click', () => editTask(button.dataset.edit));
  });
  elements.taskTableBody.querySelectorAll('[data-toggle-status]').forEach((button) => {
    button.addEventListener('click', () => toggleCompleted(button.dataset.toggleStatus));
  });
  elements.taskTableBody.querySelectorAll('[data-delete]').forEach((button) => {
    button.addEventListener('click', () => deleteTask(button.dataset.delete));
  });
}

function saveTaskFromForm(event) {
  event.preventDefault();
  const title = elements.titleInput.value.trim();
  if (!title) {
    setStatus('请填写工作规划。');
    return;
  }

  const id = elements.taskIdInput.value;
  const now = new Date().toISOString();
  const data = {
    planDate: elements.planDateInput.value,
    title,
    priority: elements.priorityInput.value,
    dueDate: elements.dueDateInput.value,
    status: elements.statusInput.value,
    notes: elements.notesInput.value.trim(),
  };

  if (id) {
    const task = state.tasks.find((item) => item.id === id);
    if (!task) return;
    Object.assign(task, data, { updatedAt: now });
    setStatus('已更新任务。');
  } else {
    state.tasks.push(createTask(data));
    setStatus('已新增任务。');
  }

  state.selectedDate = data.planDate;
  state.viewMonth = startOfMonth(new Date(`${data.planDate}T00:00:00`));
  saveTasks();
  resetForm();
  render();
}

function editTask(id) {
  const task = state.tasks.find((item) => item.id === id);
  if (!task) return;
  elements.taskIdInput.value = task.id;
  elements.planDateInput.value = task.planDate;
  elements.titleInput.value = task.title;
  elements.priorityInput.value = task.priority;
  elements.dueDateInput.value = task.dueDate;
  elements.statusInput.value = task.status;
  elements.notesInput.value = task.notes || '';
  elements.titleInput.focus();
  setStatus('正在编辑任务。');
}

function toggleCompleted(id) {
  const task = state.tasks.find((item) => item.id === id);
  if (!task) return;
  task.status = task.status === 'completed' ? 'pending' : 'completed';
  task.updatedAt = new Date().toISOString();
  saveTasks();
  render();
  setStatus('已更新任务状态。');
}

function deleteTask(id) {
  if (!window.confirm('确定删除这条任务吗？')) return;
  state.tasks = state.tasks.filter((task) => task.id !== id);
  saveTasks();
  resetForm();
  render();
  setStatus('已删除任务。');
}

function resetForm() {
  elements.taskForm.reset();
  elements.taskIdInput.value = '';
  elements.planDateInput.value = state.selectedDate;
  elements.dueDateInput.value = state.selectedDate;
  elements.priorityInput.value = '重要紧急';
  elements.statusInput.value = 'pending';
}

function exportTasks() {
  const payload = JSON.stringify(state.tasks, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `work-plan-tasks-${isoDate(new Date())}.json`;
  link.click();
  URL.revokeObjectURL(url);
  setStatus('已导出 JSON 文件。');
}

async function handleImportFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const parsed = JSON.parse(await file.text());
    if (!Array.isArray(parsed)) throw new Error('导入文件必须是任务数组');
    const imported = parsed.map(normalizeTask).filter(Boolean);
    if (imported.length !== parsed.length) throw new Error('部分任务字段无效');
    if (!window.confirm('导入会替换当前任务清单，继续吗？')) {
      setStatus('已取消导入。');
      return;
    }
    state.tasks = imported;
    saveTasks();
    resetForm();
    render();
    setStatus('已导入 JSON 数据。');
  } catch (error) {
    setStatus(`导入失败：${error.message}`);
  } finally {
    elements.importInput.value = '';
  }
}

function clearAllTasks() {
  if (!window.confirm('确定要清空所有任务吗？此操作无法撤销。')) return;
  state.tasks = [];
  saveTasks();
  resetForm();
  render();
  setStatus('已清空所有任务。');
}

function createTask(input) {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `task-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    planDate: input.planDate,
    title: input.title,
    priority: PRIORITIES.includes(input.priority) ? input.priority : '重要紧急',
    dueDate: input.dueDate,
    status: ['pending', 'completed', 'canceled'].includes(input.status) ? input.status : 'pending',
    notes: input.notes || '',
    createdAt: now,
    updatedAt: now,
  };
}

function normalizeTask(value) {
  if (!value || typeof value !== 'object') return null;
  if (!isValidDateKey(value.planDate) || !isValidDateKey(value.dueDate)) return null;
  const title = String(value.title || '').trim();
  if (!title) return null;
  return {
    id: String(value.id || `task-${Date.now()}-${Math.random().toString(16).slice(2)}`),
    planDate: value.planDate,
    title,
    priority: PRIORITIES.includes(value.priority) ? value.priority : '重要紧急',
    dueDate: value.dueDate,
    status: ['pending', 'completed', 'canceled'].includes(value.status) ? value.status : 'pending',
    notes: String(value.notes || ''),
    createdAt: String(value.createdAt || new Date().toISOString()),
    updatedAt: String(value.updatedAt || new Date().toISOString()),
  };
}

function sortTasks(a, b) {
  return a.planDate.localeCompare(b.planDate)
    || a.dueDate.localeCompare(b.dueDate)
    || PRIORITIES.indexOf(a.priority) - PRIORITIES.indexOf(b.priority)
    || a.title.localeCompare(b.title, 'zh-CN');
}

function isTaskRelevantToDate(task, date) {
  return task.planDate === date
    || task.dueDate === date
    || (task.status === 'pending' && task.dueDate < date);
}

function priorityClass(priority) {
  return {
    '重要紧急': 'ui',
    '重要不紧急': 'in',
    '紧急不重要': 'un',
    '不重要不紧急': 'nn',
  }[priority] || 'nn';
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, count) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

function isoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function prettyDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
}

function isValidDateKey(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function setStatus(message) {
  elements.statusBar.textContent = message;
}
