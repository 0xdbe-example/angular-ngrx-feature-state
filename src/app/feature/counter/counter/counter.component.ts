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
