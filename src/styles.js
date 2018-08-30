export const HEADER_HEIGHT = 48;
export const MAX_WIDTH = 1400;
export const LATERAL_PADDING_FOR_MAIN_CONTAINERS = 20;

const styles = {
    contentArea: {
        maxWidth: MAX_WIDTH,
        paddingTop: HEADER_HEIGHT,
    },
    feedbackSnackBar: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 3000, // over dialog
    },
};

/* general styles for material-ui with theme */
export const formStylesForTheme = theme => ({
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
});

export default styles;
