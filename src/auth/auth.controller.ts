import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailVerificationDto, LoginDto, RegisterDto } from './dto';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CookieGetter } from '../common/decorators/cookie-getter.decorator';
import { UserGuard } from '../common/guards/user.guard';
import { VerificationSerivce } from './verification.service';

@ApiTags('USER')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly verificationService: VerificationSerivce
  ) {}

  @ApiOperation({ summary: 'SIGN UP USER' })
  @ApiResponse({ status: 201, description: 'tokens' })
  @Post('signup')
  register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.register(registerDto, res);
  }

  @ApiOperation({ summary: 'SIGN IN USER' })
  @ApiResponse({ status: 200, description: 'tokens' })
  @Post('signin')
  login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(loginDto, res);
  }

  @ApiOperation({ summary: 'SIGN OUT USER' })
  @ApiResponse({ status: 200, description: 'Message: User Logged Out Succesfully' })
  @UseGuards()
  @Post('signout')
  signOut(
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.logout(refreshToken, res);
  }

  @ApiOperation({ summary: 'REFRESH TOKEN' })
  @ApiResponse({ status: 200, description: 'Refresh Tokens' })
  @UseGuards(UserGuard)
  @Get(':id/refresh')
  refreshToken(
    @Param('id') id: string,
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.refreshToken(id, refreshToken, res);
  }

  @ApiOperation({ summary: 'VERIFY EMAIL' })
  @ApiResponse({ status: 200, description: 'Email Verified Succesfully' })
  @Post('verify')
  verifyEmail(@Body() body: EmailVerificationDto) {
    return this.verificationService.verify(body);
  }
}
