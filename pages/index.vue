<template>
  <div class="h-screen flex">
    <!-- Chat List Sidebar -->
    <div class="w-80 flex-shrink-0">
      <ChatList />
    </div>

    <!-- Main Chat Area -->
    <div class="flex-1">
      <MessageView />
    </div>
  </div>
</template>

<script setup lang="ts">
// Set page metadata
useHead({
  title: 'Sailer Chat Interface',
  meta: [
    { name: 'description', content: 'Interface de chat omnicanal para agentes humanos monitorarem e colaborarem com IA' }
  ]
})

// Initialize the chat store
const chatStore = useChatStore()

// Load initial data on page mount
onMounted(() => {
  // The ChatList component will handle loading chats
  // WebSocket connection is handled by the useWebSocket composable
})
</script>

