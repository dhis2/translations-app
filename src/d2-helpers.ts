import { getInstance } from 'd2/lib/d2';
import { Observable } from 'rxjs';

export const d2$ = Observable.fromPromise(getInstance());

export const api$ = d2$.map(d2 => d2.Api.getApi());

export const dbLocales$ = api$.mergeMap(api => Observable.fromPromise(api.get('locales/db')));

export const currentUserDbLocale$ = d2$.map(d2 => d2.currentUser.userSettings.keyDbLocale);

export const models$ = d2$.map((d2) => d2.models);
