FROM nginx:1.16-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY etransafe-angular-minimal /usr/share/nginx/html/
COPY etransafe-angular-minimal/index.html /usr/share/nginx/html/index.template.html
COPY docker_startup.sh /startup.sh
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/index.html
RUN rm -rf /usr/share/nginx/html/assets/ets_webapp_configuration.json
RUN chmod +x /usr/share/nginx/html/assets
RUN chmod +x /startup.sh
RUN dos2unix /startup.sh
CMD ["/bin/sh", "/startup.sh"]
