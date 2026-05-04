export interface LessonServiceItem {
  id: string;
  label: string;
  title: string;
  summary: string;
  content: string;
  displayOrder?: number;
}

export type LessonServiceDraft = Omit<LessonServiceItem, 'id'>;
