# Dockerfile para backend
FROM python:3.10-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    libpq-dev gcc pkg-config default-libmysqlclient-dev && \
    rm -rf /var/lib/apt/lists/*

# Copiar y instalar las dependencias de Python
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r ./requirements.txt

# Copiar el resto del código del backend
COPY . .

# Exponer el puerto para desarrollo
EXPOSE 8000

# Comando de inicio
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "task_organizer.wsgi:application"]


