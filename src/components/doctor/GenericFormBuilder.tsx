// components/GenericFormBuilder.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormEvent } from "react";

export type Option = { value: string; label: string };
export type FieldType = "text" | "number" | "select";

export interface FieldConfig<T> {
  name: keyof T;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: Option[]; // chỉ dùng nếu type === "select"
  customOptionValue?: string; // ví dụ: "khác"
  gridSpan?: string; // ví dụ "col-span-2"
}

export interface GenericFormProps<T> {
  data: T;
  onChange: (field: keyof T, value: unknown) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  error?: string;
  fields: FieldConfig<T>[];
  ariaLabel?: string;
}

export function GenericFormBuilder<T extends Record<string, unknown>>({
  data,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
  fields,
  ariaLabel,
}: GenericFormProps<T>) {
  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        onSubmit();
      }}
      className="grid grid-cols-2 gap-3"
      aria-label={ariaLabel}
    >
      {error && (
        <div
          className="col-span-2 text-red-500 text-xs p-2 bg-red-50 border border-red-200 rounded"
          role="alert"
        >
          <strong>Lỗi:</strong> {error}
        </div>
      )}

      {fields.map((f) => {
        const val = data[f.name];
        return (
          <div
            key={String(f.name)}
            className={`${f.gridSpan ?? ""} flex flex-col gap-1`}
          >
            <label htmlFor={String(f.name)} className="text-sm font-medium">
              {f.label}
              {f.required && <span className="text-red-500">*</span>}
            </label>

            {(f.type === "text" || f.type === "number") && (
              <Input
                id={String(f.name)}
                type={f.type}
                value={
                  f.type === "number"
                    ? typeof val === "number" || typeof val === "string"
                      ? val
                      : ""
                    : typeof val === "string"
                    ? val
                    : ""
                }
                placeholder={f.placeholder}
                required={f.required}
                onChange={(e) =>
                  onChange(
                    f.name,
                    f.type === "number"
                      ? Number(e.target.value)
                      : e.target.value
                  )
                }
                className="focus:ring-2 focus:ring-primary"
                autoComplete="off"
              />
            )}

            {f.type === "select" && (
              <>
                <Select
                  value={typeof val === "string" ? val : ""}
                  onValueChange={(v) => onChange(f.name, v)}
                  required={f.required}
                >
                  <SelectTrigger className="w-full text-xs h-10 focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder={f.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {f.options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {f.customOptionValue && val === f.customOptionValue && (
                  <Input
                    id={`${String(f.name)}_custom`}
                    placeholder={`Nhập ${f.label.toLowerCase()}`}
                    value={
                      typeof data[`${String(f.name)}Custom` as keyof T] ===
                      "string"
                        ? (data[`${String(f.name)}Custom` as keyof T] as string)
                        : ""
                    }
                    onChange={(e) =>
                      onChange(
                        `${String(f.name)}Custom` as keyof T,
                        e.target.value
                      )
                    }
                    className="mt-2 focus:ring-2 focus:ring-primary"
                    autoComplete="off"
                    required
                  />
                )}
              </>
            )}
          </div>
        );
      })}

      <div className="col-span-2 flex gap-2 mt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Huỷ
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </Button>
      </div>
    </form>
  );
}
