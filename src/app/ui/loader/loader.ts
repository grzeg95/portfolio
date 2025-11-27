import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {
  AfterContentInit,
  Component,
  contentChild,
  effect,
  inject, input, makeStateKey, OnInit,
  PLATFORM_ID, StateKey,
  TransferState,
  ViewEncapsulation
} from '@angular/core';
import {LoaderDefer} from './loader-defer/loader-defer';
import {LoaderLoading} from './loader-loading/loader-loading';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'loader'
  }
})
export class Loader implements OnInit, AfterContentInit {

  private readonly _transferState = inject(TransferState);
  private _serverState: StateKey<{
    loadingShowed: boolean;
    start: number;
  }> | undefined;

  private readonly _platformId = inject(PLATFORM_ID);

  private _loadingTimeout?: ReturnType<typeof setTimeout>;
  private _minSkeletonTimeout?: ReturnType<typeof setTimeout>;

  private readonly _defer = contentChild(LoaderDefer);
  private readonly _loading = contentChild(LoaderLoading);

  key = input<string>('');

  private _browserStart = -1;

  constructor() {

    effect(() => {

      const when = this._defer()?.when();

      if (when) {

        clearTimeout(this._loadingTimeout);

        if (!this._minSkeletonTimeout) {
          this._defer()?.show();
          this._loading()?.hide();
        }
      }
    });
  }

  ngOnInit(): void {
    this._serverState = makeStateKey<{
      loadingShowed: boolean;
      start: number;
    }>('loader__' + this.key());
  }

  ngAfterContentInit(): void {

    const when = this._defer()?.when();
    const after = this._loading()?.after();

    if (isPlatformServer(this._platformId)) {

      if (!when) {
        if (after) {
          this._transferState.set(this._serverState!, {
            loadingShowed: false,
            start: Date.now()
          });
        } else {
          this._loading()?.show();
          this._transferState.set(this._serverState!, {
            loadingShowed: true,
            start: Date.now()
          });
        }
      } else {
        this._loading()?.hide();
        this._defer()?.show();
      }

      return;
    }

    if (isPlatformBrowser(this._platformId)) {

      if (!when) {

        this._browserStart = Date.now();
        const serverState = this._transferState.get(this._serverState!, {
          loadingShowed: false,
          start: -1
        });
        let elapsed = this._browserStart - serverState.start;

        if (serverState.loadingShowed) {
          this._loading()?.show();
        }

        this._loadingTimeout = setTimeout(() => {

          this._loading()?.show();

          if (this._defer()?.when() === false) {

            this._minSkeletonTimeout = setTimeout(() => {
              this._minSkeletonTimeout = undefined;

              if (this._defer()?.when()) {
                this._defer()?.show();
                this._loading()?.hide();
              }

            }, (this._loading()?.minimum() || 0) - elapsed);
          }
        }, (this._loading()?.after() || 0) - elapsed);
      }

      return;
    }
  }
}
