export interface Service {
  id: number;
  name: string;
  description: string;
  type: "CONSULT" | "TEST" | "TREATMENT";
  price: string;
  startTime: string;
  endTime: string;
  content: string;
}
