export interface IPost {
  id: number;
  title: string;
  content: string;
  author?: string | undefined;
  category?: string | undefined;
}