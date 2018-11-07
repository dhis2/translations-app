/* eslint-disable */
/* React */
import React from 'react'

/* unit testing tools */
import { shallow } from 'enzyme'

/* components */
import App from './App'
import TranslationPage from './pages/Translations'

import fakerData from './utils/testFaker'

const ownShallow = () => {
    return shallow(<App d2={fakerData.d2} />, {
        disableLifecycleMethods: true,
    })
}

describe('Test <App /> rendering:', () => {
    let wrapper
    beforeEach(() => {
        wrapper = ownShallow()
    })

    it('Should render without crashing', () => {
        ownShallow()
    })

    it('Should renders TranslationPage', () => {
        expect(wrapper.find(TranslationPage)).toHaveLength(1)
    })
})
