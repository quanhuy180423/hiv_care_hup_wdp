import { useCounterStore } from "@/store/counter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Minus, RotateCcw } from "lucide-react";

export function Counter() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>Zustand Counter</CardTitle>
        <CardDescription>Ví dụ về quản lý state với Zustand</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary">{count}</div>
          <p className="text-sm text-muted-foreground">Giá trị hiện tại</p>
        </div>

        <div className="flex gap-2 justify-center">
          <Button
            onClick={decrement}
            variant="outline"
            size="icon"
            title="Giảm"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <Button onClick={reset} variant="outline" size="icon" title="Reset">
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button onClick={increment} size="icon" title="Tăng">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
