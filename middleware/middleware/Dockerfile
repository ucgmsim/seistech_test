FROM python:3.8.2 as intermediate

RUN pip install --upgrade pip

WORKDIR /tmp

ARG SSH_PRIVATE_KEY

RUN mkdir /root/.ssh/
RUN echo "${SSH_PRIVATE_KEY}" >> /root/.ssh/id_rsa && chmod 600 /root/.ssh/id_rsa

RUN touch /root/.ssh/known_hosts
RUN ssh-keyscan -t rsa github.com >> /root/.ssh/known_hosts

COPY ./private_requirements.txt /tmp/

RUN pip install -r private_requirements.txt

FROM python:3.8.2
RUN pip install --upgrade pip

COPY --from=intermediate /usr/local/lib/python3.8/site-packages/ /usr/local/lib/python3.8/site-packages/
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY . /app

RUN pip install -r requirements.txt

CMD ["python", "app.py"]