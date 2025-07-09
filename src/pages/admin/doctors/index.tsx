"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Calendar,
  RefreshCw,
  Users,
  Table,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { DataTable } from "@/components/ui/data-table";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

import {
  useDoctors,
  useCreateDoctor,
  useUpdateDoctor,
  useDeleteDoctor,
  useGenerateSchedule,
  useSwapShifts,
  useWeeklySchedule,
  useAssignDoctorsManually,
} from "@/hooks/useDoctors";
import { useDoctorStore } from "@/store/doctorStore";
import type {
  Doctor,
  DoctorFormValues,
  UpdateDoctorFormValues,
} from "@/types/doctor";
import { DoctorFormModal } from "./components/DoctorFormModal";
import { WeeklyTimetable } from "./components/WeeklyTimetable";

import { SwapShiftsModal } from "./components/SwapShiftsModal";
import { DoctorDetailsDrawer } from "./components/DoctorDetailsDrawer";
import { GenerateScheduleModal } from "./components/GenerateScheduleModal";
import { getColumns } from "./columns";
import { handleApiError } from "@/lib/utils/errorHandler";

export default function DoctorManagement() {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [activeTab, setActiveTab] = useState("list");
  const [currentWeek, setCurrentWeek] = useState(() => {
    const now = new Date();
    return {
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 }),
    };
  });

  const { data: doctorsData, isLoading } = useDoctors({
    page: currentPage,
    limit: pageSize,
    search: searchText,
  });

  const doctors = doctorsData?.data || [];
  const meta = doctorsData?.meta;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 0;

  // Debug logs
  console.log('doctorsData:', doctorsData);
  console.log('doctors array:', doctors);
  console.log('doctors length:', doctors.length);
  console.log('meta:', meta);
  console.log('pageSize:', pageSize);
  console.log('currentPage:', currentPage);

  

  const { data: weeklyData, isLoading: isWeeklyLoading } = useWeeklySchedule({
    startDate: format(currentWeek.start, "yyyy-MM-dd"),
    endDate: format(currentWeek.end, "yyyy-MM-dd"),
  });
  const { mutate: createDoctor, isPending: isCreating } = useCreateDoctor();
  const { mutate: updateDoctor, isPending: isUpdating } = useUpdateDoctor();
  const { mutate: deleteDoctor } = useDeleteDoctor();
  const { mutate: generateSchedule, isPending: isGenerating } =
    useGenerateSchedule();
  const { mutate: swapShifts, isPending: isSwapping } = useSwapShifts();
  const { mutate: assignDoctorsManually, isPending: isManualAssigning } =
    useAssignDoctorsManually();

  const {
    selectedDoctor,
    isDrawerOpen,
    isModalOpen,
    editingDoctor,
    isGenerateScheduleModalOpen,
    isSwapModalOpen,
    selectDoctor,
    openDrawer,
    closeDrawer,
    openModal,
    closeModal,
    openGenerateScheduleModal,
    closeGenerateScheduleModal,
    openSwapModal,
    closeSwapModal,
  } = useDoctorStore();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset về trang đầu khi thay đổi page size
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  };

  const handleView = (doctor: Doctor) => {
    selectDoctor(doctor);
    openDrawer();
  };

  const handleEdit = (doctor: Doctor) => openModal(doctor);

  const handleDelete = (id: number) => {
    deleteDoctor(id, {
      onSuccess: () => toast.success("Xóa bác sĩ thành công."),
      onError: (error: any) => toast.error(handleApiError(error)),
    });
  };

  const handleSubmit = (values: DoctorFormValues | UpdateDoctorFormValues) => {
    const isEdit = !!editingDoctor;

    if (isEdit) {
      updateDoctor(
        { id: editingDoctor.id, data: values as UpdateDoctorFormValues },
        {
          onSuccess: () => {
            toast.success("Cập nhật bác sĩ thành công.");
            closeModal();
          },
          onError: (error: any) => toast.error(handleApiError(error)),
        }
      );
    } else {
      createDoctor(values as DoctorFormValues, {
        onSuccess: () => {
          toast.success("Tạo bác sĩ thành công.");
          closeModal();
        },
        onError: (error: any) => toast.error(handleApiError(error)),
      });
    }
  };

  const handleGenerateSchedule = (values: {
    startDate: string;
    doctorsPerShift: number;
  }) => {
    generateSchedule(values, {
      onSuccess: (data) => {
        toast.success("Tạo lịch làm việc thành công.");
        closeGenerateScheduleModal();
        console.log("Generated schedule:", data);
      },
      onError: (error: any) => toast.error(handleApiError(error)),
    });
  };

  const handleSwapShifts = (values: {
    doctor1: { id: number; date: string; shift: "MORNING" | "AFTERNOON" };
    doctor2: { id: number; date: string; shift: "MORNING" | "AFTERNOON" };
  }) => {
    swapShifts(values, {
      onSuccess: () => {
        toast.success("Đổi ca thành công.");
        closeSwapModal();
      },
      onError: (error: any) => toast.error(handleApiError(error)),
    });
  };

  const handleManualSchedule = (values: {
    doctorId: number;
    date: string;
    shift: "MORNING" | "AFTERNOON";
  }) => {
    assignDoctorsManually(values, {
      onSuccess: () => {
        toast.success("Thêm lịch làm việc thành công.");
        // Refresh weekly schedule data
        queryClient.invalidateQueries({ queryKey: ["weekly-schedule"] });
      },
      onError: (error: any) => toast.error(handleApiError(error)),
    });
  };

  const handleWeekChange = (startDate: Date, endDate: Date) => {
    setCurrentWeek({ start: startDate, end: endDate });
  };

  const weeklyDoctors = weeklyData?.data?.doctors || [];

  return (
    <div className="p-6 space-y-6">
      {/* Tiêu đề và nút tạo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý bác sĩ</h1>
        <div className="flex gap-2">
          <Button onClick={() => openSwapModal()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Đổi ca
          </Button>
          <Button onClick={() => openGenerateScheduleModal()} variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Tạo lịch làm việc
          </Button>
          <Button
            onClick={() => openModal()}
            className="cursor-pointer"
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm bác sĩ
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            Danh sách
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Lịch làm việc
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Thanh tìm kiếm */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm bác sĩ..."
              className="pl-10"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Bảng dữ liệu */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Danh sách bác sĩ
              </CardTitle>
            </CardHeader>
            <CardContent>
            

              <DataTable
                columns={getColumns({
                  onView: handleView,
                  onEdit: handleEdit,
                  onDelete: handleDelete,
                })}
                data={doctors}
                isLoading={isLoading}
                enablePagination={false}
              />

              {/* Pagination */}
              {meta && (
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Hiển thị {(meta.page - 1) * meta.limit + 1} -{" "}
                      {Math.min(meta.page * meta.limit, meta.total)} trong tổng
                      số {meta.total} bác sĩ
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Hiển thị:</span>
                      <Select
                        value={pageSize.toString()}
                        onValueChange={(value) =>
                          handlePageSizeChange(Number(value))
                        }
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const pageNum =
                            Math.max(
                              1,
                              Math.min(totalPages - 4, currentPage - 2)
                            ) + i;
                          if (pageNum > totalPages) return null;

                          return (
                            <Button
                              key={pageNum}
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className="w-8 h-8"
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <WeeklyTimetable
            doctors={weeklyDoctors}
            onWeekChange={handleWeekChange}
            onManualSchedule={handleManualSchedule}
            isLoading={isWeeklyLoading}
          />
        </TabsContent>
      </Tabs>

      {/* Modal và Drawer */}
      <DoctorFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialData={editingDoctor}
        onSubmit={handleSubmit}
        isPending={isCreating || isUpdating}
      />

      <DoctorDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        doctor={selectedDoctor}
        onEdit={() => {
          closeDrawer();
          openModal(selectedDoctor);
        }}
      />

      <GenerateScheduleModal
        isOpen={isGenerateScheduleModalOpen}
        onClose={closeGenerateScheduleModal}
        onSubmit={handleGenerateSchedule}
        isPending={isGenerating}
      />

      <SwapShiftsModal
        isOpen={isSwapModalOpen}
        onClose={closeSwapModal}
        onSubmit={handleSwapShifts}
        isPending={isSwapping}
      />
    </div>
  );
}
