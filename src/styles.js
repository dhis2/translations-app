const CONTENT_AREA_PADDING = 20;
const HEADER_HEIGHT = '4rem';

const styles = {
    contentArea: {
        paddingTop: HEADER_HEIGHT,
        paddingBottom: CONTENT_AREA_PADDING,
        paddingLeft: CONTENT_AREA_PADDING,
        paddingRight: CONTENT_AREA_PADDING,
    },
    feedbackSnackBar: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 3000, // over dialog
    },
};

export default styles;
