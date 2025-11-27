import {isPlatformServer} from '@angular/common';
import {Component, inject, OnInit, PLATFORM_ID, signal, ViewEncapsulation} from '@angular/core';
import {getDoc} from 'firebase/firestore';
import {ExperienceFirestore, getExperienceRef} from '../../models/experience.firestore';
import {getHomeRef} from '../../models/home.firestore';
import {Firestore} from '../../tokens/firebase.tokens';
import {Loader} from '../../ui/loader/loader';
import {LoaderDefer} from '../../ui/loader/loader-defer/loader-defer';
import {LoaderLoading} from '../../ui/loader/loader-loading/loader-loading';
import {Timeline} from '../timeline/timeline';

@Component({
  selector: 'app-experience',
  imports: [
    Timeline,
    Loader,
    LoaderDefer,
    LoaderLoading
  ],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'experience'
  }
})
export class Experience implements OnInit {

  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _firestore = inject(Firestore);

  experienceFirestore = signal<ExperienceFirestore | undefined | null>(undefined);
  experienceFirestoreLoading = signal(true);

  ngOnInit() {

    if (isPlatformServer(this._platformId)) return;

    const homeRef = getHomeRef(this._firestore);
    const experienceRef = getExperienceRef(homeRef);

    getDoc(experienceRef).then((snapshot) => {
      this.experienceFirestore.set(snapshot.data());
    }).finally(() => {
      this.experienceFirestoreLoading.set(false);
    });
  }
}
