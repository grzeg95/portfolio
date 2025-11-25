import {Component, input, ViewEncapsulation} from '@angular/core';
import {TimelineEvent} from '../../models/timeline-event';
import {Timeline} from '../timeline/timeline';

@Component({
  selector: 'app-work',
  imports: [
    Timeline
  ],
  templateUrl: './work.html',
  styleUrl: './work.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'work'
  }
})
export class Work {

  work = input.required<TimelineEvent[]>();
}
