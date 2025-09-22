FROM python:3.12-slim

# System-Setup
WORKDIR /app

# Dependencies installieren
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Code ins Image kopieren
COPY . .

# Gunicorn starten
CMD ["gunicorn", "podcast.donkai:app", "--bind=0.0.0.0:8000"]
