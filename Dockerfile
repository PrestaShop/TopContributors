FROM node:12 AS builder1

COPY . /app/
WORKDIR /app/

RUN apt-get update && \
    apt-get install -y zip

RUN npm install && \
    npm run build && \
    npm run generate

FROM composer AS builder2
ARG USER_PASS
ENV ENV_USER_PASS=$USER_PASS
ARG USER_LOGIN
ENV ENV_USER_LOGIN=$USER_LOGIN

WORKDIR /app/
COPY --from=builder1 /app /app

RUN composer create-project prestashop/traces

RUN ./traces/traces -u $ENV_USER_LOGIN -p $ENV_USER_PASS -o PrestaShop --config="./traces/config.dist.yml"  --timeout 30

FROM httpd:2.4.41-alpine

COPY --from=builder2 /app/dist/ /usr/local/apache2/htdocs/
COPY --from=builder2 /app/contributors.js /usr/local/apache2/htdocs/
