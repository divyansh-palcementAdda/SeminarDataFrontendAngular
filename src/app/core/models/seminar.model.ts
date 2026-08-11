export interface Seminar {
  id: string;
  title: string;
  slug: string;
  description: string;
  bannerImage?: string;
  certificateTemplate?: string;
  seminarDate?: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  venue?: string;
  organizer?: string;
  maximumRegistrations?: number;
  registrationEnabled: boolean;
  certificateEnabled: boolean;
  emailEnabled: boolean;
  status: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
