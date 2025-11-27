import {doc, DocumentReference, FirestoreDataConverter} from 'firebase/firestore';
import {Collections} from './collections';
import {HomeFirestore, HomeFirestoreDoc} from './home.firestore';
import {TimelineEvent} from './timeline-event';

export type ExperienceFirestoreDoc = {
  timelineEvents: TimelineEvent[];
}

export type ExperienceFirestore = {
  readonly id: string;
} & ExperienceFirestoreDoc;

const converter = {
  toFirestore: (experienceFirestore) => ({
    timelineEvents: experienceFirestore?.timelineEvents
  }),
  fromFirestore: (snapshot) => ({
    id: snapshot.id,
    ...snapshot.data()
  })
} as FirestoreDataConverter<ExperienceFirestore, ExperienceFirestoreDoc>;

export function getExperienceRef(homeFirestoreRef: DocumentReference<HomeFirestore, HomeFirestoreDoc>) {
  return doc(homeFirestoreRef, Collections.sections, 'experience').withConverter(converter);
}
