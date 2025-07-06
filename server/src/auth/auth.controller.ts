/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { signupDto } from './dto/signup.dto';
import { Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: signupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: loginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService
      .validateUser(dto.email, dto.password)
      .then((user) => {
        if (!user) return 'Invalid creds';
        const token = this.authService.login(user);
        res.cookie('access_token', token.access_token, {
          httpOnly: true, // Can't access via JS
          secure: false, // Set to true in production (HTTPS)
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return { message: 'Login successful' };
      });
  }
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out' };
  }
}
