import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromCounter from './reducers';
import { CounterComponent } from './counter/counter.component';



@NgModule({
  declarations: [
    CounterComponent
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromCounter.counterFeatureKey, fromCounter.reducers, { metaReducers: fromCounter.metaReducers })
  ],
  exports: [
    CounterComponent
  ]
})
export class CounterModule { }
