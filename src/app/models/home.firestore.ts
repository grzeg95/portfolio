import {doc, Firestore, FirestoreDataConverter} from 'firebase/firestore';
import {Collections} from './collections';

export type HomeFirestoreDoc = {}

export type HomeFirestore = {
  readonly id: string;
} & HomeFirestoreDoc;

const converter = {
  toFirestore: () => ({}),
  fromFirestore: (snapshot) => ({
    id: snapshot.id,
    ...snapshot.data()
  })
} as FirestoreDataConverter<HomeFirestore, HomeFirestoreDoc>;

export function getHomeRef(firestore: Firestore) {
  return doc(firestore, Collections.pages, 'home').withConverter(converter);
}
