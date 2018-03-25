import {Component, OnInit} from '@angular/core';
import {fromPromise} from "rxjs/observable/fromPromise";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {merge} from "rxjs/observable/merge";
import {share, shareReplay, tap} from "rxjs/operators";

@Component({
    selector: 'app-root',
    template: `
        <!--The content below is only a placeholder and can be replaced.-->
        <div style="text-align:center">
            <img width="300" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg==">
        </div>

        <button (click)="publishNewDataIntoCallback()">Publish Now !</button>

        <pre><code>
            {{ result }}
        </code></pre>
        <pre><code>
            {{ secondR }}
        </code></pre>

    `,
    styles: []
})
export class AppComponent implements OnInit {
    fakeCallbackValue = new Subject<number>();
    result: number;
    secondR: number = 0;

    ngOnInit(): void {
        const init = fromPromise(Promise.resolve(Date.now())).pipe(logInto('promise'));
        const fromCallback = Observable.create((obs) => this.fakeCallbackValue.subscribe(obs))
            .pipe((logInto('fromCallback')));

        const full = merge(init, fromCallback)
            .pipe(logInto('before share'), shareReplay());

        full.subscribe(v => this.result = v);

        setTimeout(() => full.subscribe(v => this.secondR = v), 4000);
    }

    publishNewDataIntoCallback() {
        this.fakeCallbackValue.next(Date.now());
    }
}

function logInto(message: string) {
  return tap(
      v => console.log(`log into next of ${message}`, v),
      () => console.log(`log into error of ${message}`),
      () => console.log(`log into complete of ${message}`)
  )
}
