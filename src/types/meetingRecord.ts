interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
}

interface Appointment {
  id: number;
  service: {
    id: number;
    name: string;
    description: string;
    type: string;
    price: number;
    startTime: string;
    endTime: string;
    content: string | null;
  };
  user: User;
  doctor: {
    specialization: string;
    user: User;
  };
  type: string;
  notes: string | null;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface MeetingRecordFormValues {
  appointmentId: number;
  title: string;
  content: string;
  startTime: string;
  endTime: string;
  recordedById: number;
}

export interface MeetingRecord {
  id: number;
  appointmentId: number;
  title: string;
  content: string;
  startTime: string;
  endTime: string;
  recordedById: number;
  createdAt: string;
  updatedAt: string;
  recordedBy: User;
  appointment: Appointment;
}

export interface MeetingRecordListResponse {
  data: {
    data: MeetingRecord[];
    meta: Meta;
  };
  statusCode: number;
  message: string;
}

export interface MeetingRecordResponse {
  data: MeetingRecord;
  statusCode: number;
  message: string;
}

export interface MeetingRecordQueryParams {
  page?: number;
  limit?: number;
  search: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  recordedById?: number;
}
