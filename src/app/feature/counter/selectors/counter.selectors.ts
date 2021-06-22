import { createFeatureSelector, createSelector } from '@ngrx/store';
import { counterFeatureKey } from '../reducers/counter.reducer'

export const getCounterState = createFeatureSelector<{ counter: number }>(counterFeatureKey);

export const getCounter = createSelector(
    getCounterState,
    state => state.counter
)