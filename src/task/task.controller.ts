import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';

@Controller('/api')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('/task')
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get('/tasks')
  findAll(@Query() searchTaskDto: SearchTaskDto) {
    return this.taskService.findAll(searchTaskDto);
  }

  @Get('/task/:id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch('/task/:id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Patch('/task/:id/completed')
  completeTask(@Param('id') id: string) {
    return this.taskService.completeTask(+id);
  }

  @Delete('/task/:id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
