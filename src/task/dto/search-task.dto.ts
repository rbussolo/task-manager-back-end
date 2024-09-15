export class SearchTaskDto {
  page?: number;
  title?: string;
  priority?: string;
  group_id?: number;
  due_date?: Date;
  completed?: boolean;
  order?: '' | 'priority' | 'dueDate';
}
