export interface Question {
  id: string;
  slug: string;
  title: string;
  chat_log: any[];
  status: string;
  created_at: string;
  category_id?: number | null;
  me_too_count?: number;
  helpful_count?: number;
  language?: string;
  seo_title?: string;
  volume?: string;
  folio_image_src?: string;
  cipher_key?: string;
  pull_quote?: string;
}

export interface FolioData {
  id: string;
  volumeLabel: string;
  title: string;
  description: string;
  imageSrc: string;
  topics: string[];
}
