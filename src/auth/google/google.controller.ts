import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GoogleService } from './google.service';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Res() res: Response, @CurrentUser() user: any) {
    const redirectUrl: any = await this.googleService.googleLogin(user);
    console.log('GoogleController ~ googleAuthRedirect ~ redirectUrl:', redirectUrl);

    res.redirect(302, redirectUrl);
  }
}
