import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AppError } from 'src/errors/AppError';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IUserPayload } from 'src/auth/auth.service';
import { Group } from './entities/group.entity';
import { SuccessfullyDeleted } from 'src/success/SuccessfullyDeleted';
import { ChagePositionGroup } from './dto/change-position-group.dto';

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
    const slug = this.generateSlugFromName(createGroupDto.name);
    const amountOfGroup = await this.amount(user);

    const group = repo.create({
      ...createGroupDto,
      slug: slug,
      amount: 0,
      position: amountOfGroup + 1,
      user_id: user.sub,
    });

    await repo.save(group);

    return group;
  }

  async findAll(user: IUserPayload) {
    const result = await this.dataSource
      .getRepository(Group)
      .find({ where: { user_id: user.sub }, order: { position: 'ASC' } });

    if (!result) {
      throw new AppError('Registro não encontrado!', 404);
    }

    return result;
  }

  async amount(user: IUserPayload) {
    const result = await this.dataSource
      .getRepository(Group)
      .count({ where: { user_id: user.sub } });

    return result || 0;
  }

  async findOne(user: IUserPayload, id: number) {
    const result = await this.dataSource
      .getRepository(Group)
      .findOne({ where: { user_id: user.sub, id: id } });

    if (!result) {
      throw new AppError('Registro não encontrado!', 404);
    }

    return result;
  }

  async update(user: IUserPayload, id: number, updateGroupDto: UpdateGroupDto) {
    const group = await this.findOne(user, id);

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

    return { ...group, ...updateGroupDto };
  }

  async changePosition(
    user: IUserPayload,
    positionGroupDto: ChagePositionGroup,
  ) {
    console.log(positionGroupDto);

    const g1 = await this.findOne(user, positionGroupDto.g1Id);
    const g2 = await this.findOne(user, positionGroupDto.g2Id);

    if (g1 instanceof AppError) {
      return g1;
    }

    if (g2 instanceof AppError) {
      return g2;
    }

    if (
      g1.position !== positionGroupDto.g2Position ||
      g2.position !== positionGroupDto.g1Position
    ) {
      return new AppError('Nova posição inválida!');
    }

    const repo = this.dataSource.getRepository(Group);

    const r1 = await repo.update(g1.id, {
      position: positionGroupDto.g1Position,
    });

    if (!r1.affected) {
      throw new AppError('Registro não encontrado!');
    }

    const r2 = await repo.update(g2.id, {
      position: positionGroupDto.g2Position,
    });

    if (!r2.affected) {
      throw new AppError('Registro não encontrado!');
    }

    return { success: true };
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

  generateSlugFromName(name: string): string {
    let slug = name.replace(/^\s+|\s+$/g, ''); // trim
    slug = slug.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
    const to = 'aaaaeeeeiiiioooouuuunc------';

    for (let i = 0, l = from.length; i < l; i++) {
      slug = slug.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    slug = slug
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return slug;
  }
}
