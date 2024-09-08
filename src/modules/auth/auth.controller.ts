import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgotPassword')
  async forgotPassword(@Body() body) {
    return this.authService.forgetPassword(body.email);
  }

  @Post('verifyResetCode')
  async verifyResetCode(@Body() body) {
    return this.authService.verifyResetCode(body.resetCode);
  }

  @Post('resetPassword')
  async resetPassword(@Body() body) {
    return this.authService.resetPassword(body);
  }
}
