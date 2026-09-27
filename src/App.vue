<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from './types/task'
import TaskCard from './components/TaskCard.vue'

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

function handleToggle(id: string) {
  const task = tasks.value.find(t => t.id === id)
  if (task) {
    task.status = task.status === 'done' ? 'todo' : 'done'
  }
}

function handleDelete(id: string) {
  tasks.value = tasks.value.filter(t => t.id !== id)
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

      <!-- 任务卡片列表 -->
      <div class="space-y-4">
        <TaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @toggle="handleToggle"
          @delete="handleDelete"
        />
      </div>
    </main>
  </div>
</template>