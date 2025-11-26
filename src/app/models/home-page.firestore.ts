import {doc, Firestore, FirestoreDataConverter } from 'firebase/firestore';
import {Collections} from './collections';
import {Skill} from './skill';
import {TimelineEvent} from './timeline-event';

export type HomePageFirestoreDoc = {
  skills: Skill[];
  experience: TimelineEvent[];
  education: TimelineEvent[];
}

export type HomePageFirestore = {
  readonly id: string;
} & HomePageFirestoreDoc;

const converter = {
  toFirestore: (homePage) => ({
    skills: homePage?.skills,
    experience: homePage?.experience,
    education: homePage?.education
  }),
  fromFirestore: (snapshot) => ({
    id: snapshot.id,
    ...snapshot.data()
  })
} as FirestoreDataConverter<HomePageFirestore, HomePageFirestoreDoc>;

export function getHomePageRef(firestore: Firestore) {
  return doc(firestore, Collections.pages, 'homePage').withConverter(converter);
}
