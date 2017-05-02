import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import ObjectMenu from './ObjectMenu.component';
import Translations from './Translations.component';
import Pager from './Pager.component';
import actions from '../actions';
import { connectToStore, setCurrentSchema, setTranslationLocale, saveTranslationsFor, setFilter }  from './translationsStore';
import { isEmpty, compose, get, nthArg, __, flip, negate, filter, keys, intersection, pick, curry, equals, reduce, toPairs, map, concat, isEqual, identity } from 'lodash/fp';
import rxjsconfig from 'recompose/rxjsObservableConfig'
import setObservableConfig from 'recompose/setObservableConfig';

setObservableConfig(rxjsconfig);

const getValueFromSelectFieldCallback = nthArg(2);
const onLocaleChange = compose(setTranslationLocale, getValueFromSelectFieldCallback);
const onFilterChange = compose(setFilter, getValueFromSelectFieldCallback);

// TODO: Rewrite as ES6 class
/* eslint-disable react/prefer-es6-class */
const MainComponent = React.createClass({
    propTypes: {
        d2: React.PropTypes.object,
    },

    contextTypes: {
        d2: React.PropTypes.object,
    },

    // switching destination locale
    handleDestChange (event, index, value) {
      setTranslationLocale(value);
    },


    //find all the translations for this grouping of objects
    getTranslations(locale){
      const d2 = this.context.d2;
      const api = d2.Api.getApi();

      if (locale===this.state.lang_source){
        //source and dest are the same, skip
        return;
      }

      if (this.props.currentSchema===''){
        actions.showSnackbarMessage(d2.i18n.getTranslation('select_object_type'));
        return;
      }
    },

    render() {
        const d2 = this.props.d2;
        const locales = this.props.locales
          .map(locale => (<MenuItem key={locale.locale} value={locale.locale} primaryText={locale.name} />));

        return (
            <div className="wrapper">
              <Toolbar noGutter={false}  style={{height:'70px', }}>
                <ToolbarGroup firstChild={true}>
                  <SelectField value={this.props.currentLocale} onChange={onLocaleChange} floatingLabelText={d2.i18n.getTranslation('target_locale')} style={{ marginRight: '1rem', marginLeft: '1rem' }}>
                    {locales}
                  </SelectField>
                </ToolbarGroup>
                <ToolbarGroup>
                  <ObjectMenu items={this.props.translatableObjects} active={this.props.currentSchema} action={setCurrentSchema} />
                </ToolbarGroup>
                <ToolbarGroup>
                  <SelectField value={this.props.filter} onChange={onFilterChange} floatingLabelText={d2.i18n.getTranslation('filter_by')} style={{width:'200px', marginLeft: '1rem'}}>
                    <MenuItem value={'ALL'} primaryText={d2.i18n.getTranslation('filter_by_all')} />
                    <MenuItem value={'EXISTING'} primaryText={d2.i18n.getTranslation('filter_by_translated')} />
                    <MenuItem value={'MISSING'} primaryText={d2.i18n.getTranslation('filter_by_untranslated')} />
                  </SelectField>
                </ToolbarGroup>
                <ToolbarGroup>
                    <Pager />
                </ToolbarGroup>
              </Toolbar>

              <div className="content-wrap">
                <div className='translations' style={{float:'left',minHeight:'500px',minWidth:'500px',margin:'0px',padding:'2rem 2rem'}}>
                  <Translations
                        d2={d2}
                        type={this.props.currentSchema}
                        objects={this.props.models}
                        translations={this.props.translations}
                        action={saveTranslationsFor}
                        filter={this.props.filter}
                  />
                </div>
              </div>
          </div>
        );
    },
});

const mapStoreStateToProps = store$ => store$
    .map(pick(['locales', 'currentLocale', 'models', 'translations', 'translatableObjects', 'currentSchema', 'filter']))
    .map(state => ({
        ...state,
        models: (function () {
            return state.models;
        }())
    }));

export default connectToStore(mapStoreStateToProps)(MainComponent);
