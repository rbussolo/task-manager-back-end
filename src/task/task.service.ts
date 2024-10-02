import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { Task, TaskPriority } from './entities/task.entity';
import { AppError } from 'src/errors/AppError';
import { SuccessfullyUpdated } from 'src/success/SuccessfullyUpdated';
import { SuccessfullyDeleted } from 'src/success/SuccessfullyDeleted';
import { SearchTaskDto } from './dto/search-task.dto';
import { IUserPayload } from 'src/auth/auth.service';

export interface GroupAmount {
  group_id: number;
  amount: number;
}

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

    const tasks = await repo.find({
      where: { user_id: user.sub, completed: false },
    });

    const groups: GroupAmount[] = [];

    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].group_id > 0) {
        const index = groups.findIndex(
          (group) => tasks[i].group_id === group.group_id,
        );

        if (index < 0) {
          groups.push({ group_id: tasks[i].group_id, amount: 1 });
        } else {
          groups[index].amount += 1;
        }
      }
    }

    return {
      amount: tasks.length,
      amountImportant: tasks.filter(
        (task) => task.priority === TaskPriority.High,
      ).length,
      amountPlanned: 0,
      groups: groups,
    };
  }

  async findAll(user: IUserPayload, searchTaskDto: SearchTaskDto) {
    const repo = this.dataSource.getRepository(Task);

    const queryBuilder: SelectQueryBuilder<Task> = repo
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.group', 'g')
      .where('t.user_id = :user_id', { user_id: user.sub });

    if (searchTaskDto.title) {
      queryBuilder.andWhere('t.title like :title', {
        title: '%' + searchTaskDto.title + '%',
      });
    }

    if (searchTaskDto.priority) {
      queryBuilder.andWhere('t.priority = :priority', {
        priority: searchTaskDto.priority,
      });
    }

    if (searchTaskDto.due_date) {
      queryBuilder.andWhere('t.due_date = :due_date', {
        due_date: new Date(searchTaskDto.due_date),
      });
    }

    if (searchTaskDto.completed) {
      queryBuilder.andWhere('t.completed = :completed', {
        completed: searchTaskDto.completed,
      });
    }

    if (searchTaskDto.important) {
      queryBuilder.andWhere('t.priority = :important', {
        important: 'Alta',
      });
    }

    if (searchTaskDto.group_id) {
      queryBuilder.andWhere('t.group_id = :group_id', {
        group_id: searchTaskDto.group_id,
      });
    }

    if (searchTaskDto.group_slug) {
      queryBuilder.andWhere('g.slug = :group_slug', {
        group_slug: searchTaskDto.group_slug,
      });
    }

    if (searchTaskDto.order === 'priority') {
      queryBuilder.orderBy('t.priority', 'DESC');
    } else if (searchTaskDto.order === 'dueDate') {
      queryBuilder.orderBy('t.due_date', 'DESC');
    } else if (searchTaskDto.completed) {
      queryBuilder.orderBy('t.completed_date', 'DESC');
    } else {
      queryBuilder.orderBy('t.due_date', 'ASC');
    }

    const result = await queryBuilder.getMany();

    return result;
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

    if (task.completed) {
      throw new AppError('Tarefa já foi concluída!');
    }

    task.completed = true;
    task.completed_date = new Date();

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
