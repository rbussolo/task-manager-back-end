import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppError } from 'src/errors/AppError';
import { User } from './entities/user.entity';
import * as bcryptjs from 'bcryptjs';

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
    const password = await bcryptjs.hash(pass, saltRounds);

    return password;
  }

  async comparePassword(passwordJustText: string, passwordDatabase: string) {
    if (!passwordJustText) return false;
    if (!passwordDatabase) return false;

    return await bcryptjs.compare(passwordJustText, passwordDatabase);
  }
}
