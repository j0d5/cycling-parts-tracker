FROM docker.io/nginx:stable-alpine

COPY dist/apps/client /usr/share/nginx/html
COPY apps/client/nginx.conf  /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
