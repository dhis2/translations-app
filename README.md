# DHIS2 Translations App

## About

This app serves as an internationalization utility for [DHIS2](https://dhis2.org). It will allow you to easily translate the metadata in the database, such as data elements, indicators into any language of your choice. This effort is part of the larger i18n and i10n process of DHIS2. @see https://docs.google.com/document/d/1u0YhRZD2Q3F8p6VCsz7dXdZxJL45R0qsEfsNc0OCJYs/edit

## Building

### Prerequisites

Make sure you have at least the following versions of `node` and `npm`.

* Node version v5.6.0 or higher
* npm version 3.8.0 or higher

Use the following commands to check your current versions

```sh
node -v
```

```sh
npm -v
```

### Getting started

Clone the repository from github with the following command

```sh
git clone git@github.com:dhis2/translations-app
```

Install the node dependencies

```sh
npm install
```

To set up your DHIS2 instance to work with the development service you will need to add the development servers address to the CORS whitelist. You can do this within the DHIS2 Settings app under the _access_ tab. On the access tab add `http://localhost:8081` to the CORS Whitelist.

> The starter app will look for a DHIS 2 development instance configuration in
> `$DHIS2_HOME/config`. So for example if your `DHIS2_HOME` environment variable is
> set to `~/.dhis2`, the starter app will look for `~/.dhis2/config.js` and then
> `~/.dhis2/config.json` and load the first one it can find.
>
> The config should export an object with the properties `baseUrl` and
> `authorization`, where authorization is the base64 encoding of your username and
> password. You can obtain this value by opening the console in your browser and
> typing `btoa('user:pass')`.
>
> If no config is found, the default `baseUrl` is `http://localhost:8080/dhis` and
> the default username and password is `admin` and `district`, respectively.
>
> See `webpack.config.js` for details.

This should enable you to run the following node commands:

To run the development server

```sh
npm start
```

To run the tests one time

```sh
npm test
```

To run the tests continuously on file changes (for your BDD workflow)

```sh
npm run test-watch
```

To generate a coverage report for the tests

```sh
npm run coverage
```

To run E2E tests

```sh
npm run test-e2e
```

To check the code style for both the JS and SCSS files run

```sh
npm run lint
```

### Distributing

To make a DHIS2 app zip file, run:

```sh
npm run-script dist
```
Then load the `build/translations-app.zip` file to your DHIS2 instance.
