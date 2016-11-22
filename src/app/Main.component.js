import React from 'react';

import { getInstance } from 'd2/lib/d2';

import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/lib/toolbar';
import Paper from 'material-ui/lib/paper';
import CircularProgress from 'material-ui/lib/circular-progress';

import AppTheme from '../colortheme';
import HelpDialog from './HelpDialog.component';
import ObjectMenu from './ObjectMenu.component';
import Translations from './Translations.component';
import Pager from './Pager.component';
import actions from '../actions';

const help = {
  nuqjatlh:(
    <div>
      <p>
        This app provides a convenient interface to explore and modify existing internationalization (i18n) fields within your DHIS2 application.
      </p>
      <p>
        Features:
      </p>
      <ul style={{listStyle: 'none'}}>
        <li>Demo</li>
      </ul>
    </div>
  ),
}

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
        return {
          processing_menu:true,
          processing_objects:false,
          processing_translations:false,
          lang_source: '-',
          lang_dest: '-',
          lang_filter: 'all',
          locales: [],
          menu: [],
          objects: [],
          currentObject: '',
          translations:{},
          pager:{page:0,pageCount:0,total:0,pageSize:0},
          page:1,
        };
    },

    componentDidMount() {
      this.getTranslatableClasses();
      this.getLocales();
    },

    // get the server supported locales. kind of.
    getLocales() {
        const d2 = this.context.d2;
        const api = d2.Api.getApi();

        api.get('locales/ui',{
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

    handleFilterChange (event, index, value) {
      this.setState({lang_filter:value});
    },

    //get the main menu object items
    getTranslatableClasses(){
      ///api/schemas?filter=schema.nameableObject=true&fields=name
      const d2 = this.context.d2;
      const api = d2.Api.getApi();

      api.get('schemas',{
        paging:false,
        fields:'name,nameableObject,displayName,plural',
      }).then(promise=>{
        if (promise.hasOwnProperty('schemas')){
          this.setState({
            menu:promise.schemas.filter(function(o){ return o.nameableObject}),
            processing_menu:false});
        }
      });
    },

    //helper method to look up translatable objects from DHIS2
    getObjects(objectName,page){
      const d2 = this.context.d2;
      if (this.state.lang_dest==='-'){
        actions.showSnackbarMessage(d2.i18n.getTranslation('select_language'));
      }

      this.setState({
        currentObject:objectName,
        objects:[],
        processing_objects:true}
      );

      if (typeof d2.models[objectName] === 'undefined'){
        actions.showSnackbarMessage(d2.i18n.getTranslation('error_could_not_find_object'));
        console.warn("No such dhis2 model");
        return;
      }

      if (typeof page === 'undefined'){
        page = 1;
      }

      d2.models[objectName].list({page:page})
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
      if (locale===this.state.lang_source || locale==='-'){
        //source and dest are the same, skip
        return;
      }

      if (this.state.currentObject===''){
        actions.showSnackbarMessage(d2.i18n.getTranslation('select_object_type'));
        return;
      }

      this.setState({translations:{}});

      const d2 = this.context.d2;
      const api = d2.Api.getApi();

      //loop over all the objects and find translations for them
      for (let obj of this.state.objects){
        let route = this.state.currentObject+'/'+obj.id+'/translations';

        let tr = this.state.translations;

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
                      this.setState({translations:tr});
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
        .then(x => {
          this.setState({processing_translations:false});
        });
      }
    },

    saveTranslation(object){
      const d2 = this.context.d2;
      const api = d2.Api.getApi();

      //figure out which translation object this is for via objectTranslationMap
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
          if (promise.hasOwnProperty('translations')){
            if (promise.length>0){
              //translations exist, make sure to check for this locale and overwrite
              for (let existing of promise){
                let trans = {};
                if (existing.locale===this.state.lang_dest){ //same locale so see if something changed
                  //skip
                }
                else{  //different locale so keep it around
                  trans = existing;
                }
                translations.push(trans);
              }
            }
          }
          //add in our new ones for this locale
          api.update(route,{translations:translations})
            .then(saving=>{
              actions.showSnackbarMessage(d2.i18n.getTranslation('saved'));
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
              <Toolbar noGutter={false}  style={{height:'70px'}}>
                <ToolbarGroup firstChild={true}>
                  <ToolbarTitle text={d2.i18n.getTranslation('tool')} style={{marginLeft:'30px'}} />
                  <ToolbarSeparator />
                </ToolbarGroup>
                <ToolbarGroup lastChild={true}>
                  <SelectField value={this.state.lang_dest} onChange={this.handleDestChange} floatingLabelText={d2.i18n.getTranslation('target_locale')} style={{marginLeft:'10px',width:'220px'}}>
                    <MenuItem key='-' value={'-'} primaryText={d2.i18n.getTranslation('select_language')} />
                    {locales}
                  </SelectField>
                </ToolbarGroup>
                <ToolbarGroup>
                  <ToolbarSeparator />
                </ToolbarGroup>
                <ToolbarGroup>
                  <SelectField value={this.state.lang_filter} onChange={this.handleFilterChange} floatingLabelText={d2.i18n.getTranslation('filter_by')} style={{width:'200px'}}>
                    <MenuItem value={'all'} primaryText={d2.i18n.getTranslation('filter_by_all')} />
                    <MenuItem value={'existing'} primaryText={d2.i18n.getTranslation('filter_by_translated')} />
                    <MenuItem value={'missing'} primaryText={d2.i18n.getTranslation('filter_by_untranslated')} />
                  </SelectField>
                </ToolbarGroup>
              </Toolbar>

              <h3 className="subdued title_description">{d2.i18n.getTranslation('subtitle')}</h3>
              <HelpDialog style={{float:"right"}} title={d2.i18n.getTranslation('help')} content={help.nuqjatlh} />

              <div className='menu' style={{float:'left',minHeight:'500px',margin:'0',padding:'0em 1em',width:'315px'}}>
                <h3>{d2.i18n.getTranslation('header_menu')}</h3>
                { (this.state.processing_menu) ? <CircularProgress size={1} style={{float:'right'}}/> : null }
                <ObjectMenu items={this.state.menu} default='' action={this.getObjects} />
              </div>

              <div className='translations' style={{float:'left',minHeight:'500px',minWidth:'500px',margin:'0',padding:'0em 1em'}}>
                { (this.state.processing_translations) ? <CircularProgress size={1} style={{float:'right'}}/> : null }

                <div style={{float:'right'}}>
                  <Pager pager={this.state.pager} page={this.state.page} action={this.switchPage}/>
                </div>
                <h3>{d2.i18n.getTranslation('header_translations')}</h3>
                { (this.state.processing_objects) ? <CircularProgress size={3} style={{float:'right'}}/> : null }
                <Translations d2={d2}
                              type={this.state.currentObject}
                              objects={this.state.objects}
                              translations={this.state.translations}
                              action={this.saveTranslation}
                              filter={this.state.lang_filter} />
              </div>
          </div>
        );
    },
});
