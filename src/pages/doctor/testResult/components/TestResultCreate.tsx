import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardTitle, CardHeader, Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePatientTreatments } from "@/hooks/usePatientTreatments";
import { useTests } from "@/hooks/useTest";
import { useCreateTestResult } from "@/hooks/useTestResult";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import type { Test } from "@/services/testService";
import type { PatientTreatmentType } from "@/types/patientTreatment";
import { Loader2 } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

interface TestResultCreateProps {
  onClose?: () => void; // Optional close function
}

const TestResultCreate = (props: TestResultCreateProps) => {
  // State for Patient Treatment Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTreatment, setSelectedTreatment] =
    useState<PatientTreatmentType | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // State for Test Search
  const [testSearchQuery, setTestSearchQuery] = useState("");
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [showTestDropdown, setShowTestDropdown] = useState(false);
  const testDropdownRef = useRef<HTMLDivElement | null>(null);

  const pageSize = 10;
  const [notes, setNotes] = useState<string>("");
  const createTestResult = useCreateTestResult();
  // Fetch Patient Treatments
  const { data: treatmentsDataRaw, isLoading: isLoadingPatientTreatments } =
    usePatientTreatments({
      page: 1,
      limit: pageSize,
      search: searchQuery, // Use searchQuery directly for continuous search
      sortBy: "startDate",
      sortOrder: "desc",
    });

  // Transform raw treatment data
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

  // Fetch Tests
  const { data: testsData, isLoading: isLoadingTests } = useTests({
    search: testSearchQuery, // Use testSearchQuery directly for continuous search
    page: 1,
    limit: pageSize,
  });

  const tests = testsData?.data?.data || [];

  // Close dropdown when clicking outside
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Patient Treatment Handlers ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedTreatment(null); // Clear selected treatment when typing
    setShowDropdown(true); // Show dropdown as user types
  };

  const handleSelectTreatment = (treatment: PatientTreatmentType) => {
    setSelectedTreatment(treatment);
    setSearchQuery(treatment.patient?.name || ""); // Display selected patient's name
    setShowDropdown(false); // Hide dropdown
    console.log("Selected Treatment:", treatment);
  };

  // --- Test Search Handlers ---
  const handleTestSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTestSearchQuery(e.target.value);
    setSelectedTest(null); // Clear selected test when typing
    setShowTestDropdown(true); // Show dropdown as user types
  };

  const handleSelectTest = (test: Test) => {
    setSelectedTest(test);
    setTestSearchQuery(test.name); // Display selected test's name
    setShowTestDropdown(false); // Hide dropdown
    console.log("Selected Test:", test);
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
      notes: notes || "", // Add any additional notes if needed
    };
    try {
      if (selectedTreatment.patient?.id) {
        await createTestResult.mutateAsync(data);
        toast.success("Tạo yêu cầu xét nghiệm thành công!");
        // Reset form after successful submission
        setSelectedTreatment(null);
        setSelectedTest(null);
        setSearchQuery("");
        setTestSearchQuery("");
        setNotes("");
        setShowDropdown(false);
        setShowTestDropdown(false);
        if (props.onClose) {
          props.onClose(); // Call the optional close function if provided
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
    <div className=" max-h-[80vh] overflow-y-auto scrollbar-hide">
      {/* Search Inputs Layout */}
      <div className="flex gap-4 m-8">
        {/* Patient Treatment Search (Left Side) */}
        <div className="relative flex-1" ref={dropdownRef}>
          <label
            htmlFor="patient-search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tìm kiếm bệnh nhân điều trị
          </label>
          <Input
            id="patient-search"
            type="text"
            placeholder="Nhập tên bệnh nhân hoặc chi tiết điều trị..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => {
              if (searchQuery.length > 0 || treatmentsData.data.length > 0) {
                setShowDropdown(true);
              }
            }}
            className="w-full border-none focus:outline-none"
          />

          {showDropdown && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
              {isLoadingPatientTreatments ? (
                <div className="p-4 text-center">
                  <Loader2 className="animate-spin inline-block mr-2" /> Đang
                  tải...
                </div>
              ) : treatmentsData.data.length > 0 ? (
                treatmentsData.data.map((treatment: PatientTreatmentType) => (
                  <div
                    key={treatment.id}
                    className="p-3 cursor-pointer hover:bg-gray-100 flex justify-between items-center border-b last:border-b-0"
                    onClick={() => handleSelectTreatment(treatment)}
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {treatment.patient?.name || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        SĐT/Mail:{" "}
                        {treatment.patient?.phoneNumber ||
                          treatment.patient?.email ||
                          "Chưa có thông tin"}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      Ngày khám: {treatment.startDate}
                    </span>
                  </div>
                ))
              ) : searchQuery.length > 0 ? (
                <div className="p-4 text-gray-500 text-center">
                  Không tìm thấy kết quả.
                </div>
              ) : (
                <div className="p-4 text-gray-500 text-center">
                  Bắt đầu gõ để tìm kiếm bệnh nhân...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Test Search (Right Side) */}
        <div className="relative flex-1" ref={testDropdownRef}>
          <label
            htmlFor="test-search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tìm kiếm xét nghiệm
          </label>
          <Input
            id="test-search"
            type="text"
            placeholder="Nhập tên xét nghiệm..."
            value={testSearchQuery}
            onChange={handleTestSearchChange}
            onFocus={() => {
              if (testSearchQuery.length > 0 || tests.length > 0) {
                setShowTestDropdown(true);
              }
            }}
            className="w-full"
          />

          {showTestDropdown && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
              {isLoadingTests ? (
                <div className="p-4 text-center">
                  <Loader2 className="animate-spin inline-block mr-2" /> Đang
                  tải...
                </div>
              ) : tests.length > 0 ? (
                tests.map((test: Test) => (
                  <div
                    key={test.id}
                    className="p-3 cursor-pointer hover:bg-gray-100 flex justify-between items-center border-b last:border-b-0"
                    onClick={() => handleSelectTest(test)}
                  >
                    <div>
                      <p className="font-medium text-gray-800">{test.name}</p>
                      <p className="text-sm text-gray-600">
                        {test.description}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      Loại xét nghiệm: {test.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      Giá: {formatCurrency(test.price)}
                    </span>
                  </div>
                ))
              ) : testSearchQuery.length > 0 ? (
                <div className="p-4 text-gray-500 text-center">
                  Không tìm thấy kết quả.
                </div>
              ) : (
                <div className="p-4 text-gray-500 text-center">
                  Bắt đầu gõ để tìm kiếm xét nghiệm...
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected Information Display with Shadcn Components */}
      {selectedTreatment && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Thông tin điều trị đã chọn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Bệnh nhân</Badge>
                <span>{selectedTreatment.patient?.name || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Ngày khám</Badge>
                <span>
                  {selectedTreatment.startDate || "Chưa có thông tin"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Sdt/Email</Badge>
                <span>
                  {selectedTreatment.patient?.phoneNumber ||
                    selectedTreatment.patient?.email ||
                    "Chưa có thông tin"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedTest && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Thông tin xét nghiệm đã chọn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Tên xét nghiệm</Badge>
                <span>{selectedTest.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Mô tả</Badge>
                <span>{selectedTest.description}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Danh mục</Badge>
                <span>{selectedTest.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Đơn vị</Badge>
                <span>{selectedTest.unit}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Giá tiền</Badge>
                <span>{formatCurrency(selectedTest.price)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">ID Xét nghiệm</Badge>
                <span>{selectedTest.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="m-6">
        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">
          Ghi chú
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Bạn có thể thêm ghi chú hoặc thông tin bổ sung tại đây.
        </p>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ghi chú thêm..."
          className="w-full"
        />
      </div>

      {/* Confirmation/Full Form Section */}
      {selectedTreatment && selectedTest ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>
              Kiểm tra lại thông tin trước khi tạo yêu cầu xét nghiệm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Bạn có thể thêm các trường nhập liệu khác như kết quả thô, ghi
              chú, v.v., tại đây.
            </p>
          </CardContent>
        </Card>
      ) : (
        <p className="text-gray-500 text-center mt-8">
          Vui lòng tìm kiếm và chọn một bệnh nhân điều trị và một xét nghiệm để
          tiếp tục.
        </p>
      )}

      <div className="flex justify-end m-4 gap-4">
        <Button variant="outline" onClick={props.onClose}>
          Đóng
        </Button>
        <Button variant="outline" onClick={() => handleSubmit()}>
          Tạo yêu cầu
        </Button>
      </div>
    </div>
  );
};

export default TestResultCreate;
