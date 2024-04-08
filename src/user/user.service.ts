import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppError } from 'src/errors/AppError';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  @InjectDataSource()
  private dataSource: DataSource;

  async create(createUserDto: CreateUserDto) {
    if (!createUserDto.login) {
      throw new AppError('Necessário informar um Login');
    } else if (!createUserDto.password) {
      throw new AppError('Necessário informar a Senha');
    }

    const repo = this.dataSource.getRepository(User);
    const pass = await this.encryptPassword(createUserDto.password);

    const user = repo.create({
      login: createUserDto.login,
      password: pass,
    });
    console.log('Antes');

    await repo.save(user);

    return user;
  }

  async findAll() {
    const repo = this.dataSource.getRepository(User);

    return await repo.find({ order: { id: 'DESC' } });
  }

  async findByLogin(login: string) {
    const repo = this.dataSource.getRepository(User);

    return await repo.findOne({ where: { login } });
  }

  async encryptPassword(pass: string) {
    const saltRounds = 10;
    const password = await bcrypt.hash(pass, saltRounds);

    return password;
  }

  async comparePassword(passwordJustText: string, passwordDatabase: string) {
    if (!passwordJustText) return false;
    if (!passwordDatabase) return false;

    return await bcrypt.compare(passwordJustText, passwordDatabase);
  }
}
