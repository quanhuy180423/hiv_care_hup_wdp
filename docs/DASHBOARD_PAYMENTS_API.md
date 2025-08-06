# Dashboard Payments API Service

## Overview

Service riêng dành cho dashboard để quản lý và thống kê doanh thu với API `http://localhost:3001/payment/dashboard`. Service này cung cấp thống kê chi tiết về payments, doanh thu theo ngày, phương thức thanh toán và loại dịch vụ.

## Files Structure

```
src/
├── services/
│   └── dashboardPaymentService.ts        # API service cho payments dashboard
├── hooks/
│   └── useDashboardPayments.ts           # React Query hooks
└── components/
    └── dashboard/
        ├── QuickPaymentStats.tsx         # Payment stats component
        └── DashboardPage.tsx             # Main dashboard with payments
```

## API Response Format

Dựa trên response từ `http://localhost:3001/payment/dashboard?limit=1000000`:

```json
{
  "data": {
    "payments": [
      {
        "id": 19,
        "orderId": 19,
        "amount": "14000",
        "method": "BANK_TRANSFER",
        "status": "SUCCESS",
        "transactionCode": "DH325723112",
        "gatewayTransactionId": null,
        "gatewayResponse": {
          "id": 19633883,
          "code": "DH325723112",
          "content": "DH325723112",
          "gateway": "TPBank",
          "subAccount": null,
          "accumulated": 98584,
          "description": "BankAPINotify DH325723112",
          "transferType": "in",
          "accountNumber": "03533664595",
          "referenceCode": "664ITC1252190836",
          "transferAmount": 14000,
          "transactionDate": "2025-08-06 23:35:50"
        },
        "paidAt": "2025-08-06T16:35:32.934Z",
        "createdAt": "2025-08-06T16:35:05.092Z",
        "updatedAt": "2025-08-06T16:35:32.935Z",
        "order": {
          "id": 19,
          "userId": 16,
          "appointmentId": null,
          "patientTreatmentId": 14,
          "orderCode": "DH1754498105088QURM66",
          "totalAmount": "14000",
          "notes": "Đơn hàng khám và điều trị HIV - ",
          "orderStatus": "PAID",
          "createdAt": "2025-08-06T16:35:05.092Z",
          "updatedAt": "2025-08-06T16:35:33.020Z",
          "expiredAt": "2025-08-07T16:35:06.632Z",
          "user": {
            "id": 16,
            "name": "Huy k17 HCM Trinh Quang",
            "email": "huytqse172504@fpt.edu.vn",
            "phoneNumber": ""
          },
          "appointment": {
            "id": 28,
            "appointmentTime": "2025-08-07T09:20:00.000Z",
            "status": "COMPLETED",
            "service": {
              "id": 5,
              "name": "Điều trị HIV bậc 2",
              "price": "5000"
            },
            "doctor": {
              "id": 3,
              "user": {
                "name": "Dr. Nhật Minh"
              }
            }
          },
          "patientTreatment": {
            "id": 14,
            "startDate": "2025-08-07T00:00:00.000Z",
            "endDate": "2025-08-24T00:00:00.000Z",
            "status": true
          },
          "orderDetails": [
            {
              "id": 30,
              "type": "TEST",
              "referenceId": 5,
              "name": "Syphilis TPHA",
              "quantity": 1,
              "unitPrice": "5000",
              "totalPrice": "5000"
            },
            {
              "id": 31,
              "type": "MEDICINE",
              "referenceId": 8,
              "name": "Tenofovir",
              "quantity": 1,
              "unitPrice": "1500",
              "totalPrice": "1500"
            },
            {
              "id": 32,
              "type": "MEDICINE",
              "referenceId": 14,
              "name": "Levothyroxine",
              "quantity": 1,
              "unitPrice": "6000",
              "totalPrice": "6000"
            },
            {
              "id": 33,
              "type": "MEDICINE",
              "referenceId": 11,
              "name": "Dolutegravir",
              "quantity": 1,
              "unitPrice": "1500",
              "totalPrice": "1500"
            }
          ]
        }
      }
    ],
    "meta": {
      "total": 100,
      "page": 1,
      "limit": 1000000,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  }
}
```

## API Methods

### 1. Get All Payments

```typescript
dashboardPaymentService.getAllPayments();
```

**Response**: `PaymentDashboardResponse` với tất cả payments (limit 1,000,000)

### 2. Get Payment Statistics

```typescript
dashboardPaymentService.getPaymentStats();
```

**Response**: `PaymentStats` bao gồm:

- Total revenue và payment counts
- Revenue breakdown by method (BANK_TRANSFER, CASH, CARD)
- Revenue breakdown by type (APPOINTMENT_FEE, TEST, MEDICINE)
- Time-based statistics (today, week, month)
- Daily revenue trend (7 days)

### 3. Get Payments with Filters

```typescript
dashboardPaymentService.getPaymentsWithFilters({
  startDate: "2025-08-01",
  endDate: "2025-08-07",
  status: "SUCCESS",
  page: 1,
  limit: 100,
});
```

### 4. Get Payments by Date Range

```typescript
dashboardPaymentService.getPaymentsByDateRange("2025-08-01", "2025-08-07");
```

### 5. Get Payments by Status

```typescript
dashboardPaymentService.getPaymentsByStatus("SUCCESS");
```

## React Hooks Usage

### Basic Payment Stats

```typescript
import { useDashboardPaymentStats } from "@/hooks/useDashboardPayments";

const PaymentDashboard = () => {
  const { data, isLoading, error } = useDashboardPaymentStats();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Total Revenue: {data?.totalRevenue}</h2>
      <h3>Today: {data?.todayRevenue}</h3>
      <h3>This Week: {data?.thisWeekRevenue}</h3>
      <h3>This Month: {data?.thisMonthRevenue}</h3>

      {/* Method breakdown */}
      {Object.entries(data?.revenueByMethod || {}).map(([method, amount]) => (
        <div key={method}>
          {method}: {amount}
        </div>
      ))}
    </div>
  );
};
```

### Today's Payments

```typescript
import { useTodayPayments } from "@/hooks/useDashboardPayments";

const TodayPayments = () => {
  const { data, isLoading } = useTodayPayments();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h3>Today's Payments: {data?.length || 0}</h3>
      {data?.map((payment) => (
        <div key={payment.id}>
          {payment.transactionCode} - {payment.amount} VND
        </div>
      ))}
    </div>
  );
};
```

### Payment Analytics Hook

```typescript
import { usePaymentAnalytics } from "@/hooks/useDashboardPayments";

const PaymentAnalytics = () => {
  const { stats, todayPayments, thisWeekPayments, isLoading, error, refetch } =
    usePaymentAnalytics();

  if (isLoading) return <div>Loading analytics...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh Data</button>
      <div>Total Revenue: {stats?.totalRevenue}</div>
      <div>Today's Payments: {todayPayments?.length}</div>
      <div>This Week's Payments: {thisWeekPayments?.length}</div>
    </div>
  );
};
```

## TypeScript Interfaces

### DashboardPayment

```typescript
interface DashboardPayment {
  id: number;
  orderId: number;
  amount: string;
  method: "BANK_TRANSFER" | "CASH" | "CARD";
  status: "SUCCESS" | "PENDING" | "FAILED";
  transactionCode: string;
  gatewayTransactionId?: string;
  gatewayResponse?: GatewayResponse;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  order: OrderWithDetails;
}
```

### PaymentStats

```typescript
interface PaymentStats {
  totalRevenue: number;
  totalPayments: number;
  successfulPayments: number;
  pendingPayments: number;
  failedPayments: number;
  todayRevenue: number;
  thisWeekRevenue: number;
  thisMonthRevenue: number;
  averageOrderValue: number;
  revenueByMethod: {
    BANK_TRANSFER: number;
    CASH: number;
    CARD: number;
  };
  revenueByType: {
    APPOINTMENT_FEE: number;
    TEST: number;
    MEDICINE: number;
  };
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    count: number;
  }>;
}
```

## Dashboard Features

### 💰 **Revenue Overview**

- Total revenue from all successful payments
- Today's revenue with real-time updates
- Weekly and monthly revenue trends
- Average order value calculation

### 📊 **Payment Status Breakdown**

- SUCCESS: Successful payments (green badge)
- PENDING: Processing payments (yellow badge)
- FAILED: Failed payments (red badge)
- Percentage distribution for each status

### 💳 **Payment Method Analysis**

- BANK_TRANSFER: Bank transfer payments (blue badge)
- CASH: Cash payments (green badge)
- CARD: Card payments (purple badge)
- Revenue percentage by each method

### 🏥 **Service Type Revenue**

- APPOINTMENT_FEE: Doctor consultation fees (blue)
- TEST: Medical test fees (green)
- MEDICINE: Medication costs (purple)
- Revenue breakdown by service type

### 📈 **Daily Revenue Trend**

- Last 7 days revenue trend
- Daily payment count
- Today highlighted with special styling
- Visual timeline with colored indicators

### 🔄 **Real-time Features**

- Auto-refresh every 2 minutes for today's data
- Background updates every 5 minutes for statistics
- Real-time payment counts
- Live revenue calculations

## API Parameters

### Payment Dashboard Endpoint

```
GET /payment/dashboard
```

**Query Parameters:**

- `startDate` (string, optional): Start date filter (YYYY-MM-DD)
- `endDate` (string, optional): End date filter (YYYY-MM-DD)
- `status` (string, optional): Payment status filter
- `page` (number, optional): Page number for pagination
- `limit` (number, optional): Items per page (default: 1000000)

## Usage Example

```typescript
// Complete payment dashboard component
import { QuickPaymentStats } from "@/components/dashboard/QuickPaymentStats";

const MyDashboard = () => {
  return (
    <div>
      <h1>Healthcare Revenue Dashboard</h1>
      <QuickPaymentStats />
    </div>
  );
};
```

## Integration Notes

1. **High Performance**: Service handles up to 1 million payments efficiently
2. **Real-time Updates**: Smart caching with background refresh
3. **Vietnamese Currency**: Automatic VND formatting
4. **Timezone Handling**: Local timezone for date calculations
5. **Error Handling**: Comprehensive error handling with Vietnamese messages
6. **TypeScript Support**: Fully typed interfaces and responses
7. **Visual Components**: Color-coded badges and status indicators
8. **Responsive Design**: Mobile-first layout with Tailwind CSS

Service này cung cấp đầy đủ thông tin để theo dõi và phân tích doanh thu trong dashboard một cách hiệu quả và trực quan!
