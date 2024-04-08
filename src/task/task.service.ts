import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, FindOptionsOrder, FindOptionsWhere, ILike } from 'typeorm';
import { Task } from './entities/task.entity';
import { AppError } from 'src/errors/AppError';
import { SuccessfullyUpdated } from 'src/success/SuccessfullyUpdated';
import { SuccessfullyDeleted } from 'src/success/SuccessfullyDeleted';
import { SearchTaskDto } from './dto/search-task.dto';

@Injectable()
export class TaskService {
  @InjectDataSource()
  private dataSource: DataSource;

  async create(createTaskDto: CreateTaskDto) {
    if (!createTaskDto.title) {
      throw new AppError('Necessário informar o Título da Tarefa!');
    }

    const repo = this.dataSource.getRepository(Task);

    const task = repo.create({
      ...createTaskDto,
      completed: false,
    });

    await repo.save(task);

    return task;
  }

  async findAll(searchTaskDto: SearchTaskDto) {
    const repo = this.dataSource.getRepository(Task);

    const where: FindOptionsWhere<Task>[] = [];

    if (searchTaskDto.title) {
      where.push({ title: ILike(`%${searchTaskDto.title}%`) });
    }

    if (searchTaskDto.description) {
      where.push({ description: ILike(`%${searchTaskDto.description}%`) });
    }

    if (searchTaskDto.priority) {
      where.push({ priority: searchTaskDto.priority });
    }

    if (searchTaskDto.category) {
      where.push({ priority: searchTaskDto.category });
    }

    if (searchTaskDto.dueDate) {
      where.push({ dueDate: new Date(searchTaskDto.dueDate) });
    }

    const order: FindOptionsOrder<Task> =
      searchTaskDto.order === 'priority'
        ? { priority: 'DESC' }
        : searchTaskDto.order === 'category'
          ? { category: 'DESC' }
          : searchTaskDto.order === 'dueDate'
            ? { dueDate: 'DESC' }
            : { id: 'DESC' };

    return await repo.find({ order: order, where: where });
  }

  async findOne(id: number) {
    const repo = this.dataSource.getRepository(Task);

    const result = await repo.findOne({ where: { id } });

    if (!result) {
      throw new AppError('Registro não encontrado!', 404);
    }

    return result;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const repo = this.dataSource.getRepository(Task);

    const result = await repo.update(id, {
      ...updateTaskDto,
    });

    if (!result.affected) {
      throw new AppError('Registro não encontrado!');
    }

    return new SuccessfullyUpdated();
  }

  async completeTask(id: number) {
    const repo = this.dataSource.getRepository(Task);
    const task = await repo.findOne({ where: { id } });

    if (!task) {
      throw new AppError('Registro não encontrado!', 404);
    }

    task.completed = !task.completed;

    await repo.save(task);

    return new SuccessfullyUpdated();
  }

  async remove(id: number) {
    const repo = this.dataSource.getRepository(Task);

    const result = await repo.delete(id);

    if (!result.affected) {
      throw new AppError('Registro não encontrado!');
    }

    return new SuccessfullyDeleted();
  }
}
