FROM node:8 AS builder1

COPY . /app/
WORKDIR /app/

RUN apt-get update && \
    apt-get install -y zip && \
    apt-get clean


RUN npm install && \
    npm run build

FROM php AS builder2
ARG USER_PASS
ENV ENV_USER_PASS=$USER_PASS
ARG USER_LOGIN
ENV ENV_USER_LOGIN=$USER_LOGIN

WORKDIR /app/
COPY --from=builder1 /app /app

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"  && \
    php composer-setup.php && \
    php -r "unlink('composer-setup.php');"

RUN apt-get update && \
    apt-get install -y git && \
    apt-get clean
    
RUN ./composer.phar create-project prestashop/traces

RUN ./traces/traces PrestaShop/PrestaShop $ENV_USER_LOGIN $ENV_USER_PASS --config="./traces/config.dist.yml"

FROM httpd:2.4.41-alpine

COPY --from=builder2 /app/dist/ /usr/local/apache2/htdocs/
COPY --from=builder2 /app/contributors.js /usr/local/apache2/htdocs/static/
