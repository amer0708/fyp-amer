FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_CACHE_DIR=/tmp/pip-cache

WORKDIR /app

# Copy and install dependencies first (layer caching)
COPY requirements.txt .
COPY .env.docker /app/.env


RUN pip install --upgrade pip
RUN pip install --default-timeout=120 --retries=10 -r requirements.txt

# ✅ NOW copy the full Django app
COPY . .


# ✅ Start the app with Gunicorn
CMD ["gunicorn", "fyp.wsgi:application", "--bind", "0.0.0.0:8000"]