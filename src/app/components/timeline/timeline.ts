import {DatePipe} from '@angular/common';
import {Component, input, ViewEncapsulation} from '@angular/core';
import {TimelineEvent} from '../../models/timeline-event';

@Component({
  selector: 'app-timeline',
  imports: [
    DatePipe
  ],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'timeline'
  }
})
export class Timeline {

  timelineEvents = input.required<TimelineEvent[]>();

}
