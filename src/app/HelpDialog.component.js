import React from 'react';

import FloatingActionButton from 'material-ui/lib/floating-action-button';
import FontIcon from 'material-ui/lib/font-icon';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';

import AppTheme from '../colortheme';

export default React.createClass({
    getInitialState: function() {
      return { open: false };
    },
    handleOpen: function(){
      this.setState({open:true});
    },
    handleClose: function(){
      this.setState({open:false});
    },
    render: function() {
      const actions = [
        <FlatButton label="Close" primary={true} onTouchTap={this.handleClose} />
      ];
      return (
        <div className="helpButton">
          <FloatingActionButton mini={true} onTouchTap={this.handleOpen} secondary={true}>
            <FontIcon className="material-icons">help</FontIcon>
          </FloatingActionButton>
          <Dialog title={this.props.title}
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
            autoScrollBodyContent={true}
            titleClassName="helpDialogTitle"
            contentStyle={{maxWidth: '75%'}}
          >
            {this.props.content}
          </Dialog>
        </div>
      );
    },
});
