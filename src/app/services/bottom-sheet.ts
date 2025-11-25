import {Dialog, DialogConfig, DialogRef} from '@angular/cdk/dialog';
import {createGlobalPositionStrategy, Overlay} from '@angular/cdk/overlay';
import {BasePortalOutlet, ComponentType} from '@angular/cdk/portal';
import {inject, Injectable, Injector} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BottomSheet {

  private readonly _injector = inject(Injector);
  private readonly _dialog = inject(Dialog);
  private readonly _overlay = inject(Overlay);
  private _dialogRef?: DialogRef<any, any>;

  open<T>(
    component: ComponentType<T>,
    config?: DialogConfig<unknown, DialogRef<any, T>, BasePortalOutlet> | undefined,
    blockScroll?: boolean
  ) {

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
        autoFocus: '__non_existing_element__',
        restoreFocus: false,
        hasBackdrop: false,
        scrollStrategy: blockScroll ? this._overlay.scrollStrategies.block() : this._overlay.scrollStrategies.noop(),
        ...config
      }
    );
  }
}
