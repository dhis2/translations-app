const HeaderBarComponent: any = require('d2-ui/lib/app-header/HeaderBar').default;
const headerBarStore$: any = require('d2-ui/lib/app-header/headerBar.store').default;
const withStateFrom: any = require('d2-ui/lib/component-helpers/withStateFrom').default;

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

export default HeaderBar;
