/* eslint-disable */
/* React */
import React from 'react'

/* d2-ui components */
import { Button } from '@dhis2/d2-ui-core'

/* unit testing tools */
import { mount, shallow } from 'enzyme'
import ConfirmationDialog from './ConfirmationDialog'

const DEFAULT_PROPS = {
    open: true,
    closeConfirmation: jest.fn(),
}

const ownShallow = (props = DEFAULT_PROPS) => {
    return shallow(<ConfirmationDialog {...props} />, {
        disableLifecycleMethods: true,
    })
}

describe('Test <ConfirmationDialog /> rendering:', () => {
    it('Should render without crashing', () => {
        ownShallow()
    })

    it("Should render a 'Keep editing' and a 'Discard changes' button", () => {
        const wrapper = ownShallow()
        expect(wrapper.find(Button)).toHaveLength(2)
    })
})

describe('Test <ConfirmationDialog /> actions:', () => {
    let wrapper
    beforeEach(() => {
        wrapper = ownShallow({ ...DEFAULT_PROPS })
    })

    it('Should call closeConfirmation function with "false" when Keep editing button is clicked.', () => {
        wrapper.find(Button).at(0).simulate('click')
        expect(DEFAULT_PROPS.closeConfirmation).toHaveBeenCalledWith(false)
    })

    it('Should call closeConfirmation function with "true" when Discard button is clicked.', () => {
        wrapper.find(Button).at(1).simulate('click')
        expect(DEFAULT_PROPS.closeConfirmation).toHaveBeenCalledWith(true)
    })
})
