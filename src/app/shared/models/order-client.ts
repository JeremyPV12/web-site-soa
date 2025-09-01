export interface ParentOrder {
  id: string;
  userId: string;
  createdAt: string;
  total: number;
  orders: ChildOrder[];
}

export interface ChildOrder {
  idOrder: string;
  date: string;
  status: "PENDIENTE" | "ENTREGADO";
  total: number;
  products: Product[];
}

export interface Product {
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  productStatus: string;
}
