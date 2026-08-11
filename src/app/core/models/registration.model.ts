export type BoardType = 'CBSE' | 'ICSE' | 'MP_BOARD' | 'UP_BOARD' | 'RBSE' | 'OTHER';
export type CourseType = 'PCM' | 'PCB' | 'COMMERCE' | 'ARTS' | 'AGRICULTURE' | 'OTHER';

export interface RegistrationRequest {
  seminarId: string;
  fullName: string;
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  schoolName: string;
  board: BoardType;
  course: CourseType;
  state: string;
  city: string;
}

export interface RegistrationResponse {
  id: string;
  seminarId: string;
  seminarTitle: string;
  fullName: string;
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  schoolName: string;
  board: BoardType;
  course: CourseType;
  state: string;
  city: string;
  emailVerified: boolean;
  certificateGenerated: boolean;
  certificateDownloaded: boolean;
  certificateId?: string;
  createdAt: string;
}
