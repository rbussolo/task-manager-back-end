import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';
import { User } from 'src/user/user.decorator';
import { IUserPayload } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('/api')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AuthGuard)
  @Post('/task')
  create(@Body() createTaskDto: CreateTaskDto, @User() user: IUserPayload) {
    return this.taskService.create(user, createTaskDto);
  }

  @UseGuards(AuthGuard)
  @Get('/tasks')
  findAll(@Query() searchTaskDto: SearchTaskDto, @User() user: IUserPayload) {
    return this.taskService.findAll(user, searchTaskDto);
  }

  @UseGuards(AuthGuard)
  @Get('/tasks/amount')
  tasksAmount(@User() user: IUserPayload) {
    return this.taskService.tasksAmount(user);
  }

  @UseGuards(AuthGuard)
  @Get('/task/:id')
  findOne(@Param('id') id: string, @User() user: IUserPayload) {
    return this.taskService.findOne(user, +id);
  }

  @UseGuards(AuthGuard)
  @Patch('/task/:id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @User() user: IUserPayload,
  ) {
    return this.taskService.update(user, +id, updateTaskDto);
  }

  @UseGuards(AuthGuard)
  @Patch('/task/:id/completed')
  completeTask(@Param('id') id: string, @User() user: IUserPayload) {
    return this.taskService.completeTask(user, +id);
  }

  @UseGuards(AuthGuard)
  @Delete('/task/:id')
  remove(@Param('id') id: string, @User() user: IUserPayload) {
    return this.taskService.remove(user, +id);
  }
}
