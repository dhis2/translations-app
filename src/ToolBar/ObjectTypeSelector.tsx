import React, { StatelessComponent } from 'react';
import PropTypes from 'prop-types';
import { noop, compose } from 'lodash/fp';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { translate, TranslationFunction } from 'react-i18next';
import { mapProps } from 'recompose';
import { changeObjectType } from './actions';
import { selectedObjectTypeSelector, objectTypesSelector } from './selectors';
import { StoreState } from "../types";

function getStyle(active: string, item: string) {
    if (active === item) {
        return { color:"blue", background:'#ddd'};
    }

    return {};
}

type ObjectTypeSelectorProps = {
    items: Array<string>;
    action: Function;
    active: string;
    hintText: string;
    labelText: string;
};

type ObjectTypeSelectorContext = {
    d2: D2;
}

const ObjectTypeSelector: StatelessComponent<ObjectTypeSelectorProps> = ({ items = [], action = noop, active, hintText, labelText }, { d2 } : ObjectTypeSelectorContext) => {
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
            className="tool-bar--select-field"
            value={active}
            onChange={(event, index, value) => action(value)}
            floatingLabelText={labelText}
            hintText={hintText}
            autoWidth={true}
        >
            {menuItems}
        </SelectField>
    );
}
ObjectTypeSelector.contextTypes = {
    d2: PropTypes.object,
};

const mapStateToProps = (state: StoreState) => ({
    active: selectedObjectTypeSelector(state),
    items: objectTypesSelector(state),
});

const mapDispatchToProps = bindActionCreators.bind(null, {
    action: changeObjectType,
});

const enhance = compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate(),
    mapProps(({ t, ...props }: { t: TranslationFunction }) => ({
        ...props,
        hintText: t('Object Menu'),
        labelText: t('Select an Object Type')
    }))
);

export default enhance(ObjectTypeSelector);
