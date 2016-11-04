import React from 'react';

import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';

import AppTheme from '../colortheme';

export default React.createClass({
    propTypes: {
        pager: React.PropTypes.object.isRequired,
        page: React.PropTypes.number.isRequired,
        action:  React.PropTypes.func.isRequired,
    },

    // componentWillMount() {
    //   this.setState({
    //     page: this.props.page,
    //   });
    // },


    firstPage(event) {
      this.props.action(-1000);
    },

    previousPage(event) {
      this.props.action(-1);
    },

    nextPage(event) {
      this.props.action(1);
    },

    lastPage(event) {
      this.props.action(1000);
    },

    render() {
      return (
        <div>
          <IconButton tooltip="First Page" tooltipPosition="top-left"
              disabled={this.props.page<=1}
              onClick={this.firstPage}>
            <FontIcon className="material-icons">fast_rewind</FontIcon>
          </IconButton>
          <IconButton tooltip="Previous Page" tooltipPosition="top-left"
              disabled={this.props.page<=1}
              onClick={this.previousPage}>
            <FontIcon className="material-icons">navigate_before</FontIcon>
          </IconButton>
          &nbsp;
          {this.props.pager.page} / {this.props.pager.pageCount}
           &nbsp;
          <IconButton tooltip="Next Page" tooltipPosition="top-right"
              disabled={this.props.page == this.props.pager.pageCount}
              onClick={this.nextPage}>
            <FontIcon className="material-icons">navigate_next</FontIcon>
          </IconButton>
          <IconButton tooltip="Last Page" tooltipPosition="top-right"
              disabled={this.props.page == this.props.pager.pageCount}
              onClick={this.lastPage}>
            <FontIcon className="material-icons">fast_forward</FontIcon>
          </IconButton>
        </div>
      );

    },
});
