// LoadingSpinner.tsx (hoặc .jsx)

// interface LoadingSpinnerProps {
//   // Bạn có thể thêm các props tùy chỉnh ở đây nếu cần, ví dụ: kích thước, màu sắc
//   // size?: 'small' | 'medium' | 'large'; // Ví dụ về cách thêm prop kích thước
// }

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      {/* Tailwind classes:
        - animate-spin: Kích hoạt hiệu ứng quay.
        - w-12 h-12: Đặt chiều rộng và chiều cao là 3rem (48px).
        - border-4: Độ dày viền là 4px.
        - border-solid: Kiểu viền là nét liền.
        - border-gray-200: Màu viền ngoài (trắng mờ).
        - border-t-black: Màu viền trên (đen).
        - rounded-full: Tạo hình tròn.
      */}
      <div
        className="
          animate-spin
          w-12 h-12
          border-4 border-solid border-gray-200 border-t-black
          rounded-full
        "
        role="status" // Thêm role cho khả năng tiếp cận (accessibility)
      >
        <span className="sr-only">Đang tải...</span>{" "}
        {/* Dành cho trình đọc màn hình */}
      </div>
    </div>
  );
};

export default LoadingSpinner;
