import {Component, input, ViewEncapsulation} from '@angular/core';
import {TimelineEvent} from '../../models/timeline-event';
import {Timeline} from '../timeline/timeline';

@Component({
  selector: 'app-experience',
  imports: [
    Timeline
  ],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'experience'
  }
})
export class Experience {

  experience = input.required<TimelineEvent[]>();
}
