import { takeUntil } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { interval, Subscription, fromEvent, Subject } from 'rxjs';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.css']
})
export class UnsubscribeComponent implements OnInit {

  subscriptionAreActive = false;
  private subscriptions: Subscription[] = [];
  private unsubscribeAll$: Subject<any> = new Subject();
  private intervalSubscription: Subscription | null = null;

  constructor() { }

  ngOnInit(): void {
    this.checkSubscriptions();
  }

  checkSubscriptions() {
    this.intervalSubscription = interval(100).subscribe(() => {
      let active = false;
      this.subscriptions.forEach((s) => {
        if (!s.closed)
          active = true;
      })
      this.subscriptionAreActive = active;
    })
  }

  subscribe() {

    const subscription1 = interval(1000)
      .pipe(
        takeUntil(this.unsubscribeAll$)
      )
      .subscribe(i => console.log(i));
    const subscription2 = fromEvent(document, 'mousemove')
      .pipe(
        takeUntil(this.unsubscribeAll$)
      )
      .subscribe((e) => console.log(e));

    this.subscriptions.push(subscription1, subscription2);
  }

  unsubscribe() {
    this.unsubscribeAll$.next();
  }

  ngOnDestroy() {
    if (this.intervalSubscription != null)
      this.intervalSubscription.unsubscribe();
    this.unsubscribeAll$.next();
  }

}
