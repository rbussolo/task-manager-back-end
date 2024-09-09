import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Response } from 'express';

export class LoginRequestBody {
  email: string;
  password: string;
}

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: LoginRequestBody, @Res() response: Response) {
    const authentication = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    response.cookie('auth', authentication.access_token, {
      httpOnly: true,
      maxAge: 7 * 86400,
      path: '/',
    });

    response.cookie('auth-refresh', authentication.refresh_token, {
      httpOnly: true,
      maxAge: 7 * 86400,
      path: '/',
    });

    return response.json({ success: true });
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Request() req, @Res() response: Response) {
    console.log('chamou o refresh');
    console.log(req.cookies);
    console.log('Cookie refresh: ' + req.cookies['auth-refresh']);

    const refresh_token: string | undefined = req.cookies['auth-refresh'];

    const authentication = await this.authService.refresh(refresh_token);

    response.cookie('auth', authentication.access_token, {
      httpOnly: true,
      maxAge: 7 * 86400,
      path: '/',
    });

    response.cookie('auth-refresh', authentication.refresh_token, {
      httpOnly: true,
      maxAge: 7 * 86400,
      path: '/',
    });

    return response.json({ success: true });
  }

  @Post('logout')
  async signOut(@Res() response: Response) {
    response.clearCookie('auth-refresh');
    response.clearCookie('auth');

    return response.json({ success: true });
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
