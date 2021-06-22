import * as fromCounter from './counter.actions';

describe('counterCounters', () => {
  it('should return an action', () => {
    expect(fromCounter.counterCounters().type).toBe('[Counter] Counter Counters');
  });
});
