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

  async create(createUserDto: CreateUserDto): Promise<User> {
    const required: string[] = [];

    if (!createUserDto.name) {
      required.push('Nome');
    }

    if (!createUserDto.email) {
      required.push('E-mail');
    }

    if (!createUserDto.password) {
      required.push('Senha');
    }

    if (required.length) {
      throw new AppError(
        'Campos obrigatórios',
        400,
        'REQUIRED_FIELDS',
        required,
      );
    }

    // Verifica se ja existe este email
    const userExist = await this.findByEmail(createUserDto.email);

    if (userExist) {
      throw new AppError('E-mail já cadastrado!');
    }

    const repo = this.dataSource.getRepository(User);
    const pass = await this.encryptPassword(createUserDto.password);

    const user = repo.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: pass,
    });

    const result = await repo.save(user);

    return result;
  }

  async findAll() {
    const repo = this.dataSource.getRepository(User);

    return await repo.find({ order: { id: 'DESC' } });
  }

  async findByEmail(email: string) {
    const repo = this.dataSource.getRepository(User);

    return await repo.findOne({ where: { email } });
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
