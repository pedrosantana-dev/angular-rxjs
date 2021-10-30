import { takeUntil } from 'rxjs/operators';
import { fromEvent, Observer } from 'rxjs';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.css']
})
export class DragAndDropComponent implements OnInit {

  @ViewChild('myrect', { static: true })
  myrect!: ElementRef;

  top: number = 40;
  left: number = 60;

  constructor() { }

  ngOnInit(): void {
    let mousedown = fromEvent<MouseEvent>(this.myrect.nativeElement, 'mousedown');
    let mousemove = fromEvent<MouseEvent>(document, 'mousemove');
    let mouseup = fromEvent(document, 'mouseup');

    mousedown.subscribe((ed) => {
      // console.log(ed);
      let x = ed.pageX;
      let y = ed.pageY;

      mousemove
      .pipe(
        takeUntil(mouseup)
      )
      .subscribe((em) => {
        // console.log(em);
        let offsetx = x - em.pageX;
        let offsety = y - em.pageY;
        this.top -= offsety;
        this.left -= offsetx;
        x = em.pageX;
        y = em.pageY;
      });
    });
  }

}
