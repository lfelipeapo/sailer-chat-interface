<template>
  <div v-if="typingUsers.length > 0" class="flex items-center space-x-1 text-gray-500">
    <div class="flex space-x-1">
      <div class="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
      <div class="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
      <div class="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
    </div>
    <span class="text-xs">
      {{ typingMessage }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { TypingStatus } from '~/types'

interface Props {
  typingUsers: TypingStatus[]
}

const props = defineProps<Props>()

const typingMessage = computed(() => {
  const activeTypingUsers = props.typingUsers.filter(user => user.isTyping)
  
  if (activeTypingUsers.length === 0) return ''
  
  if (activeTypingUsers.length === 1) {
    const userId = activeTypingUsers[0].userId
    const userName = getUserName(userId)
    return `${userName} está digitando...`
  }
  
  if (activeTypingUsers.length === 2) {
    const user1 = getUserName(activeTypingUsers[0].userId)
    const user2 = getUserName(activeTypingUsers[1].userId)
    return `${user1} e ${user2} estão digitando...`
  }
  
  return `${activeTypingUsers.length} pessoas estão digitando...`
})

const getUserName = (userId: string): string => {
  if (userId.startsWith('customer_')) return 'Cliente'
  if (userId === 'bot_user') return 'Sailer AI'
  if (userId.startsWith('agent_')) return 'Agente'
  return 'Usuário'
}
</script>

<style scoped>
@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.animate-bounce {
  animation: bounce 1.4s infinite ease-in-out both;
}
</style>

