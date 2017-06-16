import { createStore, applyMiddleware, Store } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import appEpics from './epics';
import { startApp } from './actions';
import reducer from './reducers';
import {StoreState} from "./types";

const epicMiddleware = createEpicMiddleware(appEpics);

const store: Store<{}> = createStore(reducer, applyMiddleware(epicMiddleware));

// Start of a sequence of actions to bootstrap the app with async loaded data.
store.dispatch(startApp());

export default store;
