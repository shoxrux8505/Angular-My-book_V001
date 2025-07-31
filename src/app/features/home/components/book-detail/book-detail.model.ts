export interface Book {
  id: number;
  name: string;
  type: string;
  year: number;
  description: string;
  length: number;
  created_at: string;
  updated_at: string;
  picture_url: string;
  pdf_url: string;
  count: number;
  category_name: string;
  author_name: string;
  user_ids: number[];
}
