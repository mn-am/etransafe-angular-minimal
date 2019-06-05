echo "Starting application..."
echo "BASE_HREF = ${BASE_HREF}"
echo "ETS_ENVIRONMENT = ${ETS_ENVIRONMENT}"
echo "ETS_GATEWAY_URL = ${ETS_GATEWAY_URL}"
echo "ETS_AUTHENTICATION_API_URL = ${ETS_AUTHENTICATION_API_URL}"
echo "ETS_KNOWLEDGE_HUB_REGISTRY_API_URL = ${ETS_KNOWLEDGE_HUB_REGISTRY_API_URL}"
envsubst < /usr/share/nginx/html/assets/ets_webapp_configuration.template.json > /usr/share/nginx/html/assets/ets_webapp_configuration.json
envsubst < /usr/share/nginx/html/index.template.html > /usr/share/nginx/html/index.html
echo "Content of index.html"
less /usr/share/nginx/html/index.html
echo "Content of ets_webapp_configuration.json"
less /usr/share/nginx/html/assets/ets_webapp_configuration.json
nginx -g 'daemon off;'

