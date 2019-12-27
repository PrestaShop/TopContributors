# TopContributors

A website to thank every PrestaShop contributor.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

To generate the required ``contributors.js`` use **traces** project:

```
composer create-project prestashop/traces
./traces/traces PrestaShop/PrestaShop GitHubLogin GitHubPassword --config="./traces/config.dist.yml"
```

Then place the file `contributors.js` into the folder named `static`.

## Docker

Added to this repository is a Dockerfile easing up the image build.

It realies heavily on the [docker multi-stage](https://docs.docker.com/develop/develop-images/multistage-build/) feature, in order to provide a clean image for the run.

It also uses the [build arguments](https://docs.docker.com/engine/reference/commandline/build/#set-build-time-variables---build-arg) feature in order to only provide the github credentials during the command line **build**:

```
docker build --no-cache -t top-contributors --build-arg USER_LOGIN={{GITHUB_USER}} --build-arg USER_PASS={{GITHUB_PASSWORD}} -f Dockerfile .
```

Where :

 - GITHUB_USER: is the user that will be passes to retrieves the repository informations.

 - GITHUB_PASSWORD: is either the token or user's password, to authenticate with github.

Please advise that with Two Factor Authentication activated, the password authentication method will likely fail and using a token is much preferable.

Then, if you want to locally **run** this image:

```
docker run -p 80:80 top-contributors
```
