import React from "react";
import { Button } from "../../ui/button";

interface AutoEndSubmitSectionProps {
  autoEndExisting: boolean;
  setAutoEndExisting: (v: boolean) => void;
  isSubmitting: boolean;
}

const AutoEndSubmitSection: React.FC<AutoEndSubmitSectionProps> = ({
  autoEndExisting,
  setAutoEndExisting,
  isSubmitting,
}) => {
  const checkboxId = "auto-end-existing-checkbox";
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
      <div className="flex items-center gap-3 w-full md:w-auto">
        <input
          id={checkboxId}
          type="checkbox"
          checked={autoEndExisting}
          onChange={(e) => setAutoEndExisting(e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 transition-all duration-150 cursor-pointer hover:ring-2 hover:ring-blue-200"
        />
        <label
          htmlFor={checkboxId}
          className="text-sm text-gray-700 cursor-pointer select-none"
        >
          Tự động kết thúc điều trị cũ (nếu có)
        </label>
      </div>
      <Button
        disabled={isSubmitting}
        type="submit"
        variant="outline"
        className="w-full md:w-auto bg-primary text-black font-semibold hover:bg-primary/90 transition"
      >
        {isSubmitting ? "Đang tạo..." : "Tạo điều trị"}
      </Button>
    </div>
  );
};

export default AutoEndSubmitSection;
