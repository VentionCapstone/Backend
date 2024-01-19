import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthUser } from 'src/common/types/AuthUser.type';
import { LangQuery } from 'src/customDecorators/langQuery.decorator';
import { AdminGuard } from '../common/guards/admin.guard';
import { UserGuard } from '../common/guards/user.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { HostReviewsDto, HostUserDto } from './dto/host-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HostService } from './host.service';
import { PhoneNumberTransformInterceptor } from './phone-validation/phoneNumberTransform.interceptor';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly hostService: HostService
  ) {}

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all users' })
  @LangQuery()
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'User id' })
  @LangQuery()
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Get user profile by id' })
  @ApiParam({ name: 'id', description: 'User profile id' })
  @LangQuery()
  @Get('profile/:id')
  getUserProfile(@Param('id') id: string) {
    return this.userService.getUserProfile(id);
  }

  @UseGuards(UserGuard)
  @UseInterceptors(PhoneNumberTransformInterceptor)
  @ApiOperation({ summary: 'Create user profile' })
  @LangQuery()
  @Post('profile')
  createProfile(@Body() createUserDto: CreateUserDto, @CurrentUser() user: AuthUser) {
    return this.userService.createUserProfile(createUserDto, user);
  }

  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Add profile image' })
  @LangQuery()
  @Post(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  addImageToProfile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      })
    )
    file: Express.Multer.File,
    @Param('id') id: string,
    @CurrentUser('id') userId: string
  ) {
    return this.userService.addProfileImage(id, userId, file);
  }

  @UseGuards(UserGuard)
  @UseInterceptors(PhoneNumberTransformInterceptor)
  @ApiOperation({ summary: 'Update user profile id' })
  @ApiParam({ name: 'id', description: 'User profile id' })
  @Patch('/:id')
  @LangQuery()
  updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: AuthUser
  ) {
    return this.userService.updateUserProfile(id, updateUserDto, user);
  }

  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Delete user profile by id' })
  @Delete('/:id')
  @LangQuery()
  removeProfile(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.userService.removeUserProfile(id, user);
  }

  @ApiOperation({ summary: 'Get host by id' })
  @ApiParam({ name: 'id', description: 'Host id' })
  @ApiOkResponse({ description: 'Returns host user with details', type: HostUserDto })
  @ApiBadRequestResponse({ description: 'Not a host profile' })
  @ApiNotFoundResponse({ description: 'Host profile not found' })
  @LangQuery()
  @Get('/host/:id')
  getHostUserProfile(@Param('id') id: string) {
    return this.hostService.getHostUserProfile(id);
  }

  @ApiOperation({ summary: 'Get host comment by page' })
  @ApiParam({ name: 'id', description: 'Host id' })
  @ApiQuery({ name: 'page', description: 'Page number' })
  @ApiOkResponse({ description: 'Returns host reviews', type: HostReviewsDto })
  @LangQuery()
  @Get('/host/:id/comments')
  getHostComments(@Param('id') id: string, @Query('page') page: number) {
    return this.hostService.getHostComments(id, page);
  }
}
