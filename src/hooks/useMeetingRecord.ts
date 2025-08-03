import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  MeetingRecordFormValues,
  MeetingRecordQueryParams,
} from "@/types/meetingRecord";
import { meetingRecordService } from "@/services/meetingRecord";

// Get all meeting records
export const useMeetingRecords = (params: MeetingRecordQueryParams) => {
  return useQuery({
    queryKey: ["meeting-records", params],
    queryFn: () => meetingRecordService.getAllMeetingRecords(params),
    select: (res) => res.data.data,
  });
};

// Get meeting record by ID
export const useMeetingRecord = (id?: number) => {
  return useQuery({
    queryKey: ["meeting-record", id],
    queryFn: () => meetingRecordService.getMeetingRecordById(id!),
    enabled: !!id,
    select: (res) => res.data,
  });
};

// Get meeting record by appointmentId
export const useMeetingRecordByAppointment = (appointmentId?: number) => {
  return useQuery({
    queryKey: ["meeting-records", "appointment", appointmentId],
    queryFn: () =>
      meetingRecordService.getMeetingRecordByAppointmentId(appointmentId!),
    enabled: !!appointmentId,
    select: (res) => res.data,
    refetchOnWindowFocus: true,
  });
};

// Get meeting record by patientId
export const useMeetingRecordByPatient = (
  id: number,
  params: MeetingRecordQueryParams
) => {
  return useQuery({
    queryKey: ["meeting-records", "patient", id, params],
    queryFn: () => meetingRecordService.getMeetingRecordByPatientId(id, params),
    enabled: !!id,
    select: (res) => res.data,
  });
};

// Create a new meeting record
export const useCreateMeetingRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MeetingRecordFormValues) =>
      meetingRecordService.createMeetingRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["meeting-records"],
      });
      queryClient.invalidateQueries({
        queryKey: ["meeting-records", "appointment"],
      });
    },
  });
};

// Update meeting record
export const useUpdateMeetingRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MeetingRecordFormValues }) =>
      meetingRecordService.updateMeetingRecord(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["meeting-records"],
      });
      queryClient.invalidateQueries({
        queryKey: ["meeting-records", "appointment", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["meeting-record", variables.id],
      });
    },
  });
};

// Delete meeting record
export const useDeleteMeetingRecord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => meetingRecordService.deleteMeetingRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meeting-records"] });
    },
  });
};
