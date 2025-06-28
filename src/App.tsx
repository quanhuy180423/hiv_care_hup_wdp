import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import "./index.css";
import { LoginForm } from "@/components/forms/LoginForm";
import { Counter } from "@/components/Counter";
import { UsersList } from "@/components/UsersList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LoginFormData } from "@/schemas/auth";
import { Home, User, Settings, Monitor } from "lucide-react";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

type Tab = "dashboard" | "login" | "users" | "counter";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [loginResult, setLoginResult] = useState<string>("");

  const handleLogin = (data: LoginFormData) => {
    console.log("Login data:", data);
    setLoginResult(`Đăng nhập thành công với email: ${data.email}`);
    setTimeout(() => setLoginResult(""), 3000);
  };

  const tabs = [
    { id: "dashboard" as const, label: "Dashboard", icon: Home },
    { id: "login" as const, label: "Đăng nhập", icon: User },
    { id: "users" as const, label: "Người dùng", icon: Settings },
    { id: "counter" as const, label: "Counter", icon: Monitor },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen ">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-3xl font-bold text-center text-primary">
              🚀 Modern React App
            </h1>
            <p className="text-center text-muted-foreground mt-2">
              Vite + React + TypeScript + Zustand + React Query + Shadcn UI +
              Tailwind CSS
            </p>
          </div>
        </header>

        {/* Navigation */}
        <nav className="border-b">
          <div className="container mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className="flex items-center gap-2 whitespace-nowrap"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>🎉 Chào mừng đến với Modern React App!</CardTitle>
                  <CardDescription>
                    Đây là một ứng dụng demo tích hợp tất cả các công nghệ hiện
                    đại
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4">
                      <h3 className="font-semibold text-blue-600">⚡ Vite</h3>
                      <p className="text-sm text-muted-foreground">
                        Build tool nhanh chóng
                      </p>
                    </Card>
                    <Card className="p-4">
                      <h3 className="font-semibold text-cyan-600">
                        🔧 TypeScript
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Type-safe development
                      </p>
                    </Card>
                    <Card className="p-4">
                      <h3 className="font-semibold text-purple-600">
                        🐻 Zustand
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        State management đơn giản
                      </p>
                    </Card>
                    <Card className="p-4">
                      <h3 className="font-semibold text-orange-600">
                        🔄 React Query
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Data fetching mạnh mẽ
                      </p>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4">
                      <h3 className="font-semibold text-green-600">
                        🎨 Tailwind CSS
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Utility-first CSS
                      </p>
                    </Card>
                    <Card className="p-4">
                      <h3 className="font-semibold text-pink-600">
                        🧩 Shadcn UI
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Beautiful components
                      </p>
                    </Card>
                    <Card className="p-4">
                      <h3 className="font-semibold text-red-600">
                        📝 React Hook Form
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Form handling hiệu quả
                      </p>
                    </Card>
                    <Card className="p-4">
                      <h3 className="font-semibold text-indigo-600">✅ Zod</h3>
                      <p className="text-sm text-muted-foreground">
                        Schema validation
                      </p>
                    </Card>
                  </div>

                  <div className="text-center py-4">
                    <p className="text-lg">
                      Sử dụng các tab phía trên để khám phá các tính năng! 🚀
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "login" && (
            <div className="max-w-md mx-auto space-y-4">
              <LoginForm onSubmit={handleLogin} />
              {loginResult && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <p className="text-green-800 text-center">{loginResult}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div className="max-w-2xl mx-auto">
              <UsersList />
            </div>
          )}

          {activeTab === "counter" && (
            <div className="max-w-sm mx-auto">
              <Counter />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t mt-12">
          <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
            <p>Built with ❤️ using modern React ecosystem</p>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

export default App;
