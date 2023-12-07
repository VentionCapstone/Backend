import { Body, Controller, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailUpdateDto, EmailVerificationDto, LoginDto, RegisterDto } from './dto';
import { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiGoneResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CookieGetter } from '../common/decorators/cookie-getter.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserGuard } from '../common/guards/user.guard';
import { VerificationSerivce } from './verification.service';
import { User } from '@prisma/client';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly verificationService: VerificationSerivce
  ) {}

  @ApiOperation({ summary: 'SIGN UP USER' })
  @ApiResponse({ status: 201, description: 'link sent' })
  @Post('signup')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'SIGN IN USER' })
  @ApiResponse({ status: 200, description: 'tokens' })
  @Post('signin')
  login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(loginDto, res);
  }

  @ApiOperation({ summary: 'SIGN OUT USER' })
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Refresh Tokens' })
  @Get(':id/refresh')
  refreshToken(
    @Param('id') id: string,
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.refreshToken(id, refreshToken, res);
  }

  @ApiOperation({ summary: 'VERIFY EMAIL' })
  @ApiBadRequestResponse({ description: 'Invalid link' })
  @ApiGoneResponse({ description: 'Link expired' })
  @ApiOkResponse({ description: 'Verified Succesfully' })
  @Post('verify')
  verifyEmail(@Body() body: EmailVerificationDto) {
    return this.verificationService.verify(body);
  }

  @ApiOperation({ summary: 'UPDATE EMAIL REQUEST' })
  @ApiBearerAuth()
  @ApiBadRequestResponse({ description: 'Email already verified' })
  @ApiConflictResponse({ description: 'Email already in use' })
  @ApiOkResponse({ description: 'Link sent' })
  @UseGuards(UserGuard)
  @Put('email')
  updateEmail(@Body() body: EmailUpdateDto, @CurrentUser() user: User) {
    return this.authService.updateEmailRequest(body, user);
  }
}
