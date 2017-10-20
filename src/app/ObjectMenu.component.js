import React, { PropTypes } from 'react';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import i18next from 'i18next';

function getStyle(active, item) {
    if (active === item) {
        return { color:"blue", background:'#ddd'};
    }

    return {};
}

export default function ObjectMenu({ items, action, active }, { d2 }) {
    const menuItems = items
      .map(schemaName => d2.models[schemaName])
      .filter(schema => schema && schema.getTranslatableProperties().length > 0 && d2.currentUser.canUpdate(schema))
      .map(item => (
          <MenuItem
              key={item.plural}
              value={item.plural}
              primaryText={item.displayName}
              style={getStyle(active, item.plural)}
          />
      ));

    return (
        <SelectField
            value={active}
            onChange={(event, index, value) => action(value)}
            floatingLabelText={i18next.t('Object')}
            hintText={i18next.t('Select an Object Type')}
        >
            {menuItems}
        </SelectField>
    );
}
ObjectMenu.contextTypes = {
    d2: PropTypes.object,
};
