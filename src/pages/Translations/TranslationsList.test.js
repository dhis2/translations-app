/* eslint-disable */
/* React */
import React from 'react'

/* unit testing tools */
import { shallow } from 'enzyme'

/* d2-ui */
import { Pagination } from '@dhis2/d2-ui-core'

/* components */
import TranslationCard from './TranslationCard'
import TranslationsList, { NoResults } from './TranslationsList'

/* utils */
import { INITIAL_PAGER, TRANSLATED_ID } from './translations.conf'
import { DEFAULT_LOCALE } from '../../configI18n'
import fakerData from '../../utils/testFaker'

const DEFAULT_PROPS = {
    localeId: DEFAULT_LOCALE.id,
    objects: [],
    pager: INITIAL_PAGER,
    translationState: TRANSLATED_ID,
    goToNextPage: jest.fn(),
    goToPreviousPage: jest.fn(),
    onChangeTranslationForObjectAndLocale: jest.fn(),
    hasUnsavedChanges: jest.fn(),
    clearFeedback: jest.fn(),
    saveTranslations: () => jest.fn(),
    openCard: () => jest.fn(),
}

const ownShallow = (props = DEFAULT_PROPS) => {
    return shallow(<TranslationsList {...props} />, {
        disableLifecycleMethods: true,
    })
}

describe('Test <TranslationsList /> rendering:', () => {
    it('Should render without crashing', () => {
        ownShallow()
    })

    it('Should renders NoResults when there are no objects', () => {
        const wrapper = ownShallow()
        expect(wrapper.find(NoResults)).toHaveLength(1)
    })

    it('Should renders no Pagination when there are no objects', () => {
        const wrapper = ownShallow()
        expect(wrapper.find(Pagination)).toHaveLength(0)
    })

    it('Should renders the correct number of TranslationCard there are objects', () => {
        const wrapper = ownShallow({
            ...DEFAULT_PROPS,
            objects: fakerData.objects,
        })
        expect(wrapper.find(TranslationCard)).toHaveLength(
            fakerData.objects.length
        )
    })

    it('Should renders two Pagination (top and bottom) when there are objects', () => {
        const wrapper = ownShallow({
            ...DEFAULT_PROPS,
            objects: fakerData.objects,
        })
        expect(wrapper.find(Pagination)).toHaveLength(2)
    })
})
