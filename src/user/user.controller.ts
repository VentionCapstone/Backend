import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthUser } from 'src/common/types/AuthUser.type';
import { AdminGuard } from '../common/guards/admin.guard';
import { UserGuard } from '../common/guards/user.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PhoneNumberTransformInterceptor } from './phone-validation/phoneNumberTransform.interceptor';
import { UserService } from './user.service';
import { LangQuery } from 'src/customDecorators/langQuery.decorator';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
