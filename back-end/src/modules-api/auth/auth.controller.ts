import { Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return {
      status: true,
      message: 'Đăng ký thành công',
      data: user,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const token = await this.authService.login(dto);
    return {
      status: true,
      message: 'Đăng nhập thành công',
      data: token,
    };
  }
}
