import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiGoneResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthUser } from 'src/common/types/AuthUser.type';
import { LangQuery } from 'src/customDecorators/langQuery.decorator';
import { CookieOrHeaderGetter } from '../common/decorators/cookie-getter.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserGuard } from '../common/guards/user.guard';
import { AuthService } from './auth.service';
import {
  EmailUpdateDto,
  EmailVerificationDto,
  ForgotPasswordEmailDto,
  ForgotPasswordResetDto,
  LoginDto,
  RegisterDto,
} from './dto';
import { PasswordUpdateDto } from './dto/update-password.dto';
import { GoogleService } from './google/google.service';
import { VerificationSerivce } from './verification.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly verificationService: VerificationSerivce,
    private readonly googleService: GoogleService
  ) {}

  @ApiOperation({ summary: 'Sign up user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully, please check your email to verify your account',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'User created successfully, please check your email to verify your account',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @LangQuery()
  @Post('signup')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Sign in user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in',
    schema: {
      properties: {
        access_token: { type: 'string', example: 'your_access_token_here' },
        refresh_token: { type: 'string', example: 'your_refresh_token_here' },
        id: { type: 'string', example: 'user_id_here' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @HttpCode(200)
  @LangQuery()
  @Post('signin')
  login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(loginDto, res);
  }

  @ApiOperation({ summary: 'Sign out user' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User logged out succesfully' })
  @UseGuards(UserGuard)
  @HttpCode(200)
  @LangQuery()
  @Post('signout')
  signOut(
    @CookieOrHeaderGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.logout(refreshToken, res);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed',
    schema: {
      properties: {
        access_token: { type: 'string', example: 'your_access_token_here' },
        refresh_token: { type: 'string', example: 'your_refresh_token_here' },
        message: { type: 'string', example: 'Tokens have been refreshed successfully' },
      },
    },
  })
  @LangQuery()
  @Get(':id/refresh')
  refreshToken(
    @Param('id') id: string,
    @CookieOrHeaderGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.refreshToken(id, refreshToken, res);
  }

  @ApiOperation({ summary: 'Verify email' })
  @ApiBadRequestResponse({ description: 'Invalid link' })
  @ApiGoneResponse({ description: 'Link expired' })
  @ApiOkResponse({ description: 'Verified Succesfully' })
  @LangQuery()
  @Post('verify')
  verifyEmail(@Body() body: EmailVerificationDto) {
    return this.verificationService.verify(body);
  }

  @ApiOperation({ summary: 'Update email' })
  @ApiBearerAuth()
  @ApiBadRequestResponse({ description: 'Email already verified' })
  @ApiConflictResponse({ description: 'Email already in use' })
  @ApiOkResponse({ description: 'Link sent' })
  @UseGuards(UserGuard)
  @LangQuery()
  @Put('email')
  updateEmail(@Body() body: EmailUpdateDto, @CurrentUser() user: AuthUser) {
    return this.authService.updateEmailRequest(body, user);
  }

  @ApiOperation({ summary: 'Update password' })
  @ApiBearerAuth()
  @ApiBadRequestResponse({ description: 'Invalid old password' })
  @LangQuery()
  @UseGuards(UserGuard)
  @Put('password')
  updatePassword(
    @CurrentUser() user: AuthUser,
    @Body() body: PasswordUpdateDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.updatePassword(user, body, res);
  }

  @ApiOperation({ summary: 'Forgot password email' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @LangQuery()
  @Post('forgot-password-email')
  forgotPasswordEmail(@Body() body: ForgotPasswordEmailDto) {
    return this.authService.forgotPasswordEmail(body);
  }

  @ApiOperation({ summary: 'Forgot password reset' })
  @ApiBadRequestResponse({ description: 'Passwords dont match' })
  @ApiForbiddenResponse({ description: 'Invalid token' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @LangQuery()
  @Patch('forgot-password-reset')
  forgotPasswordReset(@Body() body: ForgotPasswordResetDto) {
    return this.authService.resetForgotPassword(body);
  }

  @Post('google/login')
  async googleAuth(@Body('token') token: string, @Res({ passthrough: true }) res: Response) {
    return await this.googleService.googleLogin(token, res);
  }
}
