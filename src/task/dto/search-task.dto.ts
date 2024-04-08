export class SearchTaskDto {
  title?: string;
  description?: string;
  priority?: string;
  category?: string;
  dueDate?: Date;
  order?: '' | 'priority' | 'category' | 'dueDate';
}
