export interface blogPostObject {
  post_name: string;
  post_content: string;
  meta_data_title: string;
  meta_data_description: string;
  post_url: string;
  post_author: string;
  post_tags: string[];
  publication_date: Date;
}

export type updateBlogPostObject = Partial<blogPostObject>;

export interface blogObject extends blogPostObject {
  readonly id: string;
  readonly created_at: Date;
}
