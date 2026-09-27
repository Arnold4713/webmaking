<script setup lang="ts">
import type { Task } from '../types/task'
import { getTasks, updateTask } from '../stores/taskStore'

defineEmits<{
  delete: [id: string]
}>()

const columns = [
  { status: 'todo' as const, label: '待办', color: 'bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700', headerBg: 'bg-slate-500', dot: 'bg-slate-500' },
  { status: 'in-progress' as const, label: '进行中', color: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800', headerBg: 'bg-indigo-500', dot: 'bg-indigo-500' },
  { status: 'done' as const, label: '已完成', color: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800', headerBg: 'bg-emerald-500', dot: 'bg-emerald-500' },
]

const borderColor: Record<string, string> = {
  high: 'border-l-red-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-green-500',
}

const priorityBg: Record<string, string> = {
  high: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  medium: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
  low: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
}

const priorityLabel: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
}

function tasksByStatus(status: string) {
  return getTasks().filter(t => t.status === status)
}

/* ─── 拖拽 ─── */
let draggedId: string | null = null

function onDragStart(e: DragEvent, id: string) {
  draggedId = id
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', id)
  }
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
}

function onDrop(e: DragEvent, targetStatus: string) {
  e.preventDefault()
  if (!draggedId) return
  const task = getTasks().find(t => t.id === draggedId)
  if (task && task.status !== targetStatus) {
    updateTask(draggedId, { status: targetStatus as Task['status'] })
  }
  draggedId = null
}

function onDragEnd() {
  draggedId = null
}
</script>

<template>
  <div class="flex gap-4 overflow-x-auto pb-2" style="min-height: 400px">
    <div
      v-for="col in columns"
      :key="col.status"
      class="flex-1 min-w-[260px] rounded-xl border-2 flex flex-col"
      :class="col.color"
      @dragover="onDragOver"
      @drop="onDrop($event, col.status)"
    >
      <!-- 列标题 -->
      <div
        class="flex items-center gap-2 px-4 py-3 border-b"
        :class="col.color"
      >
        <span class="w-2.5 h-2.5 rounded-full shrink-0" :class="col.dot"></span>
        <h3 class="font-semibold text-sm text-gray-700 dark:text-gray-300">{{ col.label }}</h3>
        <span
          class="ml-auto inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-xs font-medium text-white"
          :class="col.headerBg"
        >
          {{ tasksByStatus(col.status).length }}
        </span>
      </div>

      <!-- 卡片列表 -->
      <div class="flex-1 p-3 space-y-3 overflow-y-auto">
        <div v-if="tasksByStatus(col.status).length === 0" class="text-center py-8">
          <p class="text-xs text-gray-400 dark:text-gray-500">拖拽任务到此处</p>
        </div>

        <div
          v-for="task in tasksByStatus(col.status)"
          :key="task.id"
          draggable="true"
          @dragstart="onDragStart($event, task.id)"
          @dragend="onDragEnd"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 border-l-4 p-4 hover:shadow-md transition-all duration-150 cursor-grab active:cursor-grabbing active:opacity-60"
          :class="borderColor[task.priority]"
        >
          <!-- 标题 -->
          <div class="flex items-start justify-between gap-2">
            <h4
              class="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug"
              :class="{ 'line-through text-gray-400 dark:text-gray-500': task.status === 'done' }"
            >
              {{ task.title }}
            </h4>
            <button
              @click="emit('delete', task.id)"
              class="shrink-0 w-5 h-5 flex items-center justify-center text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors text-xs"
              title="删除"
            >
              ×
            </button>
          </div>

          <!-- 描述 -->
          <p
            v-if="task.description"
            class="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed"
            :class="{ 'line-through text-gray-300 dark:text-gray-600': task.status === 'done' }"
          >
            {{ task.description }}
          </p>

          <!-- 底部 -->
          <div class="flex items-center justify-between mt-3">
            <span
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
              :class="priorityBg[task.priority]"
            >
              {{ priorityLabel[task.priority] }}
            </span>
            <span class="text-xs text-gray-400 dark:text-gray-500">{{ task.dueDate }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>