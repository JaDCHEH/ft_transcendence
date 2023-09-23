import { Body, Controller, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import {twoFacVerifyDTO, validate2faDTO } from './dto/auth.dto';
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('42'))
  async signin(@Req() req) {}

  @Get('auth/redirect')
  @UseGuards(AuthGuard('42'))
  async signinRedired(@Req() req, @Res({ passthrough: true }) res) {
    const user = await this.authService.signup(req.user);
    const token = await this.authService.asignJwtToken(user.username, user.email);
    res.cookie('token', token);
    res.redirect('http://localhost:5173/home');
  }

  @Get('2fa')
  @UseGuards(AuthGuard('jwt'))
  async add2fa(@Req() req, @Res() res: Response) {
    return this.authService.add2fa(req.user, res);
  }

  @Put('2fa/verify')
  @UseGuards(AuthGuard('jwt'))
  async verify2fa(@Body() body: twoFacVerifyDTO, @Req() req) {
    return this.authService.verify2fa(body, req.user);
  }

  @Put('2fa/validate')
  @UseGuards(AuthGuard('jwt'))
  async validate2fa(@Body() body: validate2faDTO, @Req() req) {
    return this.authService.validate2fa(body,req.user);
  }

  @Put('2fa/disable')
  @UseGuards(AuthGuard('jwt'))
  async disable2fa(@Body() body: twoFacVerifyDTO, @Req() req) {
    return this.authService.disable2fa(body,req.user);
  }

  @Get('logout')
  @UseGuards(AuthGuard('jwt'))
  logout(@Res({ passthrough: true }) res : Response) {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
  }
}
