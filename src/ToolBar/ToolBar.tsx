import React from 'react';
import LocaleSelector from './LocaleSelector';
import ObjectTypeSelector from './ObjectTypeSelector';
import SaveButton from './SaveButton';

import './ToolBar.scss';

function ToolBar() {
    return (
        <div className="tool-bar">
            <LocaleSelector />
            <ObjectTypeSelector />
            <SaveButton />
        </div>
    );
}

export default ToolBar;
