import {isPlatformServer} from '@angular/common';
import {Component, inject, OnInit, PLATFORM_ID, signal, ViewEncapsulation} from '@angular/core';
import {getDoc} from 'firebase/firestore';
import {FirebaseStorageSrc} from '../../directives/firebase-storage-src';
import {getHomeRef} from '../../models/home.firestore';
import {getSkillsRef, SkillsFirestore} from '../../models/skill.firestore';
import {Firestore} from '../../tokens/firebase.tokens';
import {Loader} from '../../ui/loader/loader';
import {LoaderDefer} from '../../ui/loader/loader-defer/loader-defer';
import {LoaderLoading} from '../../ui/loader/loader-loading/loader-loading';

@Component({
  selector: 'app-skills',
  imports: [
    FirebaseStorageSrc,
    Loader,
    LoaderDefer,
    LoaderLoading
  ],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'skills'
  }
})
export class Skills implements OnInit {

  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _firestore = inject(Firestore);

  skillsFirestore = signal<SkillsFirestore | undefined | null>(undefined);
  skillsFirestoreLoading = signal(true);

  ngOnInit() {

    if (isPlatformServer(this._platformId)) return;

    const homeRef = getHomeRef(this._firestore);
    const skillsRef = getSkillsRef(homeRef);

    getDoc(skillsRef).then((snapshot) => {
      this.skillsFirestore.set(snapshot.data());
    }).finally(() => {
      this.skillsFirestoreLoading.set(false);
    });
  }
}
