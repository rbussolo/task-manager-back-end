export class SearchTaskDto {
  page?: number;
  title?: string;
  priority?: string;
  group_id?: number;
  group_slug?: string;
  due_date?: Date;
  completed?: boolean;
  important?: boolean;
  order?: '' | 'priority' | 'dueDate';
}
