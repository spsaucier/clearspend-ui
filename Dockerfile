# base image
FROM node:16-alpine as builder

COPY . /app
# build app
RUN cd /app && \
	npm i && \
	npm run build

FROM nginx:stable
LABEL app=ui
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./configs/nginx/default.conf /etc/nginx/conf.d/default.conf
