import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { usePatientTreatments } from "@/hooks/usePatientTreatments";
import { useTests } from "@/hooks/useTest";
import { useCreateTestResult } from "@/hooks/useTestResult";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import type { Test } from "@/services/testService";
import type {
  PatientInfo,
  PatientTreatmentType,
} from "@/types/patientTreatment";
import {
  Loader2,
  Search,
  User,
  TestTube,
  FileText,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Calendar,
  Phone,
  Mail,
  Activity,
  Clipboard,
  UserCheck,
  ShieldCheck,
  ClipboardList,
  Heart,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dates/formatDate";

export interface TestResultCreateProps {
  onClose?: () => void;
  patientId?: number;
  patient?: PatientInfo;
}

const TestResultCreate = (props: TestResultCreateProps) => {
  const { patientId, patient } = props;

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTreatment, setSelectedTreatment] =
    useState<PatientTreatmentType | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [testSearchQuery, setTestSearchQuery] = useState("");
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [showTestDropdown, setShowTestDropdown] = useState(false);
  const [notes, setNotes] = useState<string>("");

  const testDropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const pageSize = 10;
  const createTestResult = useCreateTestResult();

  // Calculate progress
  const progress = useMemo(() => {
    let step = 0;
    if (selectedTreatment) step += 50;
    if (selectedTest) step += 50;
    return step;
  }, [selectedTreatment, selectedTest]);

  // Fetch data hooks
  const { data: treatmentsDataRaw, isLoading: isLoadingPatientTreatments } =
    usePatientTreatments({
      page: 1,
      limit: pageSize,
      search: searchQuery,
      sortBy: "startDate",
      sortOrder: "desc",
    });

  const { data: testsData, isLoading: isLoadingTests } = useTests({
    search: testSearchQuery,
    page: 1,
    limit: pageSize,
  });

  // Transform data
  const treatmentsData = useMemo(() => {
    if (
      treatmentsDataRaw &&
      typeof treatmentsDataRaw === "object" &&
      Array.isArray((treatmentsDataRaw as { data?: unknown }).data)
    ) {
      const { data, meta } = treatmentsDataRaw as {
        data: PatientTreatmentType[];
        meta?: { total: number };
      };
      return {
        data,
        meta: meta ?? { total: 0 },
      };
    }
    return { data: [], meta: { total: 0 } };
  }, [treatmentsDataRaw]);

  const tests = testsData?.data?.data || [];

  // Auto-select treatment if patientId provided
  useEffect(() => {
    if ((patientId || patient) && treatmentsData.data.length > 0) {
      const found = treatmentsData.data.find(
        (t) =>
          (patientId && t.patient?.id === patientId) ||
          (patient && t.patient?.id === patient.id)
      );
      if (found) {
        setSelectedTreatment(found);
        setSearchQuery(found.patient?.name || "");
        setShowDropdown(false);
      }
    }
  }, [patientId, patient, treatmentsData.data]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      if (
        testDropdownRef.current &&
        !testDropdownRef.current.contains(event.target as Node)
      ) {
        setShowTestDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedTreatment(null);
    setShowDropdown(true);
  };

  const handleSelectTreatment = (treatment: PatientTreatmentType) => {
    setSelectedTreatment(treatment);
    setSearchQuery(treatment.patient?.name || "");
    setShowDropdown(false);
  };

  const handleTestSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTestSearchQuery(e.target.value);
    setSelectedTest(null);
    setShowTestDropdown(true);
  };

  const handleSelectTest = (test: Test) => {
    setSelectedTest(test);
    setTestSearchQuery(test.name);
    setShowTestDropdown(false);
  };

  const handleSubmit = async () => {
    if (!selectedTreatment || !selectedTest) {
      toast.error("Vui lòng chọn bệnh nhân điều trị và xét nghiệm.");
      return;
    }

    const data = {
      patientTreatmentId: selectedTreatment.id,
      testId: selectedTest.id,
      userId: selectedTreatment.patient?.id || 0,
      notes: notes || "",
    };

    try {
      if (selectedTreatment.patient?.id) {
        await createTestResult.mutateAsync(data);
        toast.success("Tạo yêu cầu xét nghiệm thành công!");

        // Reset form
        setSelectedTreatment(null);
        setSelectedTest(null);
        setSearchQuery("");
        setTestSearchQuery("");
        setNotes("");
        setShowDropdown(false);
        setShowTestDropdown(false);

        if (props.onClose) {
          props.onClose();
        }
      }
    } catch (error) {
      console.error("Error creating test result:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Đã xảy ra lỗi khi tạo yêu cầu xét nghiệm."
      );
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 hide-scrollbar rounded-2xl">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          {/* Progress */}
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-blue-600">Tiến độ hoàn thành</span>
                <span className="text-blue-800 font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-gray-600">
                <span
                  className={
                    selectedTreatment ? "text-green-600 font-medium" : ""
                  }
                >
                  1. Chọn bệnh nhân
                </span>
                <span
                  className={selectedTest ? "text-green-600 font-medium" : ""}
                >
                  2. Chọn xét nghiệm
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Patient Selection */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "rounded-lg p-2 transition-colors",
                  selectedTreatment ? "bg-green-500" : "bg-indigo-500"
                )}
              >
                {selectedTreatment ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <UserCheck className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <CardTitle className="text-indigo-900">
                  Bước 1: Chọn bệnh nhân điều trị
                </CardTitle>
                <p className="text-sm text-indigo-700">
                  {selectedTreatment
                    ? "Đã chọn bệnh nhân"
                    : "Tìm kiếm và chọn bệnh nhân cần xét nghiệm"}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative" ref={dropdownRef}>
              <div className="relative">
                <Search className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Nhập tên bệnh nhân hoặc chi tiết điều trị..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    if (
                      searchQuery.length > 0 ||
                      treatmentsData.data.length > 0
                    ) {
                      setShowDropdown(true);
                    }
                  }}
                  className="pl-10 h-12 border-2 border-indigo-200 focus:border-indigo-400"
                  disabled={!!patientId || !!patient}
                />
              </div>

              {(!!patientId || !!patient) && selectedTreatment && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      Đã tự động chọn bệnh nhân:{" "}
                      <strong>{selectedTreatment.patient?.name}</strong>
                    </span>
                  </div>
                </div>
              )}

              {!patientId && !patient && showDropdown && (
                <div className="absolute z-10 w-full bg-white border-2 border-indigo-200 rounded-lg shadow-xl mt-2 max-h-80 overflow-y-auto">
                  {isLoadingPatientTreatments ? (
                    <div className="p-6 text-center">
                      <Loader2 className="animate-spin inline-block mr-2 w-5 h-5" />
                      <span>Đang tải danh sách bệnh nhân...</span>
                    </div>
                  ) : treatmentsData.data.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {treatmentsData.data.map(
                        (treatment: PatientTreatmentType) => (
                          <div
                            key={treatment.id}
                            className="p-4 cursor-pointer hover:bg-indigo-50 transition-colors"
                            onClick={() => handleSelectTreatment(treatment)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-indigo-600" />
                                  <span className="font-semibold text-gray-800">
                                    {treatment.patient?.name || "N/A"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  {treatment.patient?.phoneNumber && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      <span>
                                        {treatment.patient.phoneNumber}
                                      </span>
                                    </div>
                                  )}
                                  {treatment.patient?.email && (
                                    <div className="flex items-center gap-1">
                                      <Mail className="w-3 h-3" />
                                      <span>{treatment.patient.email}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right text-xs text-gray-500">
                                <div className="flex items-center gap-1 mb-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{treatment.startDate}</span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  ID: {treatment.id}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : searchQuery.length > 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>Không tìm thấy bệnh nhân phù hợp</p>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>Bắt đầu gõ để tìm kiếm bệnh nhân...</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Patient Info */}
            {selectedTreatment && (
              <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-indigo-900">
                    Bệnh nhân đã chọn
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-indigo-700">
                        Tên bệnh nhân:
                      </span>
                      <span className="font-semibold">
                        {selectedTreatment.patient?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-indigo-700">
                        Ngày khám:
                      </span>
                      <span className="font-semibold">
                        {formatDate(
                          selectedTreatment.startDate,
                          "dd/MM/yyyy"
                        ) || "Chưa có thông tin"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-indigo-700">Liên hệ:</span>
                      <span className="font-semibold">
                        {selectedTreatment.patient?.phoneNumber ||
                          selectedTreatment.patient?.email ||
                          "Chưa có thông tin"}
                      </span>
                    </div>
                    {selectedTreatment.doctor?.user?.name && (
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm text-indigo-700">Bác sĩ:</span>
                        <span className="font-semibold">
                          {selectedTreatment.doctor.user.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Test Selection */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "rounded-lg p-2 transition-colors",
                  selectedTest
                    ? "bg-green-500"
                    : selectedTreatment
                    ? "bg-purple-500"
                    : "bg-gray-400"
                )}
              >
                {selectedTest ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <TestTube className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <CardTitle className="text-purple-900">
                  Bước 2: Chọn loại xét nghiệm
                </CardTitle>
                <p className="text-sm text-purple-700">
                  {selectedTest
                    ? "Đã chọn xét nghiệm"
                    : "Tìm kiếm và chọn loại xét nghiệm cần thực hiện"}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative" ref={testDropdownRef}>
              <div className="relative">
                <Search className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Nhập tên xét nghiệm..."
                  value={testSearchQuery}
                  onChange={handleTestSearchChange}
                  onFocus={() => {
                    if (testSearchQuery.length > 0 || tests.length > 0) {
                      setShowTestDropdown(true);
                    }
                  }}
                  className="pl-10 h-12 border-2 border-purple-200 focus:border-purple-400"
                  disabled={!selectedTreatment}
                />
              </div>

              {!selectedTreatment && (
                <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 text-sm text-amber-800">
                    <AlertCircle className="w-4 h-4" />
                    <span>
                      Vui lòng chọn bệnh nhân trước khi chọn xét nghiệm
                    </span>
                  </div>
                </div>
              )}

              {showTestDropdown && selectedTreatment && (
                <div className="absolute z-10 w-full bg-white border-2 border-purple-200 rounded-lg shadow-xl mt-2 max-h-80 overflow-y-auto">
                  {isLoadingTests ? (
                    <div className="p-6 text-center">
                      <Loader2 className="animate-spin inline-block mr-2 w-5 h-5" />
                      <span>Đang tải danh sách xét nghiệm...</span>
                    </div>
                  ) : tests.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {tests.map((test: Test) => (
                        <div
                          key={test.id}
                          className="p-4 cursor-pointer hover:bg-purple-50 transition-colors"
                          onClick={() => handleSelectTest(test)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <TestTube className="w-4 h-4 text-purple-600" />
                                <span className="font-semibold text-gray-800">
                                  {test.name}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {test.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>Danh mục: {test.category}</span>
                                <span>Đơn vị: {test.unit}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className="bg-green-100 text-green-800 border-green-300">
                                {formatCurrency(test.price)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : testSearchQuery.length > 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>Không tìm thấy xét nghiệm phù hợp</p>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>Bắt đầu gõ để tìm kiếm xét nghiệm...</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Test Info */}
            {selectedTest && (
              <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-purple-900">
                    Xét nghiệm đã chọn
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TestTube className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-purple-700">Tên:</span>
                      <span className="font-semibold">{selectedTest.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clipboard className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-purple-700">Mô tả:</span>
                      <span className="font-semibold">
                        {selectedTest.description}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-purple-700">Danh mục:</span>
                      <span className="font-semibold">
                        {selectedTest.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-purple-700">Chi phí:</span>
                      <span className="font-semibold text-green-700">
                        {formatCurrency(selectedTest.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 3: Notes */}
        {selectedTreatment && selectedTest && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-amber-500 rounded-lg p-2">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-amber-900">
                    Bước 3: Ghi chú bổ sung (tùy chọn)
                  </CardTitle>
                  <p className="text-sm text-amber-700">
                    Thêm thông tin bổ sung cho yêu cầu xét nghiệm
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập ghi chú bổ sung cho yêu cầu xét nghiệm (tùy chọn)..."
                className="min-h-24 border-2 border-amber-200 focus:border-amber-400"
              />
            </CardContent>
          </Card>
        )}

        {/* Summary & Submit */}
        {selectedTreatment && selectedTest && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-green-500 rounded-lg p-2">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-green-900">
                    Xác nhận thông tin
                  </CardTitle>
                  <p className="text-sm text-green-700">
                    Kiểm tra lại thông tin trước khi tạo yêu cầu
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg border-2 border-green-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-900 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Thông tin bệnh nhân
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tên:</span>
                        <span className="font-medium">
                          {selectedTreatment.patient?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-900 flex items-center gap-2">
                      <TestTube className="w-4 h-4" />
                      Thông tin xét nghiệm
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tên:</span>
                        <span className="font-medium">{selectedTest.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Chi phí:</span>
                        <span className="font-medium text-green-700">
                          {formatCurrency(selectedTest.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {notes && (
                  <div className="mt-6 pt-6 border-t border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Ghi chú
                    </h4>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded p-3">
                      {notes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <Button
            variant="outline"
            onClick={props.onClose}
            className="px-6 cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !selectedTreatment || !selectedTest || createTestResult.isPending
            }
            className={cn(
              "px-6 font-semibold shadow-lg transition-all duration-200 text-white cursor-pointer",
              "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
              "disabled:from-gray-400 disabled:to-gray-500"
            )}
          >
            {createTestResult.isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                Đang tạo yêu cầu...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                Tạo yêu cầu xét nghiệm
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestResultCreate;
