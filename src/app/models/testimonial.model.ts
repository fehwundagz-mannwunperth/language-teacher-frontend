export interface Testimonial {
  id: string;
  studentName: string;
  studentRoleOrContext?: string;
  quote: string;
  displayOrder: number;
}

export type TestimonialDraft = Omit<Testimonial, 'id' | 'displayOrder'>;
