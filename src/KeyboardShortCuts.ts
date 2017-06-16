import React, {ReactElement} from 'react';
import { connect } from 'react-redux';
import { saveTranslationsShortcut } from './actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/do';
import {Subscription} from "rxjs/Subscription";
import {bindActionCreators, Dispatch} from "redux";
import {AppAction} from "./types";

const ctrlOrCmdSave$ = Observable.fromEvent(window, 'keydown').filter(isSaveCombination);

function isSaveCombination(event: KeyboardEvent): boolean {
    if (!event) {
        return false;
    }

    return event.key === 's' && (event.metaKey || event.ctrlKey)
}

type KeyboardShortCutsProps = { saveTranslationsShortcut: (event: KeyboardEvent) => void };

class KeyboardShortCuts extends React.Component<KeyboardShortCutsProps, {}> {
    subscriptions: Set<Subscription>;

    constructor(props: KeyboardShortCutsProps, context: any) {
        super(props, context);

        this.subscriptions = new Set();
    }

    componentDidMount() {
        this.subscriptions.add(
            ctrlOrCmdSave$
                .do((event: Event) => event.preventDefault())
                .subscribe(this.props.saveTranslationsShortcut)
        );
    }

    componentWillUnmount() {
        Array.from(this.subscriptions)
            .forEach(subscription => subscription.unsubscribe());
    }

    shouldComponentUpdate() {
        return false;
    }

    render(): ReactElement<{}> {
        return null;
    }
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => bindActionCreators({
    saveTranslationsShortcut,
}, dispatch);

export default connect<any, any, any>(undefined, mapDispatchToProps)(KeyboardShortCuts);