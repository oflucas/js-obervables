import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private http: Http) {}

  ngOnInit(): void {
    // this.testPromise();
    // this.testObservable();
    // this.testSubjectBroadcast();
    //this.testObservableBroadcast();
    this.testUIEventObservable();
    //this.testObservableFromArray();
    //this.testObservableFromHttp();
    this.testObservableOperators();
  }

  testPromise() {
    // reject can be neglected
    let promise = new Promise(resolve => {
      console.log('promise execution');
      setTimeout(() => {
        resolve('promise resolved');
      }, 1000);
    });
    promise.then(value => console.log(value));
  }

  testObservable() {
    // obervable, put $ is common sense to mark observable
    // observers observe an observable,
    // subscribe for events/datastream happen in the observable.
    let stream$ = new Observable(
      // this function becomes a member, i.e., subscribe()
      function subscribe(observer) {
        console.log('observable execution');
        observer.next(1);
        let timeout = setTimeout(() => {
          observer.next('observer next value');
          observer.complete();
        }, 1000);
        observer.next(2);

        return function unsubstribe() {
          // the returned becomes a member unsubstribe() of subscription
          // here we usually define how to disposes recources
          // that this obervable is taking
          clearTimeout(timeout);
        }
      }
    );

    // observer waits for event,
    // and prepare functions to process different kind of events
    let observer = {
      next: value => console.log(value),
      error: err => console.log(err),
      complete: () => console.log('completed')
    }

    // observer listens the stream$'s event
    let subscription = stream$.subscribe(observer);

    // subscription is describing a relationship,
    // you can do somthing to it, e.g., cancel it
    setTimeout(() => {
      subscription.unsubscribe();
    }, 500);
  }

  testSubjectBroadcast() {
    let subject = new Subject();
    subject.subscribe(value => console.log('sub_observerA: ' + value));
    subject.subscribe(value => console.log('sub_observerB: ' + value));
    subject.next(1);
    subject.next(2);
    subject.subscribe(value => console.log('sub_observerC: ' + value));
    subject.next(3);
  }

  testObservableBroadcast() {
    let observable = new Observable(observer => {
      observer.next(1);
      observer.next(2);
      setTimeout(() => {
        observer.next(3);
        observer.next(4);
      }, 1000);
    });

    // for each action subscribe, the subscribe() run a fresh new one.
    observable.subscribe(value => console.log('obv_observerA: ' + value));
    setTimeout(() => {
      observable.subscribe(value => console.log('obv_observerB: ' + value));
    }, 5000);
  }

  testUIEventObservable() {
    const btn = document.querySelector('#btn');
    const btnStream$ = Observable.fromEvent(btn, 'click');

    btnStream$.subscribe(
      // must use :any here to allow use the object's any property
      (e: any) => console.log(e.target.innerHTML),
      err => console.log(err),
      () => console.log('complete')
    );


    const input = document.querySelector('#input');
    const inputStream$ = Observable.fromEvent(input, 'keydown');

    inputStream$.subscribe(
      // must use :any here to allow use the object's any property
      (e: any) => console.log(e.target.value),
      err => console.log(err),
      () => console.log('complete')
    );
  }

  testObservableFromArray() {
    const nums = [3,4,7,9,12];
    const nums$ = Observable.from(nums);
    nums$.subscribe(
      v => console.log(v),
      err => console.log(err),
      () => console.log('complete')
    );
  }

  testObservableFromHttp() {
    this.getUser('oflucas')
      .subscribe(
        (res: Response) => console.log(res.json())
      );
  }

  getUser(username) {
    return this.http.get('https://api.github.com/users/' + username);
  }

  testObservableOperators() {
    // generate a number every 1s, in total generate 5 numbers
    //const source$ = Observable.interval(1000).take(5);

    // after 5s, generate a number every 1s, in total generate 5 numbers
    //const source$ = Observable.timer(5000, 1000).take(5);

    // gen. [25~35)
    //const source$ = Observable.range(25, 10);

    // map can process your observable and output a new observable
    const source$ = Observable.from(['Adam', 'Bill'])
                      .map(v => v.toUpperCase());

    source$.subscribe(
      v => console.log(v),
      err => console.error(err),
      () => console.log('complete')
    );
  }
}
