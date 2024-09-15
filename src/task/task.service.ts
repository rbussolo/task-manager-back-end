import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, FindOptionsOrder, FindOptionsWhere, ILike } from 'typeorm';
import { Task, TaskPriority } from './entities/task.entity';
import { AppError } from 'src/errors/AppError';
import { SuccessfullyUpdated } from 'src/success/SuccessfullyUpdated';
import { SuccessfullyDeleted } from 'src/success/SuccessfullyDeleted';
import { SearchTaskDto } from './dto/search-task.dto';
import { IUserPayload } from 'src/auth/auth.service';

@Injectable()
export class TaskService {
  @InjectDataSource()
  private dataSource: DataSource;

  async create(user: IUserPayload, createTaskDto: CreateTaskDto) {
    if (!createTaskDto.title) {
      throw new AppError('É necessário informar o Título da Tarefa!');
    }

    const repo = this.dataSource.getRepository(Task);

    const task = repo.create({
      ...createTaskDto,
      completed: false,
      user_id: user.sub,
    });

    await repo.save(task);

    return task;
  }

  async tasksAmount(user: IUserPayload) {
    const repo = this.dataSource.getRepository(Task);

    const tasks = await repo.find({ where: { user_id: user.sub } });

    return {
      amount: tasks.length,
      amountImportant: tasks.filter(
        (task) => task.priority === TaskPriority.High,
      ).length,
      amounPlanned: 0,
      tags: [],
    };
  }

  async findAll(user: IUserPayload, searchTaskDto: SearchTaskDto) {
    const repo = this.dataSource.getRepository(Task);

    const where: FindOptionsWhere<Task>[] = [];

    if (searchTaskDto.title) {
      where.push({ title: ILike(`%${searchTaskDto.title}%`) });
    }

    if (searchTaskDto.priority) {
      where.push({ priority: searchTaskDto.priority });
    }

    if (searchTaskDto.due_date) {
      where.push({ due_date: new Date(searchTaskDto.due_date) });
    }

    if (searchTaskDto.completed) {
      where.push({ completed: searchTaskDto.completed });
    }

    if (searchTaskDto.group_id) {
      where.push({ group_id: searchTaskDto.group_id });
    }

    where.push({ user_id: user.sub });

    const order: FindOptionsOrder<Task> =
      searchTaskDto.order === 'priority'
        ? { priority: 'DESC' }
        : searchTaskDto.order === 'dueDate'
          ? { due_date: 'DESC' }
          : { id: 'DESC' };

    return await repo.find({ order: order, where: where });
  }

  async findOne(user: IUserPayload, id: number) {
    const repo = this.dataSource.getRepository(Task);

    const result = await repo.findOne({ where: { id, user_id: user.sub } });

    if (!result) {
      throw new AppError('Registro não encontrado!', 404);
    }

    return result;
  }

  async update(user: IUserPayload, id: number, updateTaskDto: UpdateTaskDto) {
    const task = this.findOne(user, id);

    if (task instanceof AppError) {
      return task;
    }

    const repo = this.dataSource.getRepository(Task);

    const result = await repo.update(id, {
      ...updateTaskDto,
    });

    if (!result.affected) {
      throw new AppError('Registro não encontrado!');
    }

    return new SuccessfullyUpdated();
  }

  async completeTask(user: IUserPayload, id: number) {
    const repo = this.dataSource.getRepository(Task);
    const task = await repo.findOne({ where: { id, user_id: user.sub } });

    if (!task) {
      throw new AppError('Registro não encontrado!', 404);
    }

    task.completed = !task.completed;

    await repo.save(task);

    return new SuccessfullyUpdated();
  }

  async remove(user: IUserPayload, id: number) {
    const task = this.findOne(user, id);

    if (task instanceof AppError) {
      return task;
    }

    const repo = this.dataSource.getRepository(Task);

    const result = await repo.delete(id);

    if (!result.affected) {
      throw new AppError('Registro não encontrado!');
    }

    return new SuccessfullyDeleted();
  }
}
