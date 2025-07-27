import type {
  MeetingRecordFormValues,
  MeetingRecordListResponse,
  MeetingRecordQueryParams,
  MeetingRecordResponse,
} from "@/types/meetingRecord";
import { apiClient } from "./apiClient";

export const meetingRecordService = {
  getAllMeetingRecords: async (
    params: MeetingRecordQueryParams
  ): Promise<MeetingRecordListResponse> => {
    const res = await apiClient.get<MeetingRecordListResponse>(
      "/meeting-record",
      {
        params,
      }
    );
    return res.data;
  },

  getMeetingRecordById: async (id: number): Promise<MeetingRecordResponse> => {
    const res = await apiClient.get<MeetingRecordResponse>(
      `/meeting-record/${id}`
    );
    return res.data;
  },

  getMeetingRecordByAppointmentId: async (
    appointmentId: number
  ): Promise<MeetingRecordResponse> => {
    const res = await apiClient.get<MeetingRecordResponse>(
      `/meeting-record/appointment/${appointmentId}`
    );
    return res.data;
  },

  getMeetingRecordByPatientId: async (
    id: number,
    params: MeetingRecordQueryParams
  ): Promise<MeetingRecordListResponse> => {
    const res = await apiClient.get<MeetingRecordListResponse>(
      `/meeting-record/patient/${id}`,
      {
        params,
      }
    );
    return res.data;
  },

  createMeetingRecord: async (
    payload: MeetingRecordFormValues
  ): Promise<MeetingRecordResponse> => {
    const res = await apiClient.post<MeetingRecordResponse>(
      "/meeting-record",
      payload
    );
    return res.data;
  },

  updateMeetingRecord: async (
    id: number,
    payload: MeetingRecordFormValues
  ): Promise<MeetingRecordResponse> => {
    const res = await apiClient.patch<MeetingRecordResponse>(
      `/meeting-record/${id}`,
      payload
    );
    return res.data;
  },

  deleteMeetingRecord: async (id: number): Promise<void> => {
    await apiClient.delete(`/meeting-record/${id}`);
  },
};
