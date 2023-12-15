import { Body, Controller, Get, HttpCode, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
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

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly verificationService: VerificationSerivce
  ) {}

  @ApiOperation({ summary: 'Sign up user' })
  @ApiResponse({
    status: 201,
    description: `{
    success: true,
    message: 'User created successfully, please check your email to verify your account',
  }`,
  })
  @Post('signup')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Sign in user' })
  @ApiResponse({
    status: 200,
    description: `{
      { access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhODNhMWUzYi1jYWE1LTQxNDUtYjk0NS0wNDdiZjZhNWI3NjciLCJlbWFpbCI6InNoYWhyb3pndWxsaWV2QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzAyNDcwOTI4LCJleHAiOjE3MDI0NzI3Mjh9.hLjM_RsmqJHH1QOfl9dCfg6CUzuD7lUwyvOoFHepxpM",
        refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhODNhMWUzYi1jYWE1LTQxNDUtYjk0NS0wNDdiZjZhNWI3NjciLCJlbWFpbCI6InNoYWhyb3pndWxsaWV2QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzAyNDcwOTI4LCJleHAiOjE3MDI0NzI3Mjh9.hLjM_RsmqJHH1QOfl9dCfg6CUzuD7lUwyvOoFHepxpM",
      }, id: "ce155ff3-5a38-412f-a7cb-328ef7cab68b"
    }`,
  })
  @HttpCode(200)
  @Post('signin')
  login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(loginDto, res);
  }

  @ApiOperation({ summary: 'Sign out user' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User logged out succesfully' })
  @UseGuards(UserGuard)
  @HttpCode(200)
  @Post('signout')
  signOut(
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.logout(refreshToken, res);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: `{
      { access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhODNhMWUzYi1jYWE1LTQxNDUtYjk0NS0wNDdiZjZhNWI3NjciLCJlbWFpbCI6InNoYWhyb3pndWxsaWV2QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzAyNDcwOTI4LCJleHAiOjE3MDI0NzI3Mjh9.hLjM_RsmqJHH1QOfl9dCfg6CUzuD7lUwyvOoFHepxpM",
      refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhODNhMWUzYi1jYWE1LTQxNDUtYjk0NS0wNDdiZjZhNWI3NjciLCJlbWFpbCI6InNoYWhyb3pndWxsaWV2QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzAyNDcwOTI4LCJleHAiOjE3MDI0NzI3Mjh9.hLjM_RsmqJHH1QOfl9dCfg6CUzuD7lUwyvOoFHepxpM",
    },
    message: 'Tokens have been refreshed successfully',
  }`,
  })
  @Get(':id/refresh')
  refreshToken(
    @Param('id') id: string,
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.refreshToken(id, refreshToken, res);
  }

  @ApiOperation({ summary: 'Verify email' })
  @ApiBadRequestResponse({ description: 'Invalid link' })
  @ApiGoneResponse({ description: 'Link expired' })
  @ApiOkResponse({ description: 'Verified Succesfully' })
  @Post('verify')
  verifyEmail(@Body() body: EmailVerificationDto) {
    return this.verificationService.verify(body);
  }

  @ApiOperation({ summary: 'Update email request' })
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
