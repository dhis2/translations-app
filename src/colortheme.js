import Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import Spacing from 'material-ui/lib/styles/spacing';
import zIndex from 'material-ui/lib/styles/zIndex';
import ThemeManager from 'material-ui/lib/styles/theme-manager';

const theme = {
    spacing: Spacing,
    zIndex: zIndex,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: Colors.lightblue200,
        primary2Color: Colors.lightblue400,
        primary3Color: Colors.lightblue600,
        accent1Color: Colors.deeppurple300,
        accent2Color: Colors.grey100,
        accent3Color: Colors.grey500,
        textColor: Colors.darkBlack,
        alternateTextColor: Colors.white,
        canvasColor: Colors.white,
        borderColor: Colors.grey300,
        disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
        pickerHeaderColor: Colors.cyan800,

    }
};


function createAppTheme(style) {
    return {
        sideBar: {
            backgroundColor: '#F3F3F3',
            backgroundColorItem: 'transparent',
            backgroundColorItemActive: style.palette.accent2Color,
            textColor: style.palette.textColor,
            textColorActive: style.palette.primary1Color,
            borderStyle: '1px solid #e1e1e1',
        },
        forms: {
            minWidth: 350,
            maxWidth: 900,
        },
    };
}

const muiTheme = ThemeManager.getMuiTheme(theme);
const appTheme = createAppTheme(theme);

export default Object.assign({}, muiTheme, appTheme);
