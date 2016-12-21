import React from 'react';

import { getInstance } from 'd2/lib/d2';

import Divider from 'material-ui/lib/divider';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import TextFieldLabel from 'material-ui/lib/text-field';

import AppTheme from '../colortheme';

import translatableObjects from '../config/translatable-objects';

export default React.createClass({
    propTypes: {
        source: React.PropTypes.object.isRequired,
        translation: React.PropTypes.object.isRequired,
        action: React.PropTypes.func.isRequired,
        type:   React.PropTypes.string.isRequired,
        d2: React.PropTypes.object,
    },

    contextTypes: {
        d2: React.PropTypes.object,
    },


    getInitialState() {
      return ({
        source:{},
        trans:{},
        name:'',
        shortName:'',
        description:'',
        formName:'',
        type:''
      });
    },

    componentWillMount() {
      this.setState({
        name: this.props.translation.name,
        shortName: this.props.translation.shortName,
        description: this.props.translation.description,
        formName: this.props.translation.formName,
        trans: this.props.translation,
      });
    },

    componentWillReceiveProps(nextProps) {
      this.setState({
        name: nextProps.translation.name,
        shortName: nextProps.translation.shortName,
        description: nextProps.translation.description,
        formName: nextProps.translation.formName,
        trans: nextProps.translation,
      });
    },

    handleName(e){
      this.setState({ name: e.target.value });
    },

    handleShortName(e){
      this.setState({ shortName: e.target.value });
    },

    handleDescription(e){
      this.setState({ description: e.target.value });
    },

    handleFormName(e){
      this.setState({ formName: e.target.value });
      this.props.action({name: e.target.value});
    },

    renderShortName(o,key,trans,action){
      
      const d2 = this.context.d2;

      const hasKey = [
        'dataElements',
        'organisationUnits',
        'dataSets',
        'organisationUnitGroups',
        'organisationUnitGroupSets',
        'categoryOptions',
        'categories',
        'categoryCombos',
        'categoryOptionGroups',
        'categoryOptionGroupSets',
        'indicators',
        'programs',
        'trackedEntityAttributes',
        'dataElementGroups',
        'dataElementGroupSets',
        'programs'
      ];
      if (hasKey.indexOf(o)>=0){
        return (
          <TextField fullWidth style={{fontSize:"90%",height:'65px'}}
            value={trans}
            floatingLabelText={d2.i18n.getTranslation('short_name') + ':' + key }
            onChange={action}
              />
        );
      }
      return (<span/>);
    },

    renderDescription(o,key,val,action){

      const d2 = this.context.d2;

      const hasKey = [
        'dataElements',
        'organisationUnits',
        'organisationUnitGroupSets',
        'indicators',
        'programRules',
        'indicatorGroupSets',
        'sections',
      ];
      if (hasKey.indexOf(o)>=0){
        return (
          <TextField fullWidth style={{fontSize:"90%",height:'65px'}}
            value={val}
            floatingLabelText= {d2.i18n.getTranslation('description') + ':' + key }
            onChange={action}
            multiLine={true}
            rows={2}
            rowsMax={4}
              />
        );
      }
      return (<span/>);
    },

    renderFormName(o,key,val,action){
      
      const d2 = this.context.d2;

      const hasKey = [
        'dataElements',
      ];
      if (hasKey.indexOf(o)>=0){
        return (
          <TextField fullWidth style={{fontSize:"90%",height:'65px'}}
            value={val}
            floatingLabelText={ d2.i18n.getTranslation('form_name') + ':' + key}
            onChange={action}
              />
        );
      }
      return (<span/>);
    },

    save(){
      this.props.action({
        name:this.state.name,
        shortName:this.state.shortName,
        description:this.state.description,
        formName:this.state.formName,
        id:this.props.source.id
      });
    },

    render() {

      const d2 = this.context.d2;
      
      let d = this.props.source;

      return (
        <div>
          <h3 style={{marginBottom:'0'}}>{d.name}</h3>
          <TextField fullWidth style={{fontSize:"90%",height:'65px'}}
            value={this.state.name}
            floatingLabelText={d2.i18n.getTranslation('name') + ':'+ d.name}
            onChange={this.handleName}
              />
            {this.renderShortName(this.props.type,d.shortName,this.state.shortName,this.handleShortName)}
            {this.renderDescription(this.props.type,d.description,this.state.description,this.handleDescription)}
            {this.renderFormName(this.props.type,d.formName,this.state.formName,this.handleFormName)}
          <RaisedButton
            label= { d2.i18n.getTranslation('save') }
            secondary={true}
            onClick={this.save} />
        </div>
      );
    },
});
