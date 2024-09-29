import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AppError } from 'src/errors/AppError';

export interface IUserPayload {
  sub: number;
  email: string;
}

export interface SignInResponse {
  refresh_token: string;
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
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: '2m',
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: '60m',
    });

    return { refresh_token, access_token };
  }

  async refresh(token: string | undefined): Promise<SignInResponse> {
    if (!token) {
      throw new AppError('Token not found!');
    }

    try {
      const payload: IUserPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      delete payload['iat'];
      delete payload['exp'];

      const access_token = await this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: '2m',
      });
      const refresh_token = await this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: '60m',
      });

      return { refresh_token, access_token };
    } catch (e) {
      throw new AppError('Error creating tokens!');
    }
  }
}
