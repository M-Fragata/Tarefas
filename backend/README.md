# API de Gerenciamento de Tarefas

API REST para gerenciamento de tarefas, times e membros.

## Tecnologias

- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Autenticação**: JWT (JSON Web Token)
- **Validação**: Zod
- **Testes**: Jest + Supertest

## Pré-requisitos

- Node.js (v18+)
- Docker / Docker Desktop
- PostgreSQL (ou usar Docker)

## Instalação

```bash
npm install
```

## Configuração

1. Inicie o banco de dados PostgreSQL:

```bash
docker-compose up -d
```

2. Execute as migrações do Prisma:

```bash
npx prisma migrate dev
```

3. Configure as variáveis de ambiente no arquivo `.env`:

```env
PORT=3333
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/tarefas?schema=public"
SECRET_KEY="sua_chave_secreta_aqui"
```

## Executando o Projeto

###Modo Desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3333`

### Mode Produção

```bash
npm run build
npm run start
```

## Documentação dos Endpoints

### Users

| Método | Endpoint | Descrição | Autenticação | Autorização |
|--------|----------|-----------|--------------|-------------|
| GET | `/users` | Listar todos os usuários | Não | - |
| POST | `/users` | Criar novo usuário | Não | - |
| POST | `/users/login` | Login do usuário | Não | - |
| PUT | `/users/:id` | Atualizar usuário | Sim | Admin |
| DELETE | `/users/:id` | Deletar usuário | Sim | Admin |

#### Criar Usuário

```bash
POST /users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

#### Login

```bash
POST /users/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta:**

```json
{
  "userWithoutPassword": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "user",
    "teamID": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Atualizar Usuário

```bash
PUT /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "João Silva Atualizado",
  "email": "joao@email.com",
  "role": "admin"
}
```

#### Deletar Usuário

```bash
DELETE /users/:id
Authorization: Bearer <token>
```

---

### Teams

| Método | Endpoint | Descrição | Autenticação | Autorização |
|--------|----------|-----------|--------------|-------------|
| GET | `/teams` | Listar todos os times | Sim | Admin |
| POST | `/teams` | Criar novo time | Sim | Admin |
| PUT | `/teams/:id` | Atualizar time | Sim | Admin |
| DELETE | `/teams/:id` | Deletar time | Sim | Admin |

#### Criar Time

```bash
POST /teams
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Time de Desenvolvimento",
  "description": "Time responsável pelo backend"
}
```

#### Listar Times

```bash
GET /teams
Authorization: Bearer <token>
```

**Resposta:**

```json
[
  {
    "id": "uuid",
    "name": "Time de Desenvolvimento",
    "description": "Time responsável pelo backend",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "_count": {
      "users": 3
    },
    "users": [
      {
        "id": "uuid",
        "name": "Membro 1",
        "email": "membro1@email.com",
        "role": "user"
      }
    ]
  }
]
```

#### Atualizar Time

```bash
PUT /teams/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Novo Nome",
  "description": "Nova descrição"
}
```

#### Deletar Time

```bash
DELETE /teams/:id
Authorization: Bearer <token>
```

---

### Tasks

| Método | Endpoint | Descrição | Autenticação | Autorização |
|--------|----------|-----------|--------------|-------------|
| GET | `/tasks` | Listar todas as tarefas | Sim | User/Admin |
| POST | `/tasks` | Criar nova tarefa | Sim | Admin |
| PUT | `/tasks/:id` | Atualizar tarefa | Sim | User/Admin |
| DELETE | `/tasks/:id` | Deletar tarefa | Sim | User/Admin |
| GET | `/tasks/status` | Filtrar por status | Sim | User/Admin |
| GET | `/tasks/priority` | Filtrar por prioridade | Sim | User/Admin |
| GET | `/tasks/historic/:id` | Histórico da tarefa | Sim | User/Admin |

#### Criar Tarefa

```bash
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "userID": "uuid-do-usuario",
  "title": "Implementar API",
  "description": "Criar endpoint de usuários",
  "priority": "Alta"
}
```

**Prioridades válidas:** `Baixa`, `Media`, `Alta`

#### Atualizar Tarefa

```bash
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "priority": "Media",
  "status": "Concluida"
}
```

**Status válidos:** `Pendente`, `Andamento`, `Concluida`

**Regras de autorização:**
- Usuários podem atualizar apenas suas próprias tarefas
- Admins podem atualizar qualquer tarefa

#### Filtrar por Status

```bash
GET /tasks/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Pendente"
}
```

#### Filtrar por Prioridade

```bash
GET /tasks/priority
Authorization: Bearer <token>
Content-Type: application/json

{
  "priority": "Alta"
}
```

#### Ver Histórico

```bash
GET /tasks/historic/:id
Authorization: Bearer <token>
```

#### Deletar Tarefa

```bash
DELETE /tasks/:id
Authorization: Bearer <token>
```

---

### Members

| Método | Endpoint | Descrição | Autenticação | Autorização |
|--------|----------|-----------|--------------|-------------|
| PUT | `/members/:teamID/adicionar` | Adicionar membro ao time | Sim | Admin |
| PUT | `/members/:userID/remover` | Remover membro do time | Sim | Admin |

#### Adicionar Membro ao Time

```bash
PUT /members/:teamID/adicionar
Authorization: Bearer <token>
Content-Type: application/json

{
  "userID": "uuid-do-usuario"
}
```

#### Remover Membro do Time

```bash
PUT /members/:userID/remover
Authorization: Bearer <token>
```

---

## Testes

### Executar Testes

```bash
npm run test:dev
```

### Configuração de Testes

O projeto utiliza Jest com Supertest para testes de integração. Os testes estão localizados em:

- `src/tests/controllers/user.test.ts`
- `src/tests/controllers/team.test.ts`
- `src/tests/controllers/tasks.test.ts`

### Observações sobre Testes

Alguns testes requerem dados pré-existentes no banco:

- Email: `admin@gmail.com`
- Password: `m4th3us1`

Certifique-se de criar esse usuário admin antes de executar os testes.

## Estrutura do Projeto

```
src/
├── controller/          # Controladores da API
│   ├── User-Controller.ts
│   ├── Team-Controller.ts
│   ├── Task-Controller.ts
│   └── Member-Controller.ts
├── database/
│   └── prisma.ts        # Configuração do Prisma
├── middleware/
│   ├── authenticated.ts # Verificação de JWT
│   ├── authorizated.ts # Verificação de roles
│   └── ErrorHandle.ts # Tratamento de erros
├── routes/              # Definição das rotas
│   ├── index.ts
│   ├── user-routes.ts
│   ├── team-routes.ts
│   ├── task-routes.ts
│   └── member-routes.ts
├── tests/
│   └── controllers/     # Testes
├── utils/
│   └── AppError.ts    # Classe de erro personalizada
├── app.ts            # Configuração do Express
└── server.ts         # Servidor
```

## Licença

ISC