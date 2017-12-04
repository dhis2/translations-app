import React from 'react';

import { getInstance } from 'd2/lib/d2';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper/Paper';
import CircularProgress from 'material-ui/CircularProgress/CircularProgress';

import AppTheme from '../colortheme';
import ObjectMenu from './ObjectMenu.component';
import Translations from './Translations.component';
import Pager from './Pager.component';
import actions from '../actions';
import translatableObjects from '../config/translatable-objects';

import i18next from 'i18next';

const defaultTranslationObject = 'organisationUnits';

const availableProperties = {name:'NAME',shortName:'SHORT_NAME',description:'DESCRIPTION',formName:'FORM_NAME'};


// TODO: Rewrite as ES6 class
/* eslint-disable react/prefer-es6-class */
export default React.createClass({

    propTypes: {
        d2: React.PropTypes.object,
    },

    contextTypes: {
        d2: React.PropTypes.object,
    },

    getInitialState() {
        const currentUser = this.props.d2.currentUser;

        return {
          processing_menu:true,
          processing_objects:false,
          processing_translations:false,
          lang_source: '-',
          lang_dest: currentUser && currentUser.userSettings && currentUser.userSettings.keyUiLocale || 'en',
          locales: [],
          menu: translatableObjects,
          objects: [],
          currentObject: '',
          translations:{},
          pager:{page:0,pageCount:0,total:0,pageSize:0},
          page:1,
        };
    },

    componentDidMount() {
      this.getLocales();
    },

    // get the server supported locales. kind of.
    getLocales() {
        const d2 = this.context.d2;
        const api = d2.Api.getApi();

        api.get('locales/db',{
          paging:false
        }).then(promise=>{
          if (typeof promise === 'object'){
            this.setState({
              locales:promise
            });
          }
        });
    },

    // switching destination locale
    handleDestChange (event, index, value) {
      this.setState({lang_dest:value});
      if (value!=='-'){
        this.getTranslations(value);
      }
    },

    //helper method to look up translatable objects from DHIS2
    getObjects(objectName,page){
      const d2 = this.context.d2;

      this.setState({
        currentObject:objectName,
        objects:[],
        processing_objects:true}
      );

      if (typeof d2.models[objectName] === 'undefined'){
        actions.showSnackbarMessage(i18next.t('Could not locate that type of Object'));
        console.warn("No such dhis2 model");
        return;
      }

      if (typeof page === 'undefined'){
        page = 1;
      }

      d2.models[objectName].list({
        fields: ['id', 'displayName'].concat(d2.models[objectName].getTranslatableProperties()).join(','),
        page: page,
        pageSize: 5,
      })
      .then(collection => {
        this.setState({
          objects:collection.toArray(),
          pager:collection.pager,
          processing_objects:false,
        });
        return collection;
      })
      .then(x => {
        //get the available translations
        if (x.pager.total>0){
          this.getTranslations(this.state.lang_dest);
        }
        else{
          this.setState({
            translations:{},
            processing_translations:false}
          );
        }
      });
    },

    //traverse through the results
    switchPage(direction){
      let thisPage = this.state.page + direction;
      if (thisPage<=0){
        thisPage=1;
      }
      else if (thisPage > this.state.pager.pageCount){
        thisPage = this.state.pager.pageCount;
      }
      this.setState({page:thisPage});
      this.getObjects(this.state.currentObject,thisPage);
    },

    //find all the translations for this grouping of objects
    getTranslations(locale){
      const d2 = this.context.d2;
      const api = d2.Api.getApi();

      if (locale===this.state.lang_source){
        //source and dest are the same, skip
        return;
      }

      if (this.state.currentObject===''){
        actions.showSnackbarMessage(i18next.t('Select an Object Type'));
        return;
      }

      let tr = {};
      this.setState({translations:tr});

      //loop over all the objects and find translations for them
      for (let obj of this.state.objects){
        let route = this.state.currentObject+'/'+obj.id+'/translations';

        api.get(route,{})
          .then(promise=>{
            if (promise.hasOwnProperty('translations') && promise.translations.length>0){
              let somethingToShow = false;
              for (let trans of promise.translations){
                if (trans.locale === this.state.lang_dest){
                  for (let prop of Object.keys(availableProperties)){
                    if (availableProperties[prop]===trans['property']){
                      if (tr.hasOwnProperty(obj.id)===false){
                        tr[obj.id]={name:'',shortName:'',description:'',formName:''};
                      }
                      tr[obj.id][prop]=trans.value;
                    }
                  }
                  somethingToShow= true;
                }
              }
              if (somethingToShow === true){
                this.setState({translations:tr});
              }
            }
        })
        .then(() => {
          this.setState({processing_translations:false});
        });
      }
    },

    saveTranslation(object){
      const d2 = this.context.d2;
      const api = d2.Api.getApi();

      let route = this.state.currentObject+'/'+object.id+'/translations';
      let translations = [];

      //set new values
      for (let key of Object.keys(availableProperties)){
        if (object[key]!==''){
          translations.push({property: availableProperties[key], locale: this.state.lang_dest, value: object[key]});
        }
      }

      //get all the translations for this object
      api.get(route)
        .then(promise => {
          //keep the other locale translations around
          if (promise.hasOwnProperty('translations') && promise.translations.length>0){
            //translations exist, make sure to check for this locale and overwrite
            for (let existing of promise.translations){
              if (existing.locale!==this.state.lang_dest){
                translations.push(existing);
              }
            }
          }
          //add in our new ones for this locale
          api.update(route,{translations:translations})
            .then(saving=>{
              actions.showSnackbarMessage(i18next.t('Saved'));
              //refresh (we should just update the single record instead of doing a full refresh...)
              this.getTranslations(this.state.lang_dest);
            });

      });
    },

    render() {
        const d2 = this.props.d2;

        let locales = [];
        for (let locale of this.state.locales){
          locales.push(<MenuItem key={locale.locale} value={locale.locale} primaryText={locale.name} />)
        }

        return (
            <div className="wrapper">
              <Toolbar noGutter={false}  style={{height:'70px', }}>
                <ToolbarGroup firstChild={true}>
                  <SelectField value={this.state.lang_dest} onChange={this.handleDestChange} floatingLabelText={i18next.t('Target Locale')} style={{ marginRight: '1rem', marginLeft: '1rem' }}>
                    {locales}
                  </SelectField>
                  <ObjectMenu items={this.state.menu} active={this.state.currentObject} action={this.getObjects} />
                </ToolbarGroup>
                <ToolbarGroup>
                  <Pager pager={this.state.pager} page={this.state.page} action={this.switchPage}/>
                </ToolbarGroup>
              </Toolbar>

              <div className="content-wrap">
                <div className='translations' style={{float:'left',minHeight:'500px',minWidth:'500px',margin:'0px',padding:'2rem 2rem'}}>
                  { (this.state.processing_translations) ? <CircularProgress size={1} style={{float:'right'}}/> : null }
                  { (this.state.processing_objects) ? <CircularProgress size={3} style={{float:'right'}}/> : null }
                  <Translations d2={d2}
                                type={this.state.currentObject}
                                objects={this.state.objects}
                                translations={this.state.translations}
                                action={this.saveTranslation} />
                </div>
              </div>
          </div>
        );
    },
});
