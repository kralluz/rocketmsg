# Etapa 1: Build
FROM node:18 AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos necessários para o build
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Executa os comandos do Prisma para preparar o banco de dados
RUN npx prisma generate
RUN npx prisma migrate deploy

# Executa o build do Next.js
RUN npm run build

# Remove dependências de desenvolvimento para reduzir o tamanho da imagem final
RUN npm prune --production

# Etapa 2: Produção
FROM node:18

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos necessários da etapa de build
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma  

# Porta exposta
EXPOSE 3045

# Comando para iniciar a aplicação
CMD ["npm", "start"]
