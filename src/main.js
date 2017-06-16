"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var react_redux_1 = require("react-redux");
var d2_1 = require("d2/lib/d2");
var loglevel_1 = require("loglevel");
var LoadingMask_component_1 = require("d2-ui/lib/loading-mask/LoadingMask.component");
require("react-tap-event-plugin");
var App_1 = require("./App");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var store_1 = require("./store");
var lightBaseTheme_1 = require("material-ui/styles/baseThemes/lightBaseTheme");
var getMuiTheme_1 = require("material-ui/styles/getMuiTheme");
var fp_1 = require("lodash/fp");
var react_i18next_1 = require("react-i18next");
var i18n_1 = require("./i18n");
var dhisDevConfig = DHIS_CONFIG; // eslint-disable-line
if (process.env.NODE_ENV !== 'production') {
    loglevel_1["default"].setLevel(1 /* DEBUG */);
}
else {
    loglevel_1["default"].setLevel(2 /* INFO */);
}
// Render the a LoadingMask to show the user the app is in loading
// The consecutive render after we did our setup will replace this loading mask
// with the rendered version of the application.
react_dom_1.render(<MuiThemeProvider_1["default"] muiTheme={getMuiTheme_1["default"](lightBaseTheme_1["default"])}>
        <LoadingMask_component_1["default"] />
    </MuiThemeProvider_1["default"]>, document.getElementById('app'));
/**
 * Renders the application into the page.
 */
function startApp(d2) {
    var i18n = i18n_1.createI18n(fp_1.get('currentUser.userSettings.uiLocale', d2));
    react_dom_1.render(<react_redux_1.Provider store={store_1["default"]}>
            <MuiThemeProvider_1["default"] muiTheme={getMuiTheme_1["default"](lightBaseTheme_1["default"])}>
                <react_i18next_1.I18nextProvider i18n={i18n}>
                    <App_1["default"] d2={d2}/>
                </react_i18next_1.I18nextProvider>
            </MuiThemeProvider_1["default"]>
        </react_redux_1.Provider>, document.querySelector('#app'));
}
// Load the application manifest to be able to determine the location of the Api
// After we have the location of the api, we can set it onto the d2.config object
// and initialise the library. We use the initialised library to pass it into the app
// to make it known on the context of the app, so the sub-components (primarily the d2-ui components)
// can use it to access the api, translations etc.
d2_1.getManifest('./manifest.webapp')
    .then(function (manifest) {
    var baseUrl = process.env.NODE_ENV === 'production' ? manifest.getBaseUrl() : dhisDevConfig.baseUrl;
    d2_1.config.baseUrl = baseUrl + "/api";
    loglevel_1["default"].info("Loading: " + manifest.name + " v" + manifest.version);
    loglevel_1["default"].info("Built " + manifest.manifest_generated_at);
})
    .then(d2_1.init)
    .then(startApp)["catch"](loglevel_1["default"].error.bind(loglevel_1["default"]));
