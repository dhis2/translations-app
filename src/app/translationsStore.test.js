import * as d2 from 'd2/lib/d2';
import { getTranslationsForLocaleFromModels, setModelsToTranslate, setTranslationLocale, createStore }  from './translationsStore';

describe('TranslationsStore', () => {
    let objects;
    let store;
    let d2Stub;
    let loadLocalesStub;

    beforeEach(() => {
        objects = [
            {
                name: 'AAA',
                id: 'sQZVeuJlZfx',
                shortName: 'AA',
                displayName: 'AAA',
                translations: [
                    {
                        property: 'DESCRIPTION',
                        locale: 'en',
                        value: 'sdfsdfhello'
                    },
                    {
                        property: 'SHORT_NAME',
                        locale: 'en',
                        value: 'hello'
                    },
                    {
                        property: 'SHORT_NAME',
                        locale: 'es',
                        value: 'hello'
                    },
                    {
                        property: 'NAME',
                        locale: 'fr',
                        value: 'sdfsf'
                    },
                    {
                        property: 'NAME',
                        locale: 'en',
                        value: 'dddd'
                    },
                    {
                        property: 'DESCRIPTION',
                        locale: 'es',
                        value: 'hello'
                    },
                    {
                        property: 'DESCRIPTION',
                        locale: 'fr',
                        value: 'sdfsdf'
                    },
                    {
                        property: 'NAME',
                        locale: 'es',
                        value: 'hello'
                    },
                    {
                        property: 'SHORT_NAME',
                        locale: 'fr',
                        value: 'sdf'
                    }
                ]
            },
            {
                name: 'AAAA',
                id: 'wap68IYzTXr',
                shortName: 'AAA',
                displayName: 'AAAA',
                formName: 'The first letter',
                description: 'Muiah',
                translations: []
            },
            {
                name: 'AAAaaa',
                id: 'O6LOSCCFOEg',
                shortName: 'AAAaaa',
                displayName: 'AAAaaa',
                translations: [
                    {
                        property: 'SHORT_NAME',
                        locale: 'en',
                        value: 'sdfsf'
                    },
                    {
                        property: 'NAME',
                        locale: 'en',
                        value: 'sdfsf'
                    }
                ]
            },
            {
                name: 'Accute Flaccid Paralysis (Deaths < 5 yrs)',
                id: 'FTRrcoaog83',
                shortName: 'Accute Flaccid Paral (Deaths < 5 yrs)',
                displayName: 'Accute Flaccid Paralysis (Deaths < 5 yrs)',
                translations: [
                    {
                        property: 'NAME',
                        locale: 'en_GB',
                        value: 'Accute Flaccid Paralysis (Deaths < 5 yrs)'
                    },
                    {
                        property: 'SHORT_NAME',
                        locale: 'fr',
                        value: 'Accute French'
                    },
                    {
                        property: 'SHORT_NAME',
                        locale: 'en_GB',
                        value: 'Accute Flaccid Paral'
                    },
                    {
                        property: 'DESCRIPTION',
                        locale: 'en_FK',
                        value: 'aa'
                    },
                    {
                        property: 'FORM_NAME',
                        locale: 'en_FK',
                        value: 'aa'
                    },
                    {
                        property: 'SHORT_NAME',
                        locale: 'en_FK',
                        value: 'aa'
                    },
                    {
                        property: 'NAME',
                        locale: 'fr',
                        value: 'Accute French'
                    },
                    {
                        property: 'NAME',
                        locale: 'en_FK',
                        value: 'aa'
                    }
                ]
            },
            {
                name: 'Acute Flaccid Paralysis (AFP) follow-up',
                id: 'P3jJH5Tu5VC',
                shortName: 'AFP follow-up',
                displayName: 'Acute Flaccid Paralysis (AFP) follow-up',
                translations: [
                    {
                        property: 'NAME',
                        locale: 'en_GB',
                        value: 'Acute Flaccid Paralysis (AFP) follow-up'
                    },
                    {
                        property: 'SHORT_NAME',
                        locale: 'en_GB',
                        value: 'AFP follow-up'
                    }
                ]
            }
        ];

        d2Stub = sinon.stub(d2, 'getInstance');

        loadLocalesStub = sinon.stub()
                            .returns(Promise.resolve([
                                {"locale":"ar","name":"Arabic"},
                                {"locale":"ar_EG","name":"Arabic (Egypt)"},
                                {"locale":"ar_IQ","name":"Arabic (Iraq)"},
                                {"locale":"ar_SD","name":"Arabic (Sudan)"},
                                {"locale":"bn","name":"Bengali"},
                                {"locale":"bi","name":"Bislama"},
                                {"locale":"my","name":"Burmese"}
                            ]));

        const d2Mock = {
            Api: {
                getApi: sinon.stub()
                    .returns({
                        get: loadLocalesStub
                    })
            }
        };

        d2Stub.returns(Promise.resolve(d2Mock));

        store = createStore();
    });

    afterEach(() => {
        d2Stub.restore();
    });

    describe('getTranslationsForLocaleFromModels', () => {
        it('should return an array', () => {
            expect(getTranslationsForLocaleFromModels()).to.deep.equal({});
        });

        it('should return the translations for the "fr" locale', () => {
            expect(getTranslationsForLocaleFromModels('fr', objects)).to.deep.equal({
                sQZVeuJlZfx: {
                    name: 'sdfsf',
                    shortName: 'sdf',
                    description: 'sdfsdf',
                    formName: ''
                },
                'wap68IYzTXr': {
                    name: '',
                    shortName: '',
                    description: '',
                    formName: ''
                },
                'O6LOSCCFOEg': {
                    name: '',
                    shortName: '',
                    description: '',
                    formName: ''
                },
                'FTRrcoaog83': {
                    name: 'Accute French',
                    shortName: 'Accute French',
                    description: '',
                    formName: ''
                },
                'P3jJH5Tu5VC': {
                    name: '',
                    shortName: '',
                    description: '',
                    formName: ''
                }
            });
        });

        it('should return an empty translations object for a locale without translations', () => {
            expect(getTranslationsForLocaleFromModels('nl_NL', objects)).to.deep.equal({
                sQZVeuJlZfx: {
                    name: '',
                    shortName: '',
                    description: '',
                    formName: ''
                },
                'wap68IYzTXr': {
                    name: '',
                    shortName: '',
                    description: '',
                    formName: ''
                },
                'O6LOSCCFOEg': {
                    name: '',
                    shortName: '',
                    description: '',
                    formName: ''
                },
                'FTRrcoaog83': {
                    name: '',
                    shortName: '',
                    description: '',
                    formName: ''
                },
                'P3jJH5Tu5VC': {
                    name: '',
                    shortName: '',
                    description: '',
                    formName: ''
                }
            });
        });
    });

    describe('setModelsToTranslate', () => {
        it('should set the models to translate onto the store', (done) => {
            setModelsToTranslate(objects);

            store.state$
                .map(state => state.models)
                .take(1)
                .subscribe(
                    (state) => {
                        expect(state).to.deep.equal(objects);
                        done();
                    },
                    done
                );
        });

        // TODO: Because models is a mutable list this test will fail
        xit('should only emit the models once when the same list is set', (done) => {
            setModelsToTranslate(objects);

            store.state$
                .map(state => state.models)
                .subscribe(
                    (state) => {
                        expect(state).to.deep.equal(objects);
                        done();
                    },
                    done
                );

            setModelsToTranslate(objects);
        });
    });

    describe('setTranslationLocale', () => {
        it('should set the passed locale onto the store', (done) => {
            setTranslationLocale('en_GB');

            store.state$
                .map(state => state.currentLocale)
                .take(1)
                .subscribe(
                    (locale) => {
                        expect(locale).to.deep.equal('en_GB');
                        done();
                    },
                    done
                );
        });

        it('should only emit the locale once if the same locale is set', (done) => {
            setTranslationLocale('en_GB');

            store.state$
                .map(state => state.currentLocale)
                .subscribe(
                    (locale) => {
                        expect(locale).to.deep.equal('en_GB');
                        done();
                    },
                    done
                );

            setTranslationLocale('en_GB');
        });
    });

    describe('store', () => {
        it('should init the store with the default locale', (done) => {
            store.state$
                .map(state => state.currentLocale)
                .take(1)
                .subscribe(
                    (locale) => {
                        expect(locale).to.equal('en');
                        done();
                    },
                    done
                );
        });

        it('should init the store with a default list of models', (done) => {
            store.state$
                .map(state => state.models)
                .subscribe(
                    (state) => {
                        expect(state).to.deep.equal([]);
                        done();
                    },
                    done
                );
        });
    });

    describe('loadLocales', () => {
        it('should load the locales from the api', () => {
            expect(loadLocalesStub).to.be.calledWith('locales/ui');
        });

        it('should set the locales onto the store', (done) => {
            store.state$
                .map(state => state.locales)
                .take(1)
                .subscribe(
                    (locales) => {
                        expect(locales).to.deep.equal([
                                {"locale":"ar","name":"Arabic"},
                                {"locale":"ar_EG","name":"Arabic (Egypt)"},
                                {"locale":"ar_IQ","name":"Arabic (Iraq)"},
                                {"locale":"ar_SD","name":"Arabic (Sudan)"},
                                {"locale":"bn","name":"Bengali"},
                                {"locale":"bi","name":"Bislama"},
                                {"locale":"my","name":"Burmese"}
                            ]);
                        done();
                    },
                    done
                );
        });
    });
});
