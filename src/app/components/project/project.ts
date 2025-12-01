import {Component, CUSTOM_ELEMENTS_SCHEMA, input, ViewEncapsulation} from '@angular/core';
import {FirebaseStorageSrc} from '../../directives/firebase-storage-src';
import {ProjectFirestore} from '../../models/project.firestore';
import {FlipperSlide} from '../flipper-slide/flipper-slide';
import {Flipper} from '../flipper/flipper';

@Component({
  selector: 'app-project',
  imports: [
    FirebaseStorageSrc,
    Flipper,
    FlipperSlide
  ],
  templateUrl: './project.html',
  styleUrl: './project.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'project'
  },
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Project {

  project = input.required<ProjectFirestore>();

}
