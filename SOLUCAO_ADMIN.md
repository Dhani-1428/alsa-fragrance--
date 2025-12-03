# Solução: Erro de Conexão Recusada

## Problema

O erro `ERR_CONNECTION_REFUSED` significa que o servidor não está a correr ou não conseguiu iniciar.

## Solução Aplicada

Executei os seguintes comandos para resolver:

1. ✅ Removi o ficheiro de lock que estava a bloquear o servidor
2. ✅ Parei processos que estavam a usar as portas 3000 e 3002
3. ✅ Limpei a cache do Next.js
4. ✅ Reiniciei o servidor

## Próximos Passos

### 1. Verifique se o Servidor Está a Correr

Olhe para o terminal onde executou `npm run dev`. Deve ver algo como:

```
✓ Ready in X seconds
○ Local:        http://localhost:3000
```

### 2. Aceda ao Painel Admin

Depois do servidor iniciar, abra no navegador:

**👉 http://localhost:3000/admin/login**

Ou se aparecer port 3002:
**👉 http://localhost:3002/admin/login**

### 3. Credenciais de Login

- **Email**: `admin@alsafragrance.com`
- **Password**: `admin123`

---

## Se Ainda Não Funcionar

### Opção 1: Reiniciar Manualmente

1. Pare o servidor (Ctrl+C no terminal)
2. Execute:
   ```powershell
   Remove-Item -Recurse -Force .next
   npm run dev
   ```

### Opção 2: Verificar Portas

Se a porta 3000 estiver ocupada:

```powershell
# Ver o que está a usar a porta 3000
netstat -ano | findstr :3000

# Matar o processo (substitua PID pelo número)
taskkill /PID <PID> /F
```

### Opção 3: Usar Outra Porta

```bash
npm run dev -- -p 3001
```

Depois aceda: http://localhost:3001/admin/login

---

## Verificar se Está a Funcionar

1. O terminal deve mostrar "Ready" sem erros
2. Deve conseguir abrir http://localhost:3000 no navegador
3. A página de login do admin deve aparecer

---

## Ajuda Adicional

Se continuar com problemas:

1. **Verifique o terminal** - há alguma mensagem de erro?
2. **Verifique o navegador** - abra a consola (F12) e veja se há erros
3. **Partilhe as mensagens de erro** que aparecem

