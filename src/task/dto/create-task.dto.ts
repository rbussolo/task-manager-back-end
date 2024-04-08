export class CreateTaskDto {
  title: string;
  description?: string;
  priority?: string;
  category?: string;
  dueDate?: Date;
}
