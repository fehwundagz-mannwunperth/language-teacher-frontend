export type PrivacyPolicySectionKey =
  | 'dataController'
  | 'processedData'
  | 'purposeOfProcessing'
  | 'legalBasis'
  | 'dataRetention'
  | 'dataSubjectRights'
  | 'contactForPrivacyRequests';

export interface PrivacyPolicySection {
  key: PrivacyPolicySectionKey;
  order: number;
  content: string;
}

export interface PrivacyPolicy {
  sections: PrivacyPolicySection[];
}
