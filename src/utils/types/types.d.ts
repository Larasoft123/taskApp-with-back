export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface Solution {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export interface Note {
  id: number;
  title: string;
  description: string;
  tags: Tag[];
  solutions: Solution[];
  createdAt: string;
  updatedAt: string;
 }