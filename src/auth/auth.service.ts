import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AppError } from 'src/errors/AppError';

export interface IUserPayload {
  sub: number;
  login: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(login: string, pass: string): Promise<any> {
    if (!login) {
      throw new AppError('Necessário informar o LOGIN!');
    } else if (!pass) {
      throw new AppError('Necessário informar a SENHA!');
    }

    let user = await this.userService.findByLogin(login);

    if (!user) {
      await this.userService.create({ login, password: pass });

      user = await this.userService.findByLogin(login);
    }

    const passwordIsCorrect = await this.userService.comparePassword(
      pass,
      user?.password,
    );

    if (!passwordIsCorrect) {
      throw new AppError('Login / Senha incorretos!');
    }

    const payload: IUserPayload = { sub: user.id, login: user.login };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
