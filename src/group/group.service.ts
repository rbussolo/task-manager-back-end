import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AppError } from 'src/errors/AppError';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IUserPayload } from 'src/auth/auth.service';
import { Group } from './entities/group.entity';
import { SuccessfullyUpdated } from 'src/success/SuccessfullyUpdated';
import { SuccessfullyDeleted } from 'src/success/SuccessfullyDeleted';

@Injectable()
export class GroupService {
  @InjectDataSource()
  private dataSource: DataSource;

  async create(
    user: IUserPayload,
    createGroupDto: CreateGroupDto,
  ): Promise<Group> {
    if (!createGroupDto.name) {
      throw new AppError('Necessário informar o Nome do Grupo!');
    } else if (!createGroupDto.icon) {
      throw new AppError('Necessário informar o Icone do Grupo!');
    }

    const repo = this.dataSource.getRepository(Group);

    const group = repo.create({
      ...createGroupDto,
      user_id: user.sub,
    });

    await repo.save(group);

    return group;
  }

  async findAll(user: IUserPayload) {
    const result = await this.dataSource
      .getRepository(Group)
      .find({ where: { user_id: user.sub } });

    if (!result) {
      throw new AppError('Registro não encontrado!', 404);
    }

    return result;
  }

  async findOne(user: IUserPayload, id: number) {
    const result = await this.dataSource
      .getRepository(Group)
      .find({ where: { user_id: user.sub, id: id } });

    if (!result) {
      throw new AppError('Registro não encontrado!', 404);
    }

    return result;
  }

  async update(user: IUserPayload, id: number, updateGroupDto: UpdateGroupDto) {
    const group = this.findOne(user, id);

    if (group instanceof AppError) {
      return group;
    }

    const repo = this.dataSource.getRepository(Group);

    const result = await repo.update(id, {
      ...updateGroupDto,
    });

    if (!result.affected) {
      throw new AppError('Registro não encontrado!');
    }

    return new SuccessfullyUpdated();
  }

  async remove(user: IUserPayload, id: number) {
    const group = this.findOne(user, id);

    if (group instanceof AppError) {
      return group;
    }

    const repo = this.dataSource.getRepository(Group);

    const result = await repo.delete(id);

    if (!result.affected) {
      throw new AppError('Registro não encontrado!');
    }

    return new SuccessfullyDeleted();
  }
}