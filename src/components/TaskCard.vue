<script setup lang="ts">
import type { Task } from '../types/task'

defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
}>()

const borderColor: Record<string, string> = {
  high: 'border-l-red-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-green-500',
}

const priorityLabel: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
}
</script>

<template>
  <div
    class="
      relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700
      border-l-4 p-5
      hover:scale-[1.02] hover:shadow-md
      transition-all duration-200 ease-in-out
    "
    :class="borderColor[task.priority]"
  >
    <!-- 删除按钮 -->
    <button
      @click="emit('delete', task.id)"
      class="
        absolute top-3 right-3 w-6 h-6 flex items-center justify-center
        text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30
        rounded-full transition-colors text-sm leading-none
      "
      title="删除任务"
    >
      ×
    </button>

    <div class="flex items-start gap-3 pr-6">
      <!-- 复选框 -->
      <label class="mt-0.5 shrink-0">
        <input
          type="checkbox"
          :checked="task.status === 'done'"
          @change="emit('toggle', task.id)"
          class="
            w-4 h-4 rounded border-gray-300 text-indigo-600
            focus:ring-indigo-500 cursor-pointer
          "
        />
      </label>

      <div class="flex-1 min-w-0">
        <!-- 标题 -->
        <h3
          class="font-semibold text-gray-900 dark:text-gray-100 mb-1"
          :class="{ 'line-through text-gray-400 dark:text-gray-500': task.status === 'done' }"
        >
          {{ task.title }}
        </h3>

        <!-- 描述 -->
        <p
          class="text-sm text-gray-500 dark:text-gray-400 mb-3"
          :class="{ 'line-through text-gray-300 dark:text-gray-600': task.status === 'done' }"
        >
          {{ task.description }}
        </p>

        <!-- 底部信息 -->
        <div class="flex items-center gap-3">
          <!-- 优先级标签 -->
          <span
            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
            :class="{
              'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300': task.priority === 'high',
              'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300': task.priority === 'medium',
              'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300': task.priority === 'low',
            }"
          >
            {{ priorityLabel[task.priority] }}优先级
          </span>
          <!-- 截止日期 -->
          <span class="text-xs text-gray-400 dark:text-gray-500">
            📅 {{ task.dueDate }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>