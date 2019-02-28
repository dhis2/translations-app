# DHIS2 Translations App

[![Build Status](https://travis-ci.com/dhis2/translations-app.svg)](https://travis-ci.com/dhis2/translations-app) [![Greenkeeper badge](https://badges.greenkeeper.io/dhis2/translations-app.svg)](https://greenkeeper.io/)

### Pre-requisites

-   DHIS2 instance running
-   node 8 LTS
-   yarn v1.3.2+

### Running the dev server

-   add `http://localhost:3000` url to your DHIS2 CORS whitelist. (This can be done in the settings app).

-   By default app will use `http://localhost:8080` as API URL, if you want to change it, create a config.json file
    inside DHIS2_HOME with following content "replacing url for the required one":

        ```json
        {
            "baseUrl": "http://localhost:8080"
        }
        ```

*   Execute the following commands:

    ```sh
    yarn install
    yarn start
    ```

*   Open your browser at `http://localhost:3000` (you must to be logged in into DHIS2).

### Building the project

To build a production version of the application run the following command:

```sh
yarn build
```

### Unit testing

-   in the root folder of the project make a copy of `.env.template` and name it `.env.test.local`.

To execute unit tests run the following command:

```sh
yarn test
```

### E2E testing

To execute end-to-end tests run the following command:

```sh
export DHIS2_BASE_URL=http://your_dhis2_instance.com/
yarn test-e2e
```

You must have the dev server running on port 3000, as explained previously.
