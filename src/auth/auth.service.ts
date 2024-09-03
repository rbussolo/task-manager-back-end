import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AppError } from 'src/errors/AppError';

export interface IUserPayload {
  sub: number;
  email: string;
}

export interface SignInResponse {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<SignInResponse> {
    if (!email || !pass) {
      throw new AppError('É necessário informar o e-mail e senha!');
    }

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new AppError('Credenciais inválidas!');
    }

    const passwordIsCorrect = await this.userService.comparePassword(
      pass,
      user.password,
    );

    if (!passwordIsCorrect) {
      throw new AppError('Credenciais inválidas!');
    }

    const payload: IUserPayload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }
}
