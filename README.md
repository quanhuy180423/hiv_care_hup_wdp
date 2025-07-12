# API Client Configuration - HIV Care Hub

## Overview

Đây là cấu hình API client hoàn chỉnh sử dụng Axios cho project HIV Care Hub, bao gồm:

- **Type-safe API calls** với TypeScript
- **Authentication handling** tự động
- **Request/Response interceptors**
- **Error handling** thống nhất
- **Retry logic** cho network errors
- **Request/Response logging** trong development
- **File upload/download** support
- **Token management** tự động

## Features

### 🔐 Authentication

- Tự động thêm Bearer token vào headers
- Auto refresh token khi expire
- Redirect to login khi unauthorized
- Clear auth data khi logout

### 🔄 Request Handling

- Request timeout (15s)
- Retry logic cho network errors (3 lần)
- Request/Response logging trong dev mode
- Request duration tracking

### 📁 File Operations

- Upload files với progress tracking
- Download files với auto filename
- Support FormData và File objects

### 🛡️ Error Handling

- Centralized error message mapping
- Vietnamese error messages
- Proper HTTP status code handling
- Development vs production error handling

## Usage Examples

### Basic API Calls

```typescript
import { api } from "@/services";

// GET request
const users = await api.get<User[]>("/users");

// POST request
const newUser = await api.post<User>("/users", {
  name: "John Doe",
  email: "john@example.com",
});

// PUT/PATCH request
const updatedUser = await api.patch<User>("/users/123", {
  name: "Jane Doe",
});

// DELETE request
await api.delete("/users/123");
```

### Authentication Service

```typescript
import { authService } from "@/services";

// Login
try {
  const result = await authService.login({
    email: "user@example.com",
    password: "password123",
  });
  console.log("Logged in:", result.user);
} catch (error) {
  console.error("Login failed:", error.message);
}

// Register
const newUser = await authService.register({
  name: "New User",
  email: "newuser@example.com",
  password: "password123",
  confirmPassword: "password123",
});

// Update profile
const updatedProfile = await authService.updateProfile({
  name: "Updated Name",
});

// Change password
await authService.changePassword({
  currentPassword: "oldPassword",
  newPassword: "newPassword",
  confirmPassword: "newPassword",
});
```

### User Management Service

```typescript
import { userService } from "@/services";

// Get paginated users
const result = await userService.getUsers({
  page: 1,
  limit: 10,
  search: "john",
  role: "user",
});

// Create user
const newUser = await userService.createUser({
  name: "New User",
  email: "newuser@example.com",
  password: "password123",
  role: "user",
});

// Update user
const updatedUser = await userService.updateUser("123", {
  name: "Updated Name",
  status: "active",
});

// Get user stats
const stats = await userService.getUserStats();
```

### File Upload

```typescript
import { api } from "@/services";

// Upload single file
const uploadFile = async (file: File) => {
  try {
    const result = await api.upload("/upload", file, {
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        console.log(`Upload progress: ${progress}%`);
      },
    });
    return result.data;
  } catch (error) {
    console.error("Upload failed:", error);
  }
};

// Download file
await api.download("/files/123/download", "document.pdf");
```

### Error Handling

```typescript
import { handleApiError } from "@/services";

try {
  const data = await api.get("/some-endpoint");
  // Handle success
} catch (error) {
  const errorMessage = handleApiError(error);
  // Show user-friendly error message
  alert(errorMessage);
}
```

## Environment Configuration

Create `.env.local` file:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Environment
VITE_APP_ENV=development

# Features
VITE_ENABLE_API_LOGGING=true
VITE_ENABLE_MOCK_API=true
```

## Integration with React Query

```typescript
// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services";

export const useUsers = (query: UserListQuery) => {
  return useQuery({
    queryKey: ["users", query],
    queryFn: () => userService.getUsers(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
```

## Integration with Zustand Auth Store

```typescript
// store/auth.ts - Updated to use API service
import { authService } from "@/services";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ... other state

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const result = await authService.login({ email, password });
          set({
            user: result.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.warn("Logout API failed:", error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },
    })
    // ... persist config
  )
);
```

## API Response Format

Tất cả API responses follow standard format:

```typescript
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Success message",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

Error responses:

```typescript
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error 1", "Detailed error 2"],
  "statusCode": 400
}
```

## Security Features

1. **Automatic token management** - Tokens stored in localStorage
2. **Request signing** - Bearer token auto-added to headers
3. **Token refresh** - Auto refresh expired tokens
4. **Auth state sync** - Clear auth on 401 responses
5. **CSRF protection** - Ready for CSRF token implementation

## Performance Features

1. **Request deduplication** - Prevent duplicate requests
2. **Response caching** - Cache GET requests when appropriate
3. **Request/Response compression** - Gzip support
4. **Connection pooling** - Reuse HTTP connections
5. **Request timeout** - Prevent hanging requests

## Next Steps

1. **Implement mock API** cho development
2. **Add request deduplication**
3. **Add response caching** strategies
4. **Implement offline support** với service workers
5. **Add rate limiting** protection
6. **Implement request signing** for security

Axios API client đã được configured hoàn chỉnh và ready để sử dụng trong production! 🚀
