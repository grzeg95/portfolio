import {doc, DocumentReference, FirestoreDataConverter} from 'firebase/firestore';
import {Collections} from './collections';
import {HomeFirestore, HomeFirestoreDoc} from './home.firestore';

export type Skill = {
  name: string;
  storageRefImage: string;
};

export type SkillsFirestoreDoc = {
  skills: Skill[]
}

export type SkillsFirestore = {
  readonly id: string;
} & SkillsFirestoreDoc;

const converter = {
  toFirestore: (skillsFirestore, options) => ({
    skills: skillsFirestore?.skills
  }),
  fromFirestore: (snapshot) => ({
    id: snapshot.id,
    ...snapshot.data()
  })
} as FirestoreDataConverter<SkillsFirestore, SkillsFirestoreDoc>;

export function getSkillsRef(homeFirestoreRef: DocumentReference<HomeFirestore, HomeFirestoreDoc>) {
  return doc(homeFirestoreRef, Collections.sections, 'skills').withConverter(converter);
}
