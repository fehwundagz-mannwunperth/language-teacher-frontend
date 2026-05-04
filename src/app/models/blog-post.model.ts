export type BlogContentBlockType = 'subtitle' | 'paragraph' | 'image';

export interface BlogContentBlock {
  id: string;
  type: BlogContentBlockType;
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  imageUrl?: string;
  imageName?: string;
}

export interface BlogPost {
  id: string;
  createdAt: string;
  title: string;
  summary: string;
  contentBlocks: BlogContentBlock[];
  images?: string[];
}

export interface BlogPostDraft {
  title: string;
  summary: string;
  contentBlocks: BlogContentBlock[];
  images?: string[];
}
