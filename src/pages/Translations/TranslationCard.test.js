/* eslint-disable */
/* React */
import React from 'react';

/* unit testing tools */
import { shallow } from 'enzyme';

/* material-ui */
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

/* d2-ui components */
import { Button } from '@dhis2/d2-ui-core';

/* components */
import TranslationCard from './TranslationCard';

/* utils */
import { DEFAULT_TRANSLATABLE_PROPERTIES } from './translations.conf';
import { DEFAULT_LOCALE } from '../../configI18n';

const fakeObject = { id: '1', name: '1', displayName: '1', translations: []};

const DEFAULT_PROPS = {
    localeId: DEFAULT_LOCALE.id,
    object: fakeObject,
    translatableProperties: DEFAULT_TRANSLATABLE_PROPERTIES,
    onChangeTranslationForObjectAndLocale: jest.fn(),
    saveTranslations: jest.fn(),
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
    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('Should render without crashing', () => {
        ownShallow();
    });

    it('Should renders Paper as container', () => {
        expect(wrapper.find(Paper)).toHaveLength(1);
    });

    it('Should renders h3 with object displayName', () => {
        expect(wrapper.find('h3')).toHaveLength(1);
        expect(wrapper.find('h3').text()).toEqual(fakeObject.displayName);
    });

    it('Should renders the correct numbers of TextField components', () => {
        expect(wrapper.find(TextField)).toHaveLength(DEFAULT_TRANSLATABLE_PROPERTIES.length);
    });

    it('Should renders as Button', () => {
        expect(wrapper.find(Button)).toHaveLength(1);
    });
});

describe('Test <TranslationsCard /> actions:', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('Should call onChangeTranslationForObjectAndLocale function when TextField text changes.', () => {
        wrapper.find(TextField).first().simulate('change');
        expect(DEFAULT_PROPS.onChangeTranslationForObjectAndLocale).toHaveBeenCalled();
    });

    it('Should call saveTranslations function when button is clicked.', () => {
        wrapper.find(Button).simulate('click');
        expect(DEFAULT_PROPS.saveTranslations).toHaveBeenCalled();
    });
});