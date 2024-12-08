# Dockerfile para React (frontend)
FROM node:18-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar las dependencias del frontend
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código del frontend
COPY . .

# Crear la aplicación para producción
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Servir la aplicación estática
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]
