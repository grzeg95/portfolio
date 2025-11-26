import {inject} from '@angular/core';
import {getDoc} from 'firebase/firestore';
import {getHomePageRef} from '../../models/home-page.firestore';
import {Firestore} from '../../tokens/firebase.tokens';

export const homePageResolver = () => {

  const firestore = inject(Firestore);

  const homePageRef = getHomePageRef(firestore);
  return getDoc(homePageRef).then((doc) => doc.data() || {
    skills: [],
    experiences: [],
    education: []
  });
};
