export default interface post {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  date: string;
  content: string;
  src_photo?: string;
  tags: string[];
  comments?: string[];
}