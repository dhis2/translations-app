import React, { PropTypes } from 'react';

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';

import AppTheme from '../colortheme';
import Term from './Term.component';

export default React.createClass({
    propTypes: {
        d2: PropTypes.object,
        objects: PropTypes.array.isRequired,
        translations: PropTypes.object.isRequired,
        action:  PropTypes.func.isRequired,
        filter:  PropTypes.string.isRequired,
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

    //based upon the translatable fields, should this translation be hidden by the filter
    shouldHideObject(trans){
      let o = this.props.type;
      let filter = this.props.filter;

      if (filter==='existing'){
        if (trans.name===''){
          if (o==='optionSets' ||
              o==='options' ||
              o==='organisationUnitLevels' ||
              o==='validationRules' ||
              o==='programStages' ||
              o==='indicatorTypes' ||
              o==='indicatorGroups' ||
              o==='trackedEntityAttributeGroups'){
            return true;
          }
          else if (trans.shortName===''){
            if (o==='organisationUnits' ||
                o==='dataSets' ||
                o==='organisationUnitGroups' ||
                o==='categoryOptions' ||
                o==='categories' ||
                o==='categoryCombos' ||
                o==='categoryOptionGroups' ||
                o==='categoryOptionGroupSets' ||
                o==='programs' ||
                o==='trackedEntityAttributes' ||
                o==='dataElementGroups' ||
                o==='dataElementGroupSets' ||
                o==='programs'){
              return true;
            }
            else if (trans.description===''){
              if (o==='organisationUnitGroupSets' ||
                  o==='indicators' ||
                  o==='programRules' ||
                  o==='indicatorGroupSets' ||
                  o==='sections'){
                return true;
              }
              else if (trans.formName==='' && o==='dataElaments'){
                return true;
              }
            }
          }
        }
      }
      else if (filter==='missing'){
        if (trans.name!==''){
          if (o==='optionSets' ||
              o==='options' ||
              o==='organisationUnitLevels' ||
              o==='validationRules' ||
              o==='programStages' ||
              o==='indicatorTypes' ||
              o==='indicatorGroups' ||
              o==='trackedEntityAttributeGroups'){
            return true;
          }
          else if (trans.shortName!==''){
            if (o==='organisationUnits' ||
                o==='dataSets' ||
                o==='organisationUnitGroups' ||
                o==='categoryOptions' ||
                o==='categories' ||
                o==='categoryCombos' ||
                o==='categoryOptionGroups' ||
                o==='categoryOptionGroupSets' ||
                o==='programs' ||
                o==='trackedEntityAttributes' ||
                o==='dataElementGroups' ||
                o==='dataElementGroupSets' ||
                o==='programs'){
              return true;
            }
            else if (trans.description!==''){
              if (o==='organisationUnitGroupSets' ||
                  o==='indicators' ||
                  o==='programRules' ||
                  o==='indicatorGroupSets' ||
                  o==='sections'){
                return true;
              }
              else if (trans.formName!=='' && o==='dataElaments'){
                return true;
              }
            }
          }
        }
      }
      return false;
    },

    render() {
      const d2 = this.props.d2;

      // let keys = Object.keys(this.props.objects);
      let objs = this.props.objects;
      let translations = this.props.translations;
      let filter = this.props.filter;
      let hc = this.handleChange;
      let hideObject = this.shouldHideObject;
      let type = this.props.type;

      //skip empty menu objects
      if (objs.length===0){
        return (<Paper zDepth={1} style={{padding:".5em"}}>
            {d2.i18n.getTranslation('no_results')}</Paper>);
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

        //see if this should be filtered out
        if (hideObject(trans)!==false){
          return (<span key={i}/>);
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
