import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[boardContent]'
})
export class BoardDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
