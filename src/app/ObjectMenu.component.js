import React, { PropTypes } from 'react';

import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

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
            floatingLabelText={d2.i18n.getTranslation('object')}
            hintText={d2.i18n.getTranslation('select_object_type')}
        >
            {menuItems}
        </SelectField>
    );
}
ObjectMenu.contextTypes = {
    d2: PropTypes.object,
};
