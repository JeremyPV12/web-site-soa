export interface OrderItem {
  orderId: string;
  storeName: string;
  _id: string;
  orderDetails?: OrderDetailResponse;
}

export interface OrderDetailItem {
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface UserInfo {
  id: string;
  name: string;
  last_name: string;
  username: string;
}

export interface OrderDetailResponse {
  id: number;
  orderDate: string;
  status: string;
  total: number;
  orderDetails: OrderDetailItem[];
}

export interface OrderResponse {
  id: string;
  userId: string;
  orders: OrderItem[];
  createdAt: string;
  updatedAt: string;
  overallStatus?: string;
  user?: UserInfo;
}
