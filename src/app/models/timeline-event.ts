import { Timestamp } from 'firebase/firestore';

export type TimelineEvent = {
  start: Timestamp;
  end: Timestamp | false;
  title: string;
  subtitle?: string;
  description: string[];
}
