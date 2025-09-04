<template>
  <div class="flex flex-col h-full bg-white border-r border-gray-200">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <h1 class="text-lg font-semibold text-gray-900">Conversas</h1>
      <div class="flex items-center space-x-2">
        <span v-if="unreadCount > 0" class="unread-indicator">
          {{ unreadCount }}
        </span>
      </div>
    </div>

    <!-- Chat List -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="isLoading" class="p-4">
        <div class="animate-pulse space-y-4">
          <div v-for="i in 3" :key="i" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="chats.length === 0" class="p-4 text-center text-gray-500">
        Nenhuma conversa encontrada
      </div>

      <div v-else>
        <ChatListItem
          v-for="chat in chats"
          :key="chat.id"
          :chat="chat"
          :is-active="chat.id === currentChatId"
          @select="selectChat"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Chat } from '~/types'

const chatStore = useChatStore()

const isLoading = ref(true)

const chats = computed(() => chatStore.chats)
const currentChatId = computed(() => chatStore.currentChatId)
const unreadCount = computed(() => chatStore.unreadChatsCount)

const selectChat = (chatId: string) => {
  chatStore.selectChat(chatId)
}

// Load chats on component mount
onMounted(async () => {
  try {
    await chatStore.fetchChats()
  } finally {
    isLoading.value = false
  }
})
</script>

