import { createReducer, on } from '@ngrx/store';
import { counterIncrement, counterDecrement, counterReset } from '../actions/counter.actions';

export const counterFeatureKey = 'counter';

export const initialState = 0;

export const reducer = createReducer(
  initialState,
  on(counterIncrement, (state) => state + 1),
  on(counterDecrement, (state) => state - 1),
  on(counterReset, (state) => 0)
);
