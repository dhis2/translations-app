import React, { PropTypes } from 'react';

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';

import AppTheme from '../colortheme';
import Term from './Term.component';

import i18next from 'i18next';

export default React.createClass({
    propTypes: {
        d2: PropTypes.object,
        objects: PropTypes.array.isRequired,
        translations: PropTypes.object.isRequired,
        action:  PropTypes.func.isRequired,
        type:    PropTypes.string.isRequired,
    },

    contextTypes: {
      d2: PropTypes.object,
    },

    componentWillMount() {
      this.setState({
        objects: this.props.objects,
      });
    },

    componenWillReceiveProps(nextProps) {
      this.setState({
        objects: nextProps.objects,
        translations: nextProps.translations,
      });

    },

    componentWillUpdate(nextProps,nextState){
    },

    //what to do when they hit save in the Term.component
    //bubble it up to the top
    handleChange(obj) {
      this.props.action(obj);
    },

    render() {
      const d2 = this.props.d2;

      // let keys = Object.keys(this.props.objects);
      let objs = this.props.objects;
      let translations = this.props.translations;
      let hc = this.handleChange;
      let type = this.props.type;

      //skip empty menu objects
      if (objs.length===0){
        return (<Paper zDepth={1} style={{padding:".5em"}}>
            {i18next.t('No records available to translate.')}</Paper>);
      }

      let words = this.props.objects.map(function(d,i){
        if (typeof d.name === 'undefined'){
          d.name='';
        }
        if (typeof d.shortName === 'undefined'){
          d.shortName='';
        }
        if (typeof d.description === 'undefined'){
          d.description='';
        }
        if (typeof d.formName === 'undefined'){
          d.formName='';
        }

        let trans = {name:'',shortName:'',description:'',formName:''};

        if (typeof translations !== 'undefined' && typeof translations[d.id] !== 'undefined' ){
          trans = translations[d.id];
        }

        return (
          <Paper zDepth={1} style={{padding:"1rem",marginBottom:"2rem"}} key={i}>
            <Term source={d} translation={trans} action={hc} type={type} />
          </Paper>
        );

      });

      return (
        <div>
          {words}
        </div>
      );

    },
});
