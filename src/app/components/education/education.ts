import {Component, input, ViewEncapsulation} from '@angular/core';
import {TimelineEvent} from '../../models/timeline-event';
import {Timeline} from '../timeline/timeline';

@Component({
  selector: 'app-education',
  imports: [
    Timeline
  ],
  templateUrl: './education.html',
  styleUrl: './education.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'education'
  }
})
export class Education {

  education = input.required<TimelineEvent[]>();
}
