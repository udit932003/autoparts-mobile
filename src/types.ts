export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  productCount?: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  price: number;
  stock: number;
  image: string;
  partNumber: string | null;
  featured: boolean;
  category?: { name: string; slug: string };
};

// React Navigation route params
export type RootStackParamList = {
  Home: undefined;
  Products: { category?: string; categoryName?: string; q?: string } | undefined;
  ProductDetail: { slug: string; name?: string };
};
