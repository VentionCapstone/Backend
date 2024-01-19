// @Controller('auth')
// export class GoogleController {
//   constructor(private readonly googleService: GoogleService) {}

// @Get('redirect')
// @UseGuards(AuthGuard('google'))
// async googleAuthRedirect(@Res() res: Response, @CurrentUser() user: any) {
//   const redirectUrl: any = await this.googleService.googleLogin(user);
//   console.log('GoogleController ~ googleAuthRedirect ~ redirectUrl:', redirectUrl);

//   res.redirect(302, redirectUrl);
// }
// }
//
