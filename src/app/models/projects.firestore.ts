import {collection, doc, DocumentReference, FirestoreDataConverter} from 'firebase/firestore';
import {Collections} from './collections';
import {HomeFirestore, HomeFirestoreDoc} from './home.firestore';
import {TimelineEvent} from './timeline-event';

export type ProjectsFirestoreDoc = {}

export type ProjectsFirestore = {
  readonly id: string;
} & ProjectsFirestoreDoc;

const converter = {
  toFirestore: (projectsFirestore) => ({}),
  fromFirestore: (snapshot) => ({
    id: snapshot.id,
    ...snapshot.data()
  })
} as FirestoreDataConverter<ProjectsFirestore, ProjectsFirestoreDoc>;

export function getProjectsRef(homeFirestoreRef: DocumentReference<HomeFirestore, HomeFirestoreDoc>) {
  return doc(homeFirestoreRef, Collections.sections, 'projects').withConverter(converter);
}
