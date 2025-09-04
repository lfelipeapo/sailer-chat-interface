# Informações do Backend FastAPI

## Repositório GitHub
https://github.com/SailerAI/frontend-technical-challenge

## Endpoints da API REST

### 1. Criar um Chat
- **Endpoint**: `POST /chats`
- **Request Body**: `{"participants": ["user1", "user2"]}`
- **Response**: `{"chat_id": "<generated_chat_id>", "participants": ["user1", "user2"]}`

### 2. Listar Chats
- **Endpoint**: `GET /chats`
- **Response**: Array de objetos com `chat_id` e `participants`

### 3. Obter Mensagens de um Chat
- **Endpoint**: `GET /chats/{chat_id}/messages`
- **Response**: Array de mensagens com `id`, `user_id`, `type`, `content`, `timestamp`

### 4. Enviar uma Mensagem
- **Endpoint**: `POST /chats/{chat_id}/messages`
- **Request Body**: `{"user_id": "user1", "type": "text", "content": "Hello, world!"}`
- **Response**: `{"status": "message_sent"}`

### 5. Atualizar Presença do Usuário
- **Endpoint**: `POST /chats/{chat_id}/presence`
- **Request Body**: `{"user_id": "user1", "status": "online"}`

### 6. Marcar Chat como Lido
- **Endpoint**: `POST /chats/{chat_id}/read`
- **Request Body**: `{"user_id": "user1"}`

## WebSocket

### Conectar a um Chat
- **Endpoint**: `ws://localhost:8000/ws/{chat_id}`

### Eventos WebSocket
1. **message_received**: Nova mensagem adicionada ao chat
2. **presence_updated**: Usuário atualizou presença
3. **chat_read**: Usuário marcou chat como lido

## Notas Importantes
- O bot user (`bot_user`) responde automaticamente com mensagens predefinidas após um delay
- O backend já tem CORS configurado
- Usar WebSocket para atualizações em tempo real ao invés de polling
- Backend roda na porta 8000 por padrão

## Como rodar o backend
```bash
docker build -t chat-backend .
docker run -p 8000:8000 chat-backend
```

Ou diretamente com Python:
```bash
pip install -r requirements.txt
python main.py
```

