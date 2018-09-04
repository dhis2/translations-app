import { DEFAULT_TRANSLATABLE_PROPERTIES } from '../pages/Translations/translations.conf';

const fakerData = {
    d2: {
        system: {
            major: 2,
            version: 30,
            snapshot: true,
        },
        Api: {
            getApi: () => ({ baseUrl: 'http://localhost:8080' }),
        },
        models: [{
            name: 'model',
            displayName: 'model',
            apiEndpoint: '/model',
            isTranslatable: () => true,
            getTranslatablePropertiesWithKeys: () => DEFAULT_TRANSLATABLE_PROPERTIES,
        }],
        currentUser: {
            canUpdate: () => true,
        },
    },
    objects: [
        { id: '1', name: '1', displayName: '1', translations: [], translated: true },
        { id: '2', name: '2', displayName: '2', translations: [], translated: false },
        { id: '3', name: '3', displayName: '3', translations: [], translated: false },
        { id: '4', name: '4', displayName: '4', translations: [], translated: false },
        { id: '5', name: '5', displayName: '5', translations: [], translated: true },
    ],
};

export default fakerData;
