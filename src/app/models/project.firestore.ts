import {collection, DocumentReference, FirestoreDataConverter, Timestamp} from 'firebase/firestore';
import {Collections} from './collections';
import {ProjectsFirestore, ProjectsFirestoreDoc} from './projects.firestore';

export type ProjectFirestoreDoc = {
  deployedAt: Timestamp;
  description: string;
  images: string[];
  subtitle: string;
  title: string;
  updatedAt: Timestamp;
}

export type ProjectFirestore = {
  readonly id: string;
} & ProjectFirestoreDoc;

const converter = {
  toFirestore: (projectFirestore) => ({
    deployedAt: projectFirestore?.deployedAt,
    description: projectFirestore?.description,
    images: projectFirestore?.images,
    subtitle: projectFirestore?.subtitle,
    title: projectFirestore?.title,
    updatedAt: projectFirestore?.updatedAt
  }),
  fromFirestore: (snapshot) => ({
    id: snapshot.id,
    ...snapshot.data()
  })
} as FirestoreDataConverter<ProjectFirestore, ProjectFirestoreDoc>;

export function getProjectCollectionRef(projectsFirestoreRef: DocumentReference<ProjectsFirestore, ProjectsFirestoreDoc>) {
  return collection(projectsFirestoreRef, Collections.projects).withConverter(converter);
}
