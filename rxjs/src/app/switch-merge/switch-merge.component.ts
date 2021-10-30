import { map, mergeAll, mergeMap, switchAll, switchMap, debounceTime } from 'rxjs/operators';
import { Observable, fromEvent, of } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Person } from './person.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-switch-merge',
  templateUrl: './switch-merge.component.html',
  styleUrls: ['./switch-merge.component.css']
})
export class SwitchMergeComponent implements OnInit {

  searchInput: string = '';
  people$!: Observable<Person[]>;

  @ViewChild('searchBy', { static: true })
  el!: ElementRef;

  private readonly url: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // this.firstOption();
    // this.secondOption();
    this.thirdOption();
  }

  filterPeople(searchInput: string): Observable<Person[]> {
    if (searchInput.length === 0)
      return of([]);
    return this.http.get<Person[]>(`${this.url}/${searchInput}`);
  }

  thirdOption() {
    let keyup$ = fromEvent(this.el.nativeElement, 'keyup');
    /* this.people$ = keyup$
      .pipe(map((e) => this.filterPeople(this.searchInput)),
        switchAll()); */
    this.people$ = keyup$
      .pipe(
        debounceTime(500),
        switchMap(() => this.filterPeople(this.searchInput)));
  }

  secondOption() {
    let keyup$ = fromEvent(this.el.nativeElement, 'keyup');
    /* let fetch$ = keyup$.pipe(map((e) => this.filterPeople(this.searchInput)));

    this.people$ = fetch$
      .pipe(mergeAll()); */

    this.people$ = keyup$.pipe(mergeMap((e) => this.filterPeople(this.searchInput)));
  }

  firstOption() {
    fromEvent(this.el.nativeElement, 'keyup')
      .pipe()
      .subscribe(e => {
        this.filterPeople(this.searchInput)
          .subscribe(r => console.log(r));
      });
  }

}
