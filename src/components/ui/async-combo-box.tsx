import * as React from "react";
import { Input } from "./input";

export interface AsyncComboBoxOption {
  id: number | string;
  name: string;
}

interface AsyncComboBoxProps {
  value: number | string | undefined;
  onChange: (id: number | string | undefined) => void;
  onSearch: (query: string) => Promise<AsyncComboBoxOption[]>;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  showCount?: boolean;
  allowCustomValue?: boolean;
}

const AsyncComboBox: React.FC<AsyncComboBoxProps> = ({
  value,
  onChange,
  onSearch,
  placeholder,
  label,
  error,
  disabled,
  showCount = true,
  allowCustomValue = false,
}) => {
  const [query, setQuery] = React.useState("");
  const [options, setOptions] = React.useState<AsyncComboBoxOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    // Nếu có value và chưa có query, tự động fill query bằng tên option đã chọn
    if (value !== undefined && value !== null && query === "") {
      const selected = options.find((o) => o.id === value);
      if (selected) setQuery(selected.name);
    }
    // Khi query rỗng, show tất cả item khả dụng (onSearch("") trả về all)
    setLoading(true);
    onSearch(query)
      .then((opts) => setOptions(opts))
      .finally(() => setLoading(false));
  }, [query, onSearch, value]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      allowCustomValue &&
      e.key === "Enter" &&
      query.trim() !== "" &&
      !options.some((o) => o.name === query.trim())
    ) {
      onChange(query.trim());
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative">
      {label && (
        <label className="block font-medium mb-1" htmlFor={label}>
          {label}
        </label>
      )}
      <Input
        ref={inputRef}
        id={label}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={error ? "border-red-500" : ""}
        autoComplete="off"
      />
      {showDropdown && (options.length > 0 || loading) && (
        <div className="absolute z-10 bg-white border border-gray-200 rounded shadow w-full mt-1 max-h-56 overflow-auto">
          {showCount && (
            <div className="p-2 text-xs text-gray-500">
              {loading ? "Đang tìm..." : `Kết quả: ${options.length}`}
            </div>
          )}
          {!loading && options.length === 0 && (
            <div className="p-2 text-gray-500 text-sm">Không tìm thấy</div>
          )}
          {!loading &&
            options.map((option) => (
              <div
                key={option.id}
                className="p-2 hover:bg-blue-100 cursor-pointer text-sm"
                onClick={() => {
                  onChange(option.id);
                  setQuery(option.name);
                  setShowDropdown(false);
                }}
              >
                {option.name} (ID: {option.id})
              </div>
            ))}
        </div>
      )}
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};

export default AsyncComboBox;
