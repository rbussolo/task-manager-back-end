## Task Manager - Back-end

Projeto de Gerenciamento de Tarefas por Usuário

### Funcionalidade

[x] - Criação de Usuário
[x] - Login da aplicação
[x] - Criação de Tarefa
[x] - Edição de Tarefa
[x] - Marcar / Desmarcar como Concluido a tarefa
[x] - Listagem de tarefas

### Instalação

Primeiramente é necessário configurar o arquivo .env caso for rodar ele de forma local e o arquivo .env.production caso for utilizar o DOCKER.

É necessário que o Banco de Dados já esteja criado, a estrutara será criada automaticamente, mas o banco não.

Feito esta configuração, se for utilizar o docker, basta startar a imagem presente na aplicação, caso não, é necessário rodar os seguintes comandos.

1. Primeiro instalar as dependencias

```
npm install
```

2. Agora startar a aplicação

```
npm run start:dev
```

### Variaveis de ambiente

Atualmente o arquivo ".env" utiliza as seguintes configurações:

```
NODE_ENV="development"

POSTGRES_HOST="localhost"
POSTGRES_PORT=5432
POSTGRES_USERNAME="postgres"
POSTGRES_PASSWORD="bussolo"
POSTGRES_DATABASE="task-manager"
```
