<template>
  <div
    :class="[
      'chat-list-item',
      { 'active': isActive }
    ]"
    @click="$emit('select', chat.id)"
  >
    <div class="flex items-center space-x-3">
      <!-- Avatar -->
      <div class="flex-shrink-0">
        <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <span class="text-sm font-medium text-gray-700">
            {{ getInitials(chat.name) }}
          </span>
        </div>
      </div>

      <!-- Chat Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-900 truncate">
            {{ chat.name }}
          </h3>
          <div class="flex items-center space-x-2">
            <span v-if="chat.unreadCount > 0" class="unread-indicator">
              {{ chat.unreadCount }}
            </span>
            <span class="text-xs text-gray-500">
              {{ formatTime(chat.updatedAt) }}
            </span>
          </div>
        </div>
        
        <div class="flex items-center justify-between mt-1">
          <p class="text-sm text-gray-600 truncate">
            <span v-if="chat.lastMessage" class="flex items-center">
              <span class="mr-1 text-xs font-medium" :class="getSenderColor(chat.lastMessage.senderId)">
                {{ getSenderName(chat.lastMessage.senderId) }}:
              </span>
              {{ chat.lastMessage.content }}
            </span>
            <span v-else class="italic">
              Nenhuma mensagem
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Chat } from '~/types'

interface Props {
  chat: Chat
  isActive: boolean
}

const props = defineProps<Props>()

defineEmits<{
  select: [chatId: string]
}>()

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return 'agora'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`
  
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit' 
  })
}

const getSenderName = (senderId: string): string => {
  if (senderId.startsWith('customer_')) return 'Cliente'
  if (senderId === 'bot_user') return 'IA'
  if (senderId.startsWith('agent_')) return 'Agente'
  return 'Usuário'
}

const getSenderColor = (senderId: string): string => {
  if (senderId.startsWith('customer_')) return 'text-gray-600'
  if (senderId === 'bot_user') return 'text-green-600'
  if (senderId.startsWith('agent_')) return 'text-blue-600'
  return 'text-gray-600'
}
</script>

