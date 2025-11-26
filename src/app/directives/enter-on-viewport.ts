import {isPlatformServer} from '@angular/common';
import {AfterViewInit, Directive, ElementRef, inject, input, OnInit, PLATFORM_ID} from '@angular/core';

@Directive({
  selector: '[appEnterOnViewport]',
})
export class EnterOnViewport implements OnInit, AfterViewInit {

  private readonly _elementRef = inject(ElementRef);
  private readonly _platformId = inject(PLATFORM_ID);

  startClass = input<string>('');
  finishClass = input<string>('');

  rootMargin = input<string>('0px 0px');

  ngOnInit() {
    this._elementRef.nativeElement.classList.add(this.startClass());
  }

  ngAfterViewInit() {

    if (isPlatformServer(this._platformId)) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add(this.finishClass());
            io.unobserve(entry.target);
          }
        }
      },
      {
        rootMargin: this.rootMargin()
      }
    );

    io.observe(this._elementRef.nativeElement);

    this._elementRef.nativeElement.addEventListener('transitionend', () => {
      this._elementRef.nativeElement.classList.remove(this.startClass());
      this._elementRef.nativeElement.classList.remove(this.finishClass());
    });
  }
}
