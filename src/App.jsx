import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import React from 'react'
import App from './components/App.jsx'
import 'material-design-icons-iconfont'

const AppWrapper = () => {
    const { d2 } = useD2()

    if (!d2) {
        return null
    }

    return <App d2={d2} />
}

export default AppWrapper
