# TopContributors

A website to thank every PrestaShop contributor

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# launch server to get the contributors list
node server.js
```

To generate the required ``contributors.js`` use **traces** project:

```
composer create-project prestashop/traces
./traces/traces PrestaShop/PrestaShop GitHubLogin GitHubPassword --config="./traces/config.yml.dist"
```


