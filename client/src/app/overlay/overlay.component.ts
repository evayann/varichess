import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements AfterViewInit {

  @Input() sidenav!: MatSidenav;
  @Input() user!: string;

  @ViewChild('user') userContainer!: ElementRef; 

  constructor() { }

  ngAfterViewInit() {
    this.userContainer.nativeElement.outerHTML = this.user;
  }
}
