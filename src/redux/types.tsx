export interface User {
  name: string;
  email: string;
  age: number;
  address: {
    house: string;
    area: string;
    locality: string;
    pincode: number;
  };
}

export interface userProps {
  users: User[];
}

export interface Post {
  _id?: string;
  id: number;
  method?: string
  title?: string;
  body?: string;
  tags?: string[];
  userId?: number;
  reactions?: {
    likes: number;
    dislikes: number;
  };
  views?: number;
}

export interface PostsProps {
  total: number;
  akip: number;
  skip: number;
  posts: Post[];
}

export interface Dimensions {
  depth?: number;
  height?: number;
  width?: number;
}

export interface Meta {
  createdAt?: string;
  updatedAt?: string;
  barcode?: string;
  qrCode?: string;
}

export interface Review {
  rating?: number;
  comment?: string;
  date?: string;
  reviewerName?: string;
  reviewerEmail?: string;
}

export type AvailabilityStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface Product {
  id?: number;
  _id?: string;
  title?: string;
  description?: string;
  category?: string;

  price?: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;

  availabilityStatus: string;

  brand?: string;
  sku?: string;
  weight?: number;

  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };

  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;

  tags?: string[];
  images?: string[];
  thumbnail?: string;

  reviews?: Review[];
  meta?: Meta;
}

export interface productResponse {
  message: string;
  products: Product[];
  total: number;
  categories: string[];
  brands: string[];
  titles: string[];
}

export interface filter {
  category?: string | null;
  title?: string | null;
  brand?: string | null;
}
