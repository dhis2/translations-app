/* eslint-disable */
/* React */
import React from 'react';

/* unit testing tools */
import { shallow } from 'enzyme';

/* material-ui */
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Done from '@material-ui/icons/Done';

/* d2-ui components */
import { Button } from '@dhis2/d2-ui-core';

/* components */
import TranslationCard from './TranslationCard';

/* utils */
import { DEFAULT_TRANSLATABLE_PROPERTIES, TRANSLATED_ID } from './translations.conf';
import { DEFAULT_LOCALE } from '../../configI18n';
import fakerData from '../../utils/testFaker';

const fakeObject = fakerData.objects[0];
const fakeTranslations = DEFAULT_TRANSLATABLE_PROPERTIES.map(property => ({
    property: property.translationKey,
    locale: DEFAULT_LOCALE.id,
    value: 'value',
}));

const DEFAULT_PROPS = {
    open: true,
    localeId: DEFAULT_LOCALE.id,
    object: fakeObject,
    translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    onChangeTranslationForObjectAndLocale: jest.fn(),
    saveTranslations: jest.fn(),
    openCard: jest.fn(),
};

const ownShallow = (props = DEFAULT_PROPS) => {
    return shallow(
        <TranslationCard
            { ...props }
        />,
        {
            disableLifecycleMethods: true,
        }
    );
};

describe('Test <TranslationsCard /> rendering:', () => {
    it('Should render without crashing', () => {
        ownShallow();
    });

    it('Should renders Paper as container', () => {
        const wrapper = ownShallow();
        expect(wrapper.find(Paper)).toHaveLength(1);
    });

    it('Should renders h3 with object displayName', () => {
        const wrapper = ownShallow();
        expect(wrapper.find('h3')).toHaveLength(1);
        expect(wrapper.find('h3').text()).toEqual(fakeObject.displayName);
    });

    it('Should renders the correct numbers of TextField components when it is open', () => {
        const wrapper = ownShallow({
            ...DEFAULT_PROPS,
            object: {
                ...fakeObject,
                translations: fakeTranslations,
            },
        });
        expect(wrapper.find(TextField)).toHaveLength(fakeTranslations.length);
    });

    it('Should renders a Button when it is open', () => {
        const wrapper = ownShallow();
        expect(wrapper.find(Button)).toHaveLength(1);
    });

    it('Should renders a disable Button when it has no translations', () => {
        const wrapper = ownShallow({
            ...DEFAULT_PROPS,
            object: {
                ...fakeObject,
                translations: [],
            }
        });
        expect(wrapper.find(Button).props().disabled).toBeTruthy();
    });

    it('Should renders a disable Button when it has no edited translations', () => {
        const wrapper = ownShallow({
            ...DEFAULT_PROPS,
            object: {
                ...fakeObject,
                translations: [{
                    property: DEFAULT_TRANSLATABLE_PROPERTIES[0].translationKey,
                    locale: DEFAULT_LOCALE.id,
                    value: '',
                }],
            },
        });
        expect(wrapper.find(Button).props().disabled).toBeTruthy();
    });

    it('Should renders an enable Button when it edited translations', () => {
        const wrapper = ownShallow({
            ...DEFAULT_PROPS,
            object: {
                ...fakeObject,
                translations: [{
                    property: DEFAULT_TRANSLATABLE_PROPERTIES[0].translationKey,
                    locale: DEFAULT_LOCALE.id,
                    value: 'someValue',
                }],
            },
        });
        expect(wrapper.find(Button).props().disabled).toBeFalsy();
    });

    it('Should renders no TextField when it is not open', () => {
        const wrapper = ownShallow({
            ...DEFAULT_PROPS,
            open: false,
        });
        expect(wrapper.find(Button)).toHaveLength(0);
    });

    it('Should renders no Button when it is not open', () => {
        const wrapper = ownShallow({
            ...DEFAULT_PROPS,
            open: false,
        });
        expect(wrapper.find(Button)).toHaveLength(0);
    });

    it('Should renders Done icon when it is translated', () => {
        const wrapper = ownShallow({
            ...DEFAULT_PROPS,
            object: {
                ...fakeObject,
                translationState: TRANSLATED_ID,
            }
        });
        expect(wrapper.find(Done)).toHaveLength(1);
    });

    it('Should renders no Done icon when it is not translated', () => {
        const wrapper = ownShallow({
            ...DEFAULT_PROPS,
            object: {
                ...fakeObject,
                translated: false,
            }
        });
        expect(wrapper.find(Done)).toHaveLength(0);
    });
});

describe('Test <TranslationsCard /> actions:', () => {
    it('Should call openCard function when Header is clicked.', () => {
        const wrapper = ownShallow({
            ...DEFAULT_PROPS,
            open: false,
        });
        wrapper.find(Grid).first().simulate('click');
        expect(DEFAULT_PROPS.openCard).toHaveBeenCalled();
    });

    it('Should call onChangeTranslationForObjectAndLocale function when TextField text changes.', () => {
        const wrapper = ownShallow({
            ...DEFAULT_PROPS,
            object: {
                ...fakeObject,
                translations: fakeTranslations,
            },
        });
        wrapper.find(TextField).first().simulate('change', {
            target: {
                value: 'newText',
            }
        });
        expect(DEFAULT_PROPS.onChangeTranslationForObjectAndLocale).toHaveBeenCalled();
    });

    it('Should call saveTranslations function when button is clicked.', () => {
        const wrapper = ownShallow({
            ...DEFAULT_PROPS,
            object: {
                ...fakeObject,
                translations: [{
                    property: DEFAULT_TRANSLATABLE_PROPERTIES[0].translationKey,
                    locale: DEFAULT_LOCALE.id,
                    value: 'someValue',
                }],
            },
        });
        wrapper.find(Button).simulate('click');
        expect(DEFAULT_PROPS.saveTranslations).toHaveBeenCalled();
    });
});