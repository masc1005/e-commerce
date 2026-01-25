# Scripts de Banco de Dados

## Seed Admin

Script que cria automaticamente um usuário administrador no banco de dados.

### Como funciona

- Executado automaticamente no Docker ao iniciar o container (após as migrations)
- Verifica se já existe um admin com o email configurado
- Se não existir, cria um novo admin com as credenciais definidas nas variáveis de ambiente
- Se já existir, apenas informa e continua

### Variáveis de Ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `ADMIN_EMAIL` | `admin@loomi.com` | Email do administrador padrão |
| `ADMIN_PASSWORD` | `admin123` | Senha do administrador padrão |
| `ADMIN_NAME` | `Administrador` | Nome do administrador padrão |

### Execução Manual

Para executar o script manualmente (fora do Docker):

```bash
npm run db:seed
```

### Segurança

⚠️ **IMPORTANTE**: Altere a senha do administrador após o primeiro login em produção!

As credenciais padrão devem ser alteradas através das variáveis de ambiente antes de fazer deploy em produção.

### Exemplo de uso com Docker Compose

```yaml
environment:
  ADMIN_EMAIL: "seu-email@empresa.com"
  ADMIN_PASSWORD: "SenhaForte123!@#"
  ADMIN_NAME: "Admin Principal"
```
