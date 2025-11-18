
export enum Tier {
  FREE = 'Free',
  PRO = 'Pro',
  EXCLUSIVE = 'Exclusive',
}

export interface CandidateProfile {
  id: string;
  name: string;
  role: string;
  location: string;
  aboutMe: string;
  experienceSummary: string;
  skills: string[];
  cvFile?: File;
  hasCvFile?: boolean;
  tier: Tier;
}

export interface User {
  id: string;
  email: string;
  profileId: string;
}

export interface RecruiterContact {
  recruiterName: string;
  company: string;
  email: string;
  message: string;
  candidateId: string;
}