import {
  AfterContentInit,
  Component,
  contentChildren,
  ElementRef,
  inject,
  input,
  Renderer2,
  viewChild,
  QueryList
} from '@angular/core';
import { FlipperSlide } from '../flipper-slide/flipper-slide';

@Component({
  selector: 'app-flipper',
  templateUrl: './flipper.html',
  styleUrls: ['./flipper.scss'],
  host: {
    'class': 'flipper',
    '(window:resize)': '_updateSize()',
    '(document:mouseup)': '_onRelease($event)',
    '(document:touchend)': '_onRelease($event)',
    '(document:mousemove)': '_onDrag($event)'
  }
})
export class Flipper implements AfterContentInit {

  infinite = input(false);
  slidesPerView = input(1);
  spaceBetween = input(0);

  private readonly _elRef = inject(ElementRef<HTMLElement>);
  private readonly _renderer = inject(Renderer2);

  slides = contentChildren(FlipperSlide);
  wrapper = viewChild<ElementRef<HTMLElement>>('wrapper');
  track = viewChild<ElementRef<HTMLElement>>('track');

  private _allSlides: HTMLElement[] = [];
  private _isDragging = false;
  private _startTranslateX = 0;
  private _translateX = 0;
  private _touchStartX = 0;
  private _lastX = 0;
  private _startTime = 0;

  ngAfterContentInit() {
    this._patchTouches();
    this._updateSize();

    // Inicjalizacja _allSlides
    this._allSlides = this.slides().map(s => s.elRef.nativeElement);

    // Dla infinite loop przesuwamy początkowo translateX
    if (this.infinite() && this._allSlides.length) {
      const offset = this._slideWidth() * this.slidesPerView();
      this._translateX = -offset;
      this.track()!.nativeElement.style.transform = `translateX(${this._translateX}px)`;
    }
  }

  private _patchTouches() {
    const trackEl = this.track()?.nativeElement;
    if (!trackEl) return;
    trackEl.addEventListener('touchstart', e => this._onDragStart(e), { passive: false });
    trackEl.addEventListener('touchmove', e => this._onDrag(e), { passive: false });
  }

  protected _updateSize() {
    const wrapperWidth = this.wrapper()?.nativeElement.offsetWidth || 0;
    const slideWidth = (wrapperWidth - (this.slidesPerView() - 1) * this.spaceBetween()) / this.slidesPerView();

    this.slides().forEach(slide => {
      this._renderer.setStyle(slide.elRef.nativeElement, 'width', `${slideWidth}px`);
      this._renderer.setStyle(slide.elRef.nativeElement, 'margin-right', `${this.spaceBetween}px`);
    });

    if (this.infinite() && this._allSlides.length) {
      const offset = slideWidth * this.slidesPerView();
      this._translateX = -offset;
      this.track()!.nativeElement.style.transform = `translateX(${this._translateX}px)`;
    }
  }

  private _slideWidth(): number {
    return this._allSlides[0].offsetWidth + this.spaceBetween();
  }

  protected _onDragStart(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this._isDragging = true;
    this._startTranslateX = this._translateX;
    this._startTime = Date.now();
    this._touchStartX = event instanceof TouchEvent ? event.touches[0].pageX : event.pageX;
    this._lastX = this._touchStartX;
  }

  protected _onDrag(event: MouseEvent | TouchEvent) {
    if (!this._isDragging) return;
    const currentX = event instanceof TouchEvent ? event.touches[0].pageX : event.pageX;
    const delta = currentX - this._touchStartX;
    this._translateX = this._startTranslateX + delta;
    this._lastX = currentX;
    this.track()!.nativeElement.style.transform = `translateX(${this._translateX}px)`;
  }

  protected _onRelease(event: MouseEvent | TouchEvent) {
    if (!this._isDragging) return;
    this._isDragging = false;

    const deltaX = this._lastX - this._touchStartX;
    const duration = Date.now() - this._startTime;
    const slideWidth = this._slideWidth();

    let movedSlides = Math.round(-deltaX / slideWidth);

    // Flick detection
    const minDistance = 20;
    const maxTime = 180;
    if (Math.abs(deltaX) > minDistance && duration < maxTime) {
      movedSlides += deltaX < 0 ? 1 : -1;
    }

    this._translateX += movedSlides * slideWidth;

    const trackEl = this.track()?.nativeElement;
    if (!trackEl) return;

    trackEl.style.transition = 'transform 250ms ease-out';
    trackEl.style.transform = `translateX(${this._translateX}px)`;

    // Infinite loop: reorder slides w tablicy
    const resetHandler = () => {
      trackEl.removeEventListener('transitionend', resetHandler);

      if (!this.infinite()) return;

      const buffer = this.slidesPerView();
      const realCount = this.slides().length;
      let index = Math.round(-this._translateX / slideWidth);

      // Wjechaliśmy w lewy koniec
      while (index < buffer) {
        const lastSlide = this._allSlides.pop()!;
        this._allSlides.unshift(lastSlide);
        this._translateX += slideWidth;
        index++;
      }

      // Wjechaliśmy w prawy koniec
      while (index >= realCount + buffer) {
        const firstSlide = this._allSlides.shift()!;
        this._allSlides.push(firstSlide);
        this._translateX -= slideWidth;
        index--;
      }

      // Reset bez animacji
      trackEl.style.transition = '';
      trackEl.style.transform = `translateX(${this._translateX}px)`;
    };

    trackEl.addEventListener('transitionend', resetHandler);
  }
}
