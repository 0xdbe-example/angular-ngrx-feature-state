# Angular Ngrx Feature State

This tutorial walks you through creating a feature store in a module for
an Angular application. This tutorial is based on the following
[tutorial](https://ngrx.io/guide/store)

**Note:** Code scaffolding is done via Angular CLI and NgRx Schematics to avoid writing common boilerplate.

## Init app

- Create new app

``` console
$ npx ng new \
    --routing \
    --style scss angular-ngrx-feature-state
```

- Install NgRx Schematics for Angular CLI

``` console
$ ng add @ngrx/schematics

? Would you like to proceed? Yes
? Do you want to use @ngrx/schematics as the default collection? no
```

- Install NgRx dependencies

``` console
$ npm install -S @ngrx/{store,effects,entity,store-devtools}
```

## Root Store

Generate the initial root state management files and register it within the `app.module.ts`:

``` console
$ ng generate @ngrx/schematics:store RootState \
    --root \
    --module app.module.ts
```

This command did the following:

- Create reducers map file

``` typescript
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';

export interface State {

}

export const reducers: ActionReducerMap<State> = {

};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
```

- Import store in `app` module

``` typescript
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Module

- Create counter module

``` console
$ ng generate module \
    --flat false \
    --module app.module.ts \
    feature/counter
```

This command did the following:

- Create module

``` typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CounterModule { }
```

- Import this module in `AppModule`

``` typescript
import { CounterModule } from './feature/counter/counter.module';

@NgModule({
  // ...
  imports: [
    // ...
    CounterModule
  ],
  // ...
})
export class AppModule { }
```

## Feature Store

- Generate an `counter` feature state and register it with the `counter.module.ts`

``` console
$ ng generate @ngrx/schematics:store \
    --module counter.module.ts \
    feature/counter/counter
```

This command did the following:

- Create reducers map file

``` typescript
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
  } from '@ngrx/store';
import { environment } from '../../../../environments/environment';
  
export const counterFeatureKey = 'counter';
  
export interface State {}
  
export const reducers: ActionReducerMap<State> = {};
  
export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];    
```

- Import store in `counter` module

``` typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromCounter from './reducers';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromCounter.counterFeatureKey, fromCounter.reducers, { metaReducers: fromCounter.metaReducers })
  ]
})
export class CounterModule { }
```

## Actions

Generate the actions file:

``` console
$ ng generate @ngrx/schematics:action \
    --group --defaults --creators \
    --prefix counter \
    feature/counter/counter
```

This command create the actions file and replace contents by the
following:

``` typescript
import { createAction } from '@ngrx/store';

export const counterIncrement = createAction('[Counter Component] Increment');
export const counterDecrement = createAction('[Counter Component] Decrement');
export const counterReset = createAction('[Counter Component] Reset');
```

## Reducer

Generate a `Counter` reducer file and then, add it to a defined map of reducers

``` console
$ ng generate @ngrx/schematics:reducer \
    --group --defaults \
    --reducers reducers/index.ts \
    feature/counter/counter
```

This command did the following:

- Create reducer in which to add the following highlight lines:

``` typescript
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
```

- Add reducer in index

``` typescript
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import * as fromCounter from './counter.reducer';

export interface State {
  //[fromCounter.counterFeatureKey]: fromCounter.State;
}

export const reducers: ActionReducerMap<State> = {
  [fromCounter.counterFeatureKey]: fromCounter.reducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
```

Note: line 11 is commented because reducer state is not an interface but
a simple number.

## Selector

Generate `counter` selector:

``` console
$ ng generate @ngrx/schematics:selector \
    --group \
    feature/counter/counter
```

This command did the following:

``` typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { counterFeatureKey } from '../reducers/counter.reducer'

export const getCounterState = createFeatureSelector<{ counter: number }>(counterFeatureKey);

export const getCounter = createSelector(
    getCounterState,
    state => state.counter
)
```

## Component

- Generate a `Counter` component

``` console
$ ng generate component \
    --module feature/counter/counter.module.ts \
    feature/counter/counter 
```

- Complete the component class

``` typescript
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { counterIncrement, counterDecrement, counterReset } from '../actions/counter.actions';
import { getCounter } from '../selectors/counter.selectors'

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {

  count$: Observable<number>

  constructor(
    private store$: Store
  ) {
    this.count$ = this.store$.select(getCounter);
  }

  ngOnInit(): void {
  }

  increment() {
    this.store$.dispatch(counterIncrement());
  }

  decrement() {
    this.store$.dispatch(counterDecrement());
  }

  reset() {
    this.store$.dispatch(counterReset());
  }

}
```

- Edit component template

``` html
<button (click)="increment()">Increment</button>

<div>Current Count: {{ count$ | async }}</div>

<button (click)="decrement()">Decrement</button>

<button (click)="reset()">Reset Counter</button>
```

- Export component

``` html
import { CounterComponent } from './counter/counter.component';

@NgModule({
  // ...
  exports: [
    CounterComponent
  ]
})
export class CounterModule { }
```

- Include counter component in app component

``` html
<app-counter></app-counter>
```

## Run

``` console
$ ng serve
```
