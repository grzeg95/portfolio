import {Dialog, DialogRef} from '@angular/cdk/dialog';
import {createGlobalPositionStrategy} from '@angular/cdk/overlay';
import {ComponentType} from '@angular/cdk/portal';
import {inject, Injectable, Injector} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BottomSheet {

  private readonly _injector = inject(Injector);
  private readonly _dialog = inject(Dialog);
  private _dialogRef?: DialogRef<any, any>;

  open<T>(component: ComponentType<T>) {

    if (typeof this._dialogRef?.componentRef?.instance.close === 'function') {
      this._dialogRef.componentRef.instance.close();
    } else {
      this._dialogRef?.close();
    }

    this._dialogRef = this._dialog.open(
      component,
      {
        positionStrategy: createGlobalPositionStrategy(this._injector)
          .centerHorizontally()
          .bottom('0'),
        autoFocus: false,
        hasBackdrop: false,
        providers: (dialogRef, config, container) => {
          return [{
            provide: DialogRef,
            useValue: dialogRef
          }];
        }
      }
    );
  }
}
