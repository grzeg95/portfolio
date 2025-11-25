import {Component, input, ViewEncapsulation} from '@angular/core';
import {FirebaseStorageSrc} from '../../directives/firebase-storage-src';
import {Skill} from '../../models/skill';

@Component({
  selector: 'app-skills',
  imports: [
    FirebaseStorageSrc
  ],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'skills'
  }
})
export class Skills {

  skills = input<Skill[] | undefined>(undefined);
}
