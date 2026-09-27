<script setup lang="ts">
import { ref } from 'vue'
import type { TaskPriority } from './types/task'
import TaskList from './components/TaskList.vue'
import TaskModal from './components/TaskModal.vue'
import { getTasks, addTask, updateTask, deleteTask } from './stores/taskStore'

const showModal = ref(false)

function toggleTask(id: string) {
  const task = getTasks().find(t => t.id === id)
  if (task) {
    updateTask(id, {
      status: task.status === 'done' ? 'todo' : 'done',
    })
  }
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
          <p class="text-2xl font-bold text-indigo-600">{{ getTasks().length }}</p>
          <p class="text-sm text-gray-500 mt-1">全部任务</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <p class="text-2xl font-bold text-amber-500">{{ getTasks().filter(t => t.status === 'in-progress').length }}</p>
          <p class="text-sm text-gray-500 mt-1">进行中</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <p class="text-2xl font-bold text-emerald-500">{{ getTasks().filter(t => t.status === 'done').length }}</p>
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
        :tasks="getTasks()"
        @toggle="toggleTask"
        @delete="deleteTask"
      />

      <!-- 新建任务弹窗 -->
      <TaskModal
        :show="showModal"
        @close="showModal = false"
        @submit="addTask"
      />
    </main>
  </div>
</template>