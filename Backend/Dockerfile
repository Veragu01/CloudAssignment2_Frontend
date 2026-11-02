FROM python:3.11-slim

WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app.py .

# Copy environment file if it exists
COPY .env.example .env

EXPOSE 5000

CMD ["python", "app.py"]
