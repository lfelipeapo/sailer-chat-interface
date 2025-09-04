# Sailer Chat Interface

Uma interface de chat omnicanal moderna desenvolvida com Vue 3, Nuxt 3, TypeScript e TailwindCSS para permitir que agentes humanos monitorem, colaborem e assumam conversas gerenciadas por IA.

## Autor

**Luiz Felipe Apolinário**  
Desenvolvedor Frontend especializado em Vue.js e tecnologias modernas de desenvolvimento web.

## Visão Geral

Este projeto implementa uma interface de chat em tempo real que permite a colaboração entre três tipos de participantes:

- **Cliente**: O usuário final interagindo via canais como WhatsApp
- **Agente de IA (bot_user)**: A IA da Sailer que gerencia a maior parte da conversa
- **Agente Humano**: Um funcionário que pode monitorar o chat, enviar mensagens e assumir o controle da IA

A aplicação foi desenvolvida seguindo as melhores práticas de desenvolvimento frontend, com foco em performance, escalabilidade e experiência do usuário.

## Tecnologias Utilizadas

### Frontend
- **Vue 3**: Framework progressivo para construção de interfaces de usuário
- **Nuxt 3**: Meta-framework para Vue.js com recursos avançados de SSR e otimização
- **TypeScript**: Linguagem de programação com tipagem estática para maior robustez
- **TailwindCSS**: Framework CSS utilitário para desenvolvimento rápido e consistente
- **Pinia**: Gerenciador de estado oficial para Vue.js

### Comunicação
- **REST API**: Para operações CRUD e busca de dados
- **WebSockets**: Para atualizações em tempo real e comunicação bidirecional

## Funcionalidades Implementadas

### Funcionalidades Essenciais ✅

1. **Lista de Chats**
   - Exibição de todas as conversas disponíveis
   - Indicação visual de mensagens não lidas
   - Ordenação por última atividade
   - Interface responsiva e intuitiva

2. **Visualização de Mensagens**
   - Histórico completo de mensagens por conversa
   - Diferenciação visual clara entre tipos de remetentes
   - Rolagem automática para novas mensagens
   - Timestamps formatados em português brasileiro

3. **Diferenciação de Mensagens**
   - **Cliente**: Bolhas cinzas à esquerda
   - **Agente de IA**: Bolhas verdes com borda à esquerda
   - **Agente Humano**: Bolhas azuis à direita

4. **Envio de Mensagens**
   - Campo de entrada com redimensionamento automático
   - Suporte a quebras de linha (Shift + Enter)
   - Feedback visual durante o envio
   - Tratamento de erros

5. **Atualizações em Tempo Real**
   - Conexão WebSocket por conversa específica
   - Recebimento de novas mensagens instantaneamente
   - Indicadores de presença ("usuário está digitando...")
   - Reconexão automática em caso de perda de conexão

### Funcionalidades Bônus ✅

1. **Animações e Micro-interações**
   - Transições suaves entre estados
   - Animação de digitação com pontos pulsantes
   - Hover effects nos elementos interativos
   - Loading states com skeletons

2. **Tratamento Robusto de Erros**
   - Fallback para dados mock em caso de falha na API
   - Mensagens de erro amigáveis ao usuário
   - Retry automático para conexões WebSocket
   - Validação de entrada de dados

3. **Design Responsivo**
   - Layout adaptável para desktop, tablet e mobile
   - Tipografia escalável
   - Componentes flexíveis

4. **Indicadores de Status**
   - Status de conexão WebSocket
   - Contadores de mensagens não lidas
   - Timestamps relativos e absolutos

## Arquitetura do Projeto

### Estrutura de Diretórios

```
sailer-chat-interface/
├── assets/css/           # Estilos globais e configurações CSS
├── components/           # Componentes Vue reutilizáveis
│   ├── chat/            # Componentes específicos do chat
│   └── ui/              # Componentes de UI genéricos
├── composables/         # Funções reutilizáveis (Composition API)
├── layouts/             # Layouts da aplicação
├── pages/               # Páginas/rotas da aplicação
├── stores/              # Módulos Pinia para gerenciamento de estado
├── types/               # Definições de tipos TypeScript
├── nuxt.config.ts       # Configuração do Nuxt
├── tailwind.config.ts   # Configuração do TailwindCSS
└── package.json         # Dependências e scripts
```

### Componentes Principais

1. **ChatList.vue**: Lista de conversas com indicadores de status
2. **ChatListItem.vue**: Item individual da lista com informações resumidas
3. **MessageView.vue**: Área principal de visualização de mensagens
4. **MessageBubble.vue**: Componente individual para cada mensagem
5. **MessageInput.vue**: Campo de entrada com funcionalidades avançadas
6. **TypingIndicator.vue**: Indicador animado de digitação

### Gerenciamento de Estado

O estado da aplicação é gerenciado através do Pinia com uma store centralizada (`stores/chat.ts`) que contém:

- Lista de conversas e participantes
- Mensagens organizadas por conversa
- Status de digitação por usuário
- Informações do usuário logado
- Estado de conexão WebSocket

### Integração com Backend

A aplicação se comunica com um backend FastAPI através de:

1. **REST API** para operações síncronas:
   - `GET /chats` - Listar conversas
   - `GET /chats/{id}/messages` - Buscar mensagens
   - `POST /chats/{id}/messages` - Enviar mensagem

2. **WebSocket** para atualizações em tempo real:
   - `ws://localhost:8000/ws/{chat_id}` - Conexão por conversa
   - Eventos: `message_received`, `presence_updated`, `chat_read`

## Instalação e Configuração

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend FastAPI rodando (opcional para desenvolvimento com dados mock)

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd sailer-chat-interface
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (opcional):
```bash
# .env
API_BASE=http://localhost:8000
WS_BASE=ws://localhost:8000
```

### Executando a Aplicação

#### Modo de Desenvolvimento
```bash
npm run dev
```
A aplicação estará disponível em `http://localhost:3000`

#### Build para Produção
```bash
npm run build
npm run preview
```

#### Geração de Site Estático
```bash
npm run generate
```

## Configuração do Backend (Opcional)

Para funcionalidade completa, execute o backend FastAPI:

1. Clone o repositório do backend:
```bash
git clone https://github.com/SailerAI/frontend-technical-challenge
cd frontend-technical-challenge
```

2. Execute com Docker:
```bash
docker build -t chat-backend .
docker run -p 8000:8000 chat-backend
```

Ou diretamente com Python:
```bash
pip install -r requirements.txt
python main.py
```

## Decisões Arquiteturais e Trade-offs

### Escolha do Stack Tecnológico

**Vue 3 + Nuxt 3**: Escolhidos por oferecerem uma experiência de desenvolvimento moderna com excelente performance e recursos avançados como SSR, roteamento automático e otimizações de build. O Nuxt 3 especificamente oferece melhor integração com TypeScript e ferramentas de desenvolvimento.

**TypeScript**: Implementado para garantir type safety e melhor experiência de desenvolvimento, especialmente importante em uma aplicação que lida com diferentes tipos de dados (mensagens, usuários, eventos WebSocket).

**TailwindCSS**: Selecionado para permitir desenvolvimento rápido de UI com design consistente, evitando CSS customizado desnecessário e garantindo responsividade.

**Pinia**: Escolhido como gerenciador de estado por sua API simples, excelente integração com TypeScript e performance superior ao Vuex.

### Arquitetura de Componentes

A aplicação foi estruturada seguindo o padrão de composição, onde componentes menores e focados são combinados para formar interfaces complexas. Isso facilita a manutenção, testes e reutilização de código.

**Separação de Responsabilidades**: Cada componente tem uma responsabilidade específica, desde a exibição de uma única mensagem até o gerenciamento completo de uma conversa.

**Composables**: Funcionalidades complexas como WebSocket foram extraídas para composables reutilizáveis, permitindo melhor testabilidade e reutilização.

### Gerenciamento de Estado

**Estado Centralizado**: Todas as informações relacionadas ao chat são gerenciadas em uma store central, facilitando o compartilhamento de dados entre componentes e garantindo consistência.

**Otimistic Updates**: Mensagens são adicionadas imediatamente à interface antes da confirmação do servidor, melhorando a percepção de performance.

**Fallback para Dados Mock**: Em caso de falha na comunicação com o backend, a aplicação utiliza dados simulados para permitir desenvolvimento e demonstração.

### Comunicação em Tempo Real

**WebSocket por Conversa**: Cada conversa mantém sua própria conexão WebSocket, evitando overhead desnecessário e permitindo melhor controle de recursos.

**Reconexão Automática**: Implementado sistema de reconexão com backoff exponencial para garantir robustez em conexões instáveis.

**Tratamento de Eventos**: Sistema flexível de tratamento de eventos WebSocket que pode ser facilmente estendido para novos tipos de eventos.

### Performance e Otimização

**Lazy Loading**: Mensagens são carregadas sob demanda quando uma conversa é selecionada.

**Virtual Scrolling**: Considerado para listas grandes de mensagens (não implementado na versão atual por simplicidade).

**Debouncing**: Indicadores de digitação utilizam debouncing para evitar spam de eventos.

### Responsividade e Acessibilidade

**Mobile-First**: Design desenvolvido com abordagem mobile-first, garantindo boa experiência em dispositivos móveis.

**Semantic HTML**: Utilização de elementos HTML semânticos para melhor acessibilidade.

**Keyboard Navigation**: Suporte básico para navegação por teclado nos componentes principais.

## Melhorias Futuras

### Com Mais Tempo de Desenvolvimento

1. **Testes Automatizados**
   - Testes unitários para componentes críticos
   - Testes de integração para fluxos principais
   - Testes E2E para cenários completos de usuário

2. **Funcionalidades Avançadas**
   - Suporte completo para mensagens de imagem e áudio
   - Sistema de notificações push
   - Busca em mensagens
   - Histórico de conversas com paginação
   - Suporte a emojis e reações

3. **Performance**
   - Virtual scrolling para listas grandes
   - Service Worker para cache offline
   - Lazy loading de componentes
   - Otimização de bundle size

4. **UX/UI**
   - Tema escuro
   - Customização de interface
   - Atalhos de teclado
   - Drag & drop para arquivos
   - Preview de links

5. **Monitoramento e Analytics**
   - Tracking de eventos de usuário
   - Métricas de performance
   - Error tracking
   - A/B testing framework

6. **Segurança**
   - Autenticação robusta
   - Criptografia end-to-end
   - Rate limiting
   - Sanitização de conteúdo

### Escalabilidade

Para uma aplicação em produção com milhares de usuários simultâneos, consideraria:

1. **Arquitetura de Microserviços**: Separação de responsabilidades em serviços menores
2. **CDN**: Para entrega otimizada de assets estáticos
3. **Load Balancing**: Para distribuição de carga entre instâncias
4. **Database Optimization**: Índices otimizados e queries eficientes
5. **Caching Strategy**: Redis para cache de sessões e dados frequentes

## Abordagem de Testes

### Estratégia de Testes

Para garantir a qualidade e confiabilidade da aplicação, implementaria uma estratégia de testes em três níveis:

**Testes Unitários (70%)**:
- Componentes Vue isolados
- Funções utilitárias e composables
- Stores Pinia
- Validações e transformações de dados

**Testes de Integração (20%)**:
- Fluxos completos de envio de mensagem
- Integração WebSocket
- Comunicação entre componentes
- Estados complexos da aplicação

**Testes E2E (10%)**:
- Jornadas completas do usuário
- Cenários críticos de negócio
- Testes de regressão
- Performance e acessibilidade

### Ferramentas Sugeridas

- **Vitest**: Para testes unitários e de integração
- **Vue Test Utils**: Para testes de componentes Vue
- **Playwright**: Para testes E2E
- **MSW**: Para mock de APIs durante testes

### Cenários de Teste Prioritários

1. **Envio e Recebimento de Mensagens**
2. **Seleção e Navegação entre Conversas**
3. **Indicadores de Digitação e Presença**
4. **Reconexão WebSocket**
5. **Tratamento de Erros de Rede**
6. **Responsividade em Diferentes Dispositivos**

## Considerações de Produção

### Monitoramento

- Implementação de logging estruturado
- Métricas de performance (Core Web Vitals)
- Alertas para erros críticos
- Dashboard de saúde da aplicação

### Deployment

- CI/CD pipeline automatizado
- Testes automatizados no pipeline
- Deploy em staging antes de produção
- Rollback automático em caso de falhas

### Segurança

- Sanitização de inputs do usuário
- Validação de dados no frontend e backend
- Headers de segurança apropriados
- Rate limiting para prevenir abuse

## Conclusão

Este projeto demonstra a implementação de uma interface de chat moderna e robusta, seguindo as melhores práticas de desenvolvimento frontend. A arquitetura escolhida permite escalabilidade, manutenibilidade e uma excelente experiência do usuário.

A combinação de Vue 3, Nuxt 3, TypeScript e TailwindCSS oferece uma base sólida para desenvolvimento rápido sem comprometer a qualidade. O uso de WebSockets garante comunicação em tempo real eficiente, enquanto o sistema de fallback assegura funcionamento mesmo em cenários de falha.

O código foi estruturado pensando em facilitar futuras expansões e manutenção, com separação clara de responsabilidades e documentação adequada. As decisões arquiteturais foram tomadas considerando tanto as necessidades atuais quanto o potencial de crescimento da aplicação.

---

**Desenvolvido por Luiz Felipe Apolinário**  
*Especialista em Vue.js e Desenvolvimento Frontend Moderno*

