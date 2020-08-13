# signauxfaibles-web

Application web d'exploration des données de Signaux Faibles. Voir [signaux-faibles/documentation](https://github.com/signaux-faibles/documentation) pour plus d'informations.

Ce serveur front-end s'appuie sur:
- Keycloak (pour l'identification des utilisateurs, cf variables d'environnement `VUE_APP_KEYCLOAK_*`)
- Datapi (pour accéder aux données, cf variable d'environnement `VUE_APP_DATAPI_BASE_URL`)

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```

### Run your end-to-end tests (TODO)
```
yarn run test:e2e
```

### Run your unit tests (TODO)
```
yarn run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
