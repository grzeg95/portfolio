import {doc, Firestore, FirestoreDataConverter } from 'firebase/firestore';
import {Collections} from './collections';
import {Skill} from './skill';

export type HomePageFirestoreDoc = {
  skills: Skill[];
}

export type HomePageFirestore = {
  readonly id: string;
} & HomePageFirestoreDoc;

const converter = {
  toFirestore: (homePage) => ({
    skills: homePage?.skills
  }),
  fromFirestore: (snapshot) => ({
    id: snapshot.id,
    ...snapshot.data()
  })
} as FirestoreDataConverter<HomePageFirestore, HomePageFirestoreDoc>;

export function getHomePageRef(firestore: Firestore) {
  return doc(firestore, Collections.pages, 'homePage').withConverter(converter);
}
