import { OrderDetail } from "./OrderDetail";

export interface Order {
  id: string;
  userId: string;
  orders: OrderDetail[];
}
