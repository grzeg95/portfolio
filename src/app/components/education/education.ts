import {isPlatformServer} from '@angular/common';
import {Component, inject, OnInit, PLATFORM_ID, signal, ViewEncapsulation} from '@angular/core';
import {getDoc} from 'firebase/firestore';
import {EducationFirestore, getEducationRef} from '../../models/education.firestore';
import {getHomeRef} from '../../models/home.firestore';
import {Firestore} from '../../tokens/firebase.tokens';
import {Loader} from '../../ui/loader/loader';
import {LoaderDefer} from '../../ui/loader/loader-defer/loader-defer';
import {LoaderLoading} from '../../ui/loader/loader-loading/loader-loading';
import {Timeline} from '../timeline/timeline';

@Component({
  selector: 'app-education',
  imports: [
    Timeline,
    Loader,
    LoaderDefer,
    LoaderLoading
  ],
  templateUrl: './education.html',
  styleUrl: './education.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'education'
  }
})
export class Education implements OnInit {

  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _firestore = inject(Firestore);

  educationFirestore = signal<EducationFirestore | undefined | null>(undefined);
  educationFirestoreLoading = signal(true);

  ngOnInit() {

    if (isPlatformServer(this._platformId)) return;

    const homeRef = getHomeRef(this._firestore);
    const educationRef = getEducationRef(homeRef);

    getDoc(educationRef).then((snapshot) => {
      this.educationFirestore.set(snapshot.data());
    }).finally(() => {
      this.educationFirestoreLoading.set(false);
    });
  }
}
