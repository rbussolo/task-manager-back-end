import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppError } from 'src/errors/AppError';
import { User } from './entities/user.entity';
import * as bcryptjs from 'bcryptjs';
import { IUserPayload } from 'src/auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SuccessfullyUpdated } from 'src/success/SuccessfullyUpdated';

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

  async update(user: IUserPayload, updateUserDto: UpdateUserDto): Promise<SuccessfullyUpdated> {
    const required: string[] = [];

    if (!updateUserDto.name) {
      required.push('Nome');
    }

    if (!updateUserDto.email) {
      required.push('E-mail');
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
    const userExist = await this.findByEmail(updateUserDto.email);

    if (userExist && userExist.id !== user.sub) {
      throw new AppError('E-mail já cadastrado!');
    }

    const repo = this.dataSource.getRepository(User);
    const id = user.sub
    
    const result = await repo.update(id, {
      ...updateUserDto
    });

    if (!result.affected) {
      throw new AppError('Registro não encontrado!');
    }

    return new SuccessfullyUpdated();
  }

  async updatePhoto(user: IUserPayload, file: Express.Multer.File): Promise<SuccessfullyUpdated> {
    const repo = this.dataSource.getRepository(User);
    const id = user.sub
    
    const result = await repo.update(id, {
      urlImage: file.path
    });

    if (!result.affected) {
      throw new AppError('Registro não encontrado!');
    }

    return new SuccessfullyUpdated();
  }

  async findOne(user: IUserPayload) {
    const repo = this.dataSource.getRepository(User);

    const result = await repo.findOne({ where: { id: user.sub } });

    if (!result) {
      throw new AppError('Registro não encontrado!', 404);
    }

    delete result['password'];
    return result;
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
