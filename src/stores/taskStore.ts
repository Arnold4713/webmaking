import { reactive, watch } from 'vue'
import type { Task, TaskPriority } from '../types/task'
import { saveTasks, loadTasks } from '../utils/storage'

/* ─── 状态 ─── */
const state = reactive<{ tasks: Task[] }>({
  tasks: [],
})

/* ─── 初始化 ─── */
function init() {
  const saved = loadTasks()
  if (saved.length > 0) {
    state.tasks = saved
  } else {
    // 首次使用，自动创建 3 条示例任务
    state.tasks = [
      {
        id: '1',
        title: '学习 Vue 3 Composition API',
        description: '掌握 setup、ref、reactive 等核心概念',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2026-10-05',
        createdAt: '2026-09-25',
      },
      {
        id: '2',
        title: '搭建 Tailwind CSS 组件库',
        description: '封装常用 UI 组件，统一设计语言',
        status: 'todo',
        priority: 'medium',
        dueDate: '2026-10-12',
        createdAt: '2026-09-26',
      },
      {
        id: '3',
        title: '实现数据持久化',
        description: '接入 localStorage，刷新不丢数据',
        status: 'todo',
        priority: 'low',
        dueDate: '2026-10-20',
        createdAt: '2026-09-27',
      },
    ]
    saveTasks(state.tasks)
  }
}

init()

/* ─── 自动保存（deep 监听，任何嵌套变化都触发） ─── */
watch(
  () => state.tasks,
  () => saveTasks(state.tasks),
  { deep: true },
)

/* ─── 导出函数 ─── */

export function addTask(data: {
  title: string
  description: string
  priority: TaskPriority
}): Task {
  const now = new Date()
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  const task: Task = {
    id: String(Date.now()),
    title: data.title,
    description: data.description,
    status: 'todo',
    priority: data.priority,
    dueDate: fmt(now),
    createdAt: fmt(now),
  }
  state.tasks.unshift(task)
  return task
}

export function updateTask(
  id: string,
  patch: Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'dueDate'>>,
): void {
  const task = state.tasks.find(t => t.id === id)
  if (task) {
    Object.assign(task, patch)
  }
}

export function deleteTask(id: string): void {
  const idx = state.tasks.findIndex(t => t.id === id)
  if (idx !== -1) {
    state.tasks.splice(idx, 1)
  }
}

export function getTasks(): Task[] {
  return state.tasks
}