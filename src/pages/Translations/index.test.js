/* eslint-disable */
/* React */
import React from 'react';

/* unit testing tools */
import { shallow } from 'enzyme';

/* components */
import TranslationPage from './index';
import TranslationsList from './TranslationsList';
import TranslationsSearch from './TranslationsSearch';

/* utils */
import fakerData from '../../utils/testFaker';

const ownShallow = () => {
    return shallow(
        <TranslationPage
            d2={fakerData.d2}
        />,
        {
            disableLifecycleMethods: true,
        }
    );
};

describe('Test <App /> rendering:', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = ownShallow();
    });

    it('Should render without crashing', () => {
        ownShallow();
    });

    it('Should renders TranslationsSearch', () => {
        expect(wrapper.find(TranslationsSearch)).toHaveLength(1);
    });

    it('Should renders TranslationsList', () => {
        expect(wrapper.find(TranslationsList)).toHaveLength(1);
    });
});