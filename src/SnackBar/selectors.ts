import {StoreState} from "../types";
import { get } from 'lodash/fp';

export const snackBarSelector = (state: StoreState) => get('snackBar', state);