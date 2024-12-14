# Usar una imagen base de Node.js
FROM node:18-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios para instalar las dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Instalar un servidor estático para servir la aplicación
RUN npm install -g serve

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando para servir la aplicación
CMD ["serve", "-s", "build", "-l", "3000"]

