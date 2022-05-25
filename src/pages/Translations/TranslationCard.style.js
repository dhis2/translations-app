import {
    TRANSLATED_ID,
    UNTRANSLATED_ID,
    PARTIAL_TRANSLATED_ID,
} from './translations.conf.js'

export const colors = {
    [TRANSLATED_ID]: '#1c9d17',
    [UNTRANSLATED_ID]: '#000000',
    [PARTIAL_TRANSLATED_ID]: '#ff9800',
}
const styles = {
    actionsContainer: {
        paddingTop: 20,
        paddingBottom: 20,
    },
    header: {
        cursor: 'pointer',
        textTransform: 'uppercase',
    },
    icon: {
        textAlign: 'right',
    },
}

export default styles
