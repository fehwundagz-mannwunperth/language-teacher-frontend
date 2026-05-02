export type LegalTermsSectionKey =
  | 'contractFormation'
  | 'serviceDescription'
  | 'paymentTerms'
  | 'cancellationPolicy'
  | 'complaintHandling'
  | 'copyrightNotice'
  | 'cookieInformation';

export interface LegalTermsSection {
  key: LegalTermsSectionKey;
  order: number;
  content: string;
}

export interface LegalTerms {
  sections: LegalTermsSection[];
}
