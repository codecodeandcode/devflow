interface QuestionCardProps {
  _id: number;
  title: string;
  content: string;
  tags: Tags[];
  author: Author;
  date: Date;
  upvotes: number;
  answers: number;
  view: number;
}

interface Tags {
  _id: string;
  name: string[];
}

interface Author {
  _id: string;
  name: string;
  image: string;
}
