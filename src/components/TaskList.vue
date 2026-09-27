<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Task } from '../types/task'
import TaskCard from './TaskCard.vue'

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
}>()

type Filter = 'all' | 'todo' | 'in-progress' | 'done'

const activeFilter = ref<Filter>('all')

const filterOptions: { value: Filter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'todo', label: '待办' },
  { value: 'in-progress', label: '进行中' },
  { value: 'done', label: '已完成' },
]

const filteredTasks = computed(() => {
  const list = [...props.tasks]

  // 按创建时间倒序排列（最新的在上面）
  list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  // 状态筛选
  if (activeFilter.value !== 'all') {
    return list.filter(t => t.status === activeFilter.value)
  }
  return list
})
</script>

<template>
  <div>
    <!-- 状态筛选按钮 -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="opt in filterOptions"
        :key="opt.value"
        @click="activeFilter = opt.value"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="
          activeFilter === opt.value
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
        "
      >
        {{ opt.label }}
      </button>
    </div>

    <!-- 任务卡片列表 -->
    <div v-if="filteredTasks.length > 0" class="space-y-4">
      <TaskCard
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @toggle="emit('toggle', $event)"
        @delete="emit('delete', $event)"
      />
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-20">
      <div class="text-5xl mb-4">📋</div>
      <p class="text-gray-400 dark:text-gray-500 text-sm">
        还没有任务，点击下方按钮创建第一个吧
      </p>
    </div>
  </div>
</template>