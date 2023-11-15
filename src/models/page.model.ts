export interface pagePostObject {
  page_name: string;
  page_content: string;
  meta_data_title: string;
  meta_data_description: string;
  page_url: string;
}

export type updatePageObject = Partial<pagePostObject>;

export interface pageObject extends pagePostObject {
  readonly id: string;
  readonly created_at: Date;
}
