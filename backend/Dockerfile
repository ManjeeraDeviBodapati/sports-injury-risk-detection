# Multi-stage Dockerfile for FastAPI Backend Engine
FROM python:3.10-slim as builder

WORKDIR /app

# Install system dependencies required for OpenCV & build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir pydantic-settings email-validator numpy opencv-python pyjwt passlib bcrypt httpx pytest

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
