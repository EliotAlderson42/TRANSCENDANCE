FROM python:3.12-slim

ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y gcc libpq-dev

WORKDIR /app

COPY requirements.txt requirements.txt 

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

RUN python transcendance/manage.py collectstatic --noinput

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]