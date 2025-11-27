import {doc, DocumentReference, FirestoreDataConverter} from 'firebase/firestore';
import {Collections} from './collections';
import {HomeFirestore, HomeFirestoreDoc} from './home.firestore';
import {TimelineEvent} from './timeline-event';

export type EducationFirestoreDoc = {
  timelineEvents: TimelineEvent[];
}

export type EducationFirestore = {
  readonly id: string;
} & EducationFirestoreDoc;

const converter = {
  toFirestore: (educationFirestore) => ({
    timelineEvents: educationFirestore?.timelineEvents
  }),
  fromFirestore: (snapshot) => ({
    id: snapshot.id,
    ...snapshot.data()
  })
} as FirestoreDataConverter<EducationFirestore, EducationFirestoreDoc>;

export function getEducationRef(homeFirestoreRef: DocumentReference<HomeFirestore, HomeFirestoreDoc>) {
  return doc(homeFirestoreRef, Collections.sections, 'education').withConverter(converter);
}
