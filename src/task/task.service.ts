import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Task } from './entities/task.entity';
import { AppError } from 'src/errors/AppError';
import { SuccessfullyUpdated } from 'src/success/SuccessfullyUpdated';
import { SuccessfullyDeleted } from 'src/success/SuccessfullyDeleted';

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

  async findAll() {
    const repo = this.dataSource.getRepository(Task);

    return await repo.find();
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

  async remove(id: number) {
    const repo = this.dataSource.getRepository(Task);

    const result = await repo.delete(id);

    if (!result.affected) {
      throw new AppError('Registro não encontrado!');
    }

    return new SuccessfullyDeleted();
  }
}
