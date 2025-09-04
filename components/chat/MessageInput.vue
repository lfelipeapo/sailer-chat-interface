<template>
  <div class="p-4 bg-white border-t border-gray-200">
    <div class="flex items-end space-x-3">
      <!-- Message Input -->
      <div class="flex-1">
        <textarea
          ref="textareaRef"
          v-model="message"
          :placeholder="placeholder"
          :disabled="isSending"
          class="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          rows="1"
          @keydown="handleKeydown"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </div>

      <!-- Send Button -->
      <Button
        :disabled="!canSend"
        variant="primary"
        size="md"
        @click="sendMessage"
      >
        <svg v-if="isSending" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </Button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mt-2 text-sm text-red-600">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  send: [message: string]
  typing: [isTyping: boolean]
}>()

const textareaRef = ref<HTMLTextAreaElement>()
const message = ref('')
const isSending = ref(false)
const error = ref('')
const isTyping = ref(false)

let typingTimeout: NodeJS.Timeout | null = null

const placeholder = computed(() => {
  return isSending.value ? 'Enviando...' : 'Digite sua mensagem...'
})

const canSend = computed(() => {
  return message.value.trim().length > 0 && !isSending.value
})

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

const handleInput = () => {
  // Auto-resize textarea
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 120)}px`
  }

  // Handle typing indicator
  if (!isTyping.value && message.value.trim()) {
    isTyping.value = true
    emit('typing', true)
  }

  // Clear existing timeout
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }

  // Set new timeout to stop typing indicator
  typingTimeout = setTimeout(() => {
    if (isTyping.value) {
      isTyping.value = false
      emit('typing', false)
    }
  }, 1000)
}

const handleFocus = () => {
  error.value = ''
}

const handleBlur = () => {
  // Stop typing indicator when input loses focus
  if (isTyping.value) {
    isTyping.value = false
    emit('typing', false)
  }
  
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }
}

const sendMessage = async () => {
  if (!canSend.value) return

  const messageToSend = message.value.trim()
  
  try {
    isSending.value = true
    error.value = ''
    
    // Stop typing indicator
    if (isTyping.value) {
      isTyping.value = false
      emit('typing', false)
    }
    
    // Clear timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }
    
    // Emit send event
    emit('send', messageToSend)
    
    // Clear input
    message.value = ''
    
    // Reset textarea height
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
    }
    
    // Focus back to input
    nextTick(() => {
      textareaRef.value?.focus()
    })
    
  } catch (err) {
    error.value = 'Falha ao enviar mensagem. Tente novamente.'
    console.error('Failed to send message:', err)
  } finally {
    isSending.value = false
  }
}

// Cleanup on unmount
onUnmounted(() => {
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }
})
</script>

