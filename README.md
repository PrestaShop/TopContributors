# Top Contributors

[contributors.prestashop-project.org](https://contributors.prestashop-project.org/)

A website to thank every PrestaShop contributors.

This Nuxt 4 application showcasing PrestaShop's top contributors, companies, and community members who actively contribute to the PrestaShop ecosystem.

## Features

- **Top Contributors**: Display rankings of individual contributors based on their pull requests
- **Top Companies**: Showcase companies making significant contributions to PrestaShop
- **Wall of Fame**: Comprehensive tables featuring all contributors and companies
- **New Contributors**: Highlight recent additions to the contributor community
- **Responsive Design**: Built with Tailwind CSS and PUIK Components for a modern, mobile-friendly experience

## Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) - The Intuitive Vue Framework
- **UI Components**: [PUIK Components](https://prestashop.github.io/puik/) - PrestaShop UI Kit
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- **Carousel**: [Vue3 Carousel](https://ismail9k.github.io/vue3-carousel/) - Flexible carousel component
- **Code Quality**: ESLint with Nuxt ESLint module and Stylistic plugin

## Prerequisites

- Node.js (v18 or higher recommended)
- pnpm

## Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
```

## Data Sources

The application uses JSON files stored in the [public](public/) directory:

- [contributors_prs.json](public/contributors_prs.json) - Individual contributor statistics
- [topcompanies_prs.json](public/topcompanies_prs.json) - Company contribution data
- [newcontributors.json](public/newcontributors.json) - Recent contributor additions

To generate this files use **traces** project:

```
composer create-project prestashop/traces
./traces/traces -u <GitHubLogin> -p <GitHubPassword> -o PrestaShop --config="./traces/config.dist.yml"
```

Then place the files into the folder named `public`.

## Development

```bash
# Start development server at http://localhost:3000
pnpm dev
```

## Preview

```bash
# Build the application
pnpm build

# Preview the production build at http://localhost:3000
pnpm preview
```

## Code Quality

```bash
# Lint code
pnpm lint

# Lint and fix issues
pnpm lint:fix
```

## Configuration

### Nuxt Config

The project uses Nuxt 4 with the following modules:

- `@nuxt/eslint` - ESLint integration
- `@nuxt/image` - Image optimization
- `@nuxt/test-utils` - Testing utilities

### Auto-imports

Components from PUIK are automatically imported using `unplugin-vue-components` and `unplugin-auto-import` with the PUIK resolver.

## Docker

Added to this repository is a Dockerfile easing up the image build.

It realies heavily on the [docker multi-stage](https://docs.docker.com/develop/develop-images/multistage-build/) feature, in order to provide a clean image for the run.

It also uses the [build arguments](https://docs.docker.com/engine/reference/commandline/build/#set-build-time-variables---build-arg) feature in order to only provide the github credentials during the command line **build**:

```
docker build --no-cache -t top-contributors --build-arg USER_LOGIN={{GITHUB_USER}} --build-arg USER_PASS={{GITHUB_PASSWORD}} -f Dockerfile .
```

Where :

- GITHUB_USER: is the user that will be passed to retrieve the repository informations.

- GITHUB_PASSWORD: is either a token or your github user password, to authenticate with github.

Please advise that with Two Factor Authentication currently being activated, the password authentication method will likely fail and using a token is much preferable.

Then, if you want to locally **run** this image:

```
docker run -p 80:80 top-contributors
```

## Deployment

The development branch is `develop`. Code changes should be merged inside `develop` using Pull Requests.

When you want to deploy latest changes to production environment contributors.prestashop-project.org ;

- open then merge a Pull Request merging branch `develop` inside `main` ([example](https://github.com/PrestaShop/TopContributors/pull/105))
- then publish a GitHub release to trigger the deployment of the production environment

## Contributing

Contributions are welcome! Please ensure your code:

- Follows the ESLint configuration
- Uses proper TypeScript types
- Is properly formatted
- Includes appropriate documentation

## Links

- [PrestaShop](https://www.prestashop-project.org/)
- [PrestaShop GitHub](https://github.com/PrestaShop/PrestaShop)
- [Traces](https://github.com/PrestaShop/traces)
