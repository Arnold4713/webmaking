<script setup lang="ts">
import { reactive, ref, watch, onMounted, onUnmounted } from 'vue'
import type { TaskPriority } from '../types/task'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [task: { title: string; description: string; priority: TaskPriority }]
}>()

const form = reactive({
  title: '',
  description: '',
  priority: 'medium' as TaskPriority,
})

const titleError = ref(false)
const submitted = ref(false)

function resetForm() {
  form.title = ''
  form.description = ''
  form.priority = 'medium'
  titleError.value = false
  submitted.value = false
}

function handleClose() {
  resetForm()
  emit('close')
}

function handleSubmit() {
  submitted.value = true
  if (!form.title.trim()) {
    titleError.value = true
    return
  }
  emit('submit', {
    title: form.title.trim(),
    description: form.description.trim(),
    priority: form.priority,
  })
  resetForm()
}

// ESC 键盘关闭
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.show) {
    handleClose()
  }
}

watch(() => form.title, () => {
  if (submitted.value && form.title.trim()) {
    titleError.value = false
  }
})

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <!-- 灰色遮罩 -->
        <div
          class="absolute inset-0 bg-black/40"
          @click="handleClose"
        ></div>

        <!-- 弹窗内容 -->
        <div
          class="relative w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          @click.stop
        >
          <!-- 标题 -->
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            ✏️ 新建任务
          </h2>

          <!-- 表单 -->
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- 标题 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                标题 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                placeholder="请输入任务标题"
                class="w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-colors"
                :class="[
                  titleError
                    ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                ]"
              />
              <p
                v-if="titleError"
                class="mt-1.5 text-xs text-red-500"
              >
                标题不能为空
              </p>
            </div>

            <!-- 描述 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                描述
              </label>
              <textarea
                v-model="form.description"
                placeholder="请输入任务描述（选填）"
                rows="3"
                class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none"
              ></textarea>
            </div>

            <!-- 优先级 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                优先级
              </label>
              <select
                v-model="form.priority"
                class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white dark:bg-gray-700"
              >
                <option value="low">低优先级</option>
                <option value="medium">中优先级</option>
                <option value="high">高优先级</option>
              </select>
            </div>

            <!-- 操作按钮 -->
            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                @click="handleClose"
                class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                创建任务
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div:last-child {
  transform: scale(0.95);
}
.modal-leave-to > div:last-child {
  transform: scale(0.95);
}
</style>