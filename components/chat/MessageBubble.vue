<template>
  <div :class="messageContainerClasses">
    <div :class="messageBubbleClasses">
      <!-- Message Content -->
      <div class="mb-1">
        <p v-if="message.type === 'text'" class="text-sm leading-relaxed">
          {{ message.content }}
        </p>
        
        <div v-else-if="message.type === 'image'" class="space-y-2">
          <img 
            :src="message.content" 
            :alt="'Imagem enviada por ' + getSenderName(message.senderId)"
            class="max-w-full h-auto rounded-lg"
            loading="lazy"
          />
        </div>
        
        <div v-else-if="message.type === 'audio'" class="flex items-center space-x-2">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.846 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.846l3.537-2.816a1 1 0 011.617.816zM16 10a1 1 0 01-.293.707l-2 2a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 111.414-1.414l2 2A1 1 0 0116 10z" clip-rule="evenodd" />
          </svg>
          <span class="text-sm">Mensagem de áudio</span>
        </div>
      </div>

      <!-- Message Info -->
      <div class="flex items-center justify-between text-xs opacity-70">
        <span class="font-medium">{{ getSenderName(message.senderId) }}</span>
        <div class="flex items-center space-x-1">
          <span>{{ formatTime(message.timestamp) }}</span>
          <div v-if="isOwnMessage && message.read" class="flex">
            <svg class="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <svg class="w-3 h-3 text-blue-500 -ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <div v-else-if="isOwnMessage" class="flex">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '~/types'

interface Props {
  message: Message
  isOwnMessage: boolean
}

const props = defineProps<Props>()

const messageContainerClasses = computed(() => {
  return [
    'flex',
    props.isOwnMessage ? 'justify-end' : 'justify-start'
  ].join(' ')
})

const messageBubbleClasses = computed(() => {
  const baseClasses = 'message-bubble'
  
  if (props.isOwnMessage) {
    return `${baseClasses} message-bubble-agent`
  }
  
  if (props.message.senderId === 'bot_user') {
    return `${baseClasses} message-bubble-bot`
  }
  
  return `${baseClasses} message-bubble-customer`
})

const getSenderName = (senderId: string): string => {
  if (senderId.startsWith('customer_')) return 'Cliente'
  if (senderId === 'bot_user') return 'Sailer AI'
  if (senderId.startsWith('agent_')) return 'Agente'
  return 'Usuário'
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>

