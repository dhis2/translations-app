/* eslint-disable */
/* React */
import React from 'react';

/* unit testing tools */
import { shallow } from 'enzyme';

/* d2-ui */
import { Pagination, CheckBox } from '@dhis2/d2-ui-core';

/* components */
import TranslationCard from './TranslationCard';
import TranslationsList, { NoResults } from './TranslationsList';

/* utils */
import { INITIAL_PAGER,  } from './translations.conf';
import { DEFAULT_LOCALE } from '../../configI18n';
import fakerData from '../../utils/testFaker';

const DEFAULT_PROPS = {
    hideTranslated: false,
    localeId: DEFAULT_LOCALE.id,
    objects: [],
    pager: INITIAL_PAGER,
    goToNextPage: jest.fn(),
    goToPreviousPage: jest.fn(),
    onChangeTranslationForObjectAndLocale: jest.fn(),
    saveTranslations: () => jest.fn(),
    openCard: () => jest.fn(),
    toggleHideTranslated: jest.fn(),
};

const ownShallow = (props = DEFAULT_PROPS) => {
    return shallow(
        <TranslationsList
            { ...props }
        />,
        {
            disableLifecycleMethods: true,
        }
    );
};

describe('Test <TranslationsList /> rendering:', () => {
    it('Should render without crashing', () => {
        ownShallow();
    });

    it('Should renders NoResults when there are no objects', () => {
        const wrapper = ownShallow();
        expect(wrapper.find(NoResults)).toHaveLength(1);
    });

    it('Should renders no Pagination when there are no objects', () => {
        const wrapper = ownShallow();
        expect(wrapper.find(Pagination)).toHaveLength(0);
    });

    it('Should renders no CheckBox when there are no objects', () => {
        const wrapper = ownShallow();
        expect(wrapper.find(CheckBox)).toHaveLength(0);
    });

    it('Should renders CheckBox for hide translated', () => {
        const wrapper = ownShallow({
            ...DEFAULT_PROPS,
            objects: fakerData.objects,
        });
        expect(wrapper.find(CheckBox)).toHaveLength(1);
    });

    it('Should renders the correct number of TranslationCard there are objects', () => {
        const wrapper = ownShallow({
            ...DEFAULT_PROPS,
            objects: fakerData.objects,
        });
        expect(wrapper.find(TranslationCard)).toHaveLength(fakerData.objects.length);
    });

    it('Should renders two Pagination (top and bottom) when there are objects', () => {
        const wrapper = ownShallow({
            ...DEFAULT_PROPS,
            objects: fakerData.objects,
        });
        expect(wrapper.find(Pagination)).toHaveLength(2);
    });

    it('Should renders the correct number of TranslationCard when hide translated is checked', () => {
        const wrapper = ownShallow({
            ...DEFAULT_PROPS,
            objects: fakerData.objects,
            hideTranslated: true,
        });
        expect(wrapper.find(TranslationCard)).toHaveLength(fakerData.objects.filter(o => !o.translated).length);
    });
});

describe('Test <TranslationsList /> actions:', () => {
    it('Should call toggleHideTranslated function when Checkbox for hide translated changes.', () => {
        const wrapper = ownShallow({
            ...DEFAULT_PROPS,
            objects: fakerData.objects,
        });
        wrapper.find(CheckBox).simulate('change');
        expect(DEFAULT_PROPS.toggleHideTranslated).toHaveBeenCalled();
    });
});

