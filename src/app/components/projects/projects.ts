import {isPlatformServer} from '@angular/common';
import {Component, inject, OnInit, PLATFORM_ID, signal, ViewEncapsulation} from '@angular/core';
import {DocumentReference, getDocs, limit, orderBy, query, endBefore, startAfter, documentId, QueryDocumentSnapshot} from 'firebase/firestore';
import {getHomeRef} from '../../models/home.firestore';
import {getProjectCollectionRef, ProjectFirestore, ProjectFirestoreDoc} from '../../models/project.firestore';
import {getProjectsRef} from '../../models/projects.firestore';
import {Firestore} from '../../tokens/firebase.tokens';
import {Button} from '../../ui/button/button';
import {Loader} from '../../ui/loader/loader';
import {LoaderDefer} from '../../ui/loader/loader-defer/loader-defer';
import {LoaderLoading} from '../../ui/loader/loader-loading/loader-loading';
import {Project} from '../project/project';

@Component({
  selector: 'app-projects',
  imports: [
    Loader,
    LoaderDefer,
    LoaderLoading,
    Project,
    Button
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'projects'
  }
})
export class Projects implements OnInit {

  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _firestore = inject(Firestore);

  protected readonly _projectFirestoreList = signal<ProjectFirestore[] | undefined | null>(undefined);
  protected readonly _projectsFirestoreFirstLoading = signal(true);
  private _lastDocRef: QueryDocumentSnapshot<ProjectFirestore, ProjectFirestoreDoc> | undefined;
  protected readonly _isPossibilityToShowNextPage = signal(false);
  protected readonly _isLoadingMore = signal(false);

  ngOnInit() {

    if (isPlatformServer(this._platformId)) return;

    const homeRef = getHomeRef(this._firestore);
    const projectsRef = getProjectsRef(homeRef);
    const limitOfProjects = 1;

    const q = query(
      getProjectCollectionRef(projectsRef),
      orderBy('updatedAt', 'desc'),
      orderBy(documentId(), 'desc'),
      limit(limitOfProjects)
    );

    getDocs(q).then((snapshot) => {

      this._projectFirestoreList.set(snapshot.docs.map((doc) => doc.data()));

      if (snapshot.docs.length > 0) {
        this._lastDocRef = snapshot.docs[snapshot.docs.length - 1];
      }

      this._isPossibilityToShowNextPage.set(snapshot.docs.length === limitOfProjects);
    }).finally(() => {
      this._projectsFirestoreFirstLoading.set(false);
    });
  }

  protected _checkForMore() {

    if (this._isLoadingMore() || !this._lastDocRef) {
      return;
    }

    this._isLoadingMore.set(true);

    const homeRef = getHomeRef(this._firestore);
    const projectsRef = getProjectsRef(homeRef);
    const limitOfProjects = 1;

    const q = query(
      getProjectCollectionRef(projectsRef),
      orderBy('updatedAt', 'desc'),
      orderBy(documentId(), 'desc'),
      startAfter(this._lastDocRef),
      limit(limitOfProjects)
    );

    getDocs(q).then((snapshot) => {

      this._projectFirestoreList.update((prev) => (prev || []).concat(snapshot.docs.map((doc) => doc.data())));

      if (snapshot.docs.length > 0) {
        this._lastDocRef = snapshot.docs[snapshot.docs.length - 1];
      }

      this._isPossibilityToShowNextPage.set(snapshot.docs.length === limitOfProjects);
    }).finally(() => {
      this._isLoadingMore.set(false);
    });
  }
}
