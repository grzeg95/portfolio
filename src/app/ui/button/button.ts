import {Component, input} from '@angular/core';

type Appearance = 'primary' | 'stroked' | 'danger';
type Disabled = 'true' | 'false' | '' | boolean | undefined;

@Component({
  selector: 'app-button',
  imports: [],
  template: '<ng-content/>',
  styleUrl: './button.scss',
  host: {
    'class': 'app-button',
    '[class.primary]': 'appearance() === "primary"',
    '[class.stroked]': 'appearance() === "stroked"',
    '[class.danger]': 'appearance() === "danger"',
    '[class.disabled]': 'disabled() !== false && disabled() !== "false"',
    '[attr.tabindex]': 'disabled() === false || disabled() === "false" ? 0 : -1'
  }
})
export class Button {

  appearance = input<Appearance>('primary');
  disabled = input<Disabled>(false);
}
