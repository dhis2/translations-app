import React from 'react';

import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';

import AppTheme from '../colortheme';

export default React.createClass({
    propTypes: {
        items: React.PropTypes.array.isRequired,
        default: React.PropTypes.string.isRequired,
        action:  React.PropTypes.func.isRequired,
    },

    componentWillMount() {
      this.setState({
        selectedIndex: this.props.default,
        items: this.props.objects,
      });
    },

    getSelectedStyle() {
        return {color:"blue",background:'#ddd'};
    },

    handleChangeRequest(event,menuitem,index) {
      this.setState({
        selectedIndex: menuitem.key,
      });
      this.props.action(menuitem.key);
    },

    render() {
      //name,nameableObject,displayName,plural
      let menuItems = [];
      for (let item of this.props.items){
        menuItems.push(<MenuItem value={item.plural} key={item.plural} primaryText={item.displayName}
          style={(item.plural===this.state.selectedIndex)?(this.getSelectedStyle()):{width:"260px"}}
          />);
      }
      return (
        <Menu onItemTouchTap={this.handleChangeRequest}>
          {menuItems}
        </Menu>
      );

    },
});
