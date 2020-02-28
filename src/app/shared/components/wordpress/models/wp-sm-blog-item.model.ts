export interface WpSmBlogItemModel {
  title: string;
  content: string;
  imageUrl?: string;
  fullArticleUrl: string;
  author?: {
    name: string;
    link: string;
  }
  modified: Date;
  displayStatus?: boolean;
}
