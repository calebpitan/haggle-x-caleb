# HaggleX URL Metadata Parser GraphQL API

This is a repository of code that creates a simple GraphQL API for parsing and generating webpage metadata when supplied the URL to the webpage.

The metadata is parsed primarily from the [Open Graph protocol](https://ogp.me) meta tags and fallbacks to normal HTML meta tags when the OG tags aren't present in the document.

## Getting started

Clone and/or fork your copy of this repository to your development machine and change to the working directory of the newly cloned repo `haggle-x-caleb`.

```bash
# Clone this copy
git clone git@github.com:calebpitan/haggle-x-caleb.git
```

```bash
# Or clone your fork
git clone git@github.com:<username>/haggle-x-caleb.git
```

Change to the new working directory

```bash
cd haggle-x-caleb
```

### Install dependencies

Make sure you have Node.js and Docker installed on your development machine. Run:

```bash
yarn install
```

to install the project dependencies and alternatively with `npm`:

```bash
npm install
```

### Starting the app

You can decide to start the app manually, but bear in mind you will need to have Redis installed on your local machine to start it manually as the app depends on a Redis Server to work. 

If you don't have Redis installed on your local machine then you can just start the app using Docker and `docker-compose` which creates an executable OS image of the app bundled with all external required resources and dependencies.

> You may create a `.env` file at the root directory to define and assign values to the environment variables defined in `.env.dev` which would be loaded when the process starts.

```bash
docker-compose up [--build]
```

The app will listen on a port `:3000` by default and the GraphQL API can be acessed at `http://localhost:3000/graphql`. You can open your preferred browser and hit that address in the address bar to test and introspect the GraphQL API using the in-browser GraphiQL/GraphQL Explorer.

## Testing

This app is fully tested with both unit and end-to-end testing. The unit tests can be run on this command:

```bash
yarn test
```

while the integration (e2e) tests can be run on this command:

```bash
yarn test:e2e
```

## Debugging

This app is completely debuggable and listens for debugging on a socket connection at port `:9229` at a complete address `0.0.0.0:9229` and has the debugging integrated into the VSCode Editor. To debug, run:

```bash
yarn start:debug
```

When the debug server is started, you can set breakpoints in your VSCode editor and send a GraphQL query using the explorer you opened in the browser and watch your VSCode pause the execution at the selected breakpoint for you to inspect live variables and troubleshoot amongst other things.

## Deployment

This app is deployed on Heroku using Github Actions as the CI/CD pipeline. The deployment is automated and occurs when a pull request is merged after all tests have passed on the development branch.

