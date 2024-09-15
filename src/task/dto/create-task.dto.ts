export class CreateTaskDto {
  title: string;
  description?: string;
  priority?: string;
  group_id?: number | undefined;
  due_date?: Date;
}
