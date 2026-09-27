<script setup lang="ts">
import { ref } from 'vue'
import type { Task, TaskPriority } from './types/task'
import TaskList from './components/TaskList.vue'
import TaskModal from './components/TaskModal.vue'

const tasks = ref<Task[]>([
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
    title: '实现任务 CRUD 功能',
    description: '包括创建、编辑、删除和状态切换',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-10-20',
    createdAt: '2026-09-27',
  },
  {
    id: '4',
    title: '编写项目 README 文档',
    description: '说明项目结构、启动方式和功能列表',
    status: 'done',
    priority: 'low',
    dueDate: '2026-09-30',
    createdAt: '2026-09-24',
  },
])

const showModal = ref(false)

function handleToggle(id: string) {
  const task = tasks.value.find(t => t.id === id)
  if (task) {
    task.status = task.status === 'done' ? 'todo' : 'done'
  }
}

function handleDelete(id: string) {
  tasks.value = tasks.value.filter(t => t.id !== id)
}

function handleSubmit(data: { title: string; description: string; priority: TaskPriority }) {
  const now = new Date()
  const newTask: Task = {
    id: String(Date.now()),
    title: data.title,
    description: data.description,
    status: 'todo',
    priority: data.priority,
    dueDate: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
    createdAt: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
  }
  tasks.value.unshift(newTask)
  showModal.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <header class="bg-indigo-600 text-white shadow-md">
      <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-xl font-bold tracking-tight">Vibe Coding Runoob</h1>
        <span class="text-indigo-200 text-sm">任务管理</span>
      </div>
    </header>

    <!-- 任务列表区域 -->
    <main class="max-w-5xl mx-auto px-4 py-8">
      <!-- 统计卡片 -->
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <p class="text-2xl font-bold text-indigo-600">{{ tasks.length }}</p>
          <p class="text-sm text-gray-500 mt-1">全部任务</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <p class="text-2xl font-bold text-amber-500">{{ tasks.filter(t => t.status === 'in-progress').length }}</p>
          <p class="text-sm text-gray-500 mt-1">进行中</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <p class="text-2xl font-bold text-emerald-500">{{ tasks.filter(t => t.status === 'done').length }}</p>
          <p class="text-sm text-gray-500 mt-1">已完成</p>
        </div>
      </div>

      <!-- 新建任务按钮 -->
      <div class="mb-6">
        <button
          @click="showModal = true"
          class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <span class="text-lg leading-none">+</span>
          新建任务
        </button>
      </div>

      <!-- 任务列表组件 -->
      <TaskList
        :tasks="tasks"
        @toggle="handleToggle"
        @delete="handleDelete"
      />

      <!-- 新建任务弹窗 -->
      <TaskModal
        :show="showModal"
        @close="showModal = false"
        @submit="handleSubmit"
      />
    </main>
  </div>
</template>