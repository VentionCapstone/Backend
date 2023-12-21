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
import { CurrentUserType } from 'src/common/types/CurrentUser.type';
import { AdminGuard } from '../common/guards/admin.guard';
import { UserGuard } from '../common/guards/user.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PhoneNumberTransformInterceptor } from './phone-validation/phoneNumberTransform.interceptor';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('USER')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'GET ALL USERS' })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'GET USER BY ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'GET USER PROFILE BY ID' })
  @ApiParam({ name: 'id', description: 'User profile ID' })
  @Get('profile/:id')
  getUserProfile(@Param('id') id: string) {
    return this.userService.getUserProfile(id);
  }

  @UseGuards(UserGuard)
  @UseInterceptors(PhoneNumberTransformInterceptor)
  @ApiOperation({ summary: 'CREATE USER PROFILE' })
  @Post('profile')
  createProfile(@Body() createUserDto: CreateUserDto, @CurrentUser() user: CurrentUserType) {
    return this.userService.createUserProfile(createUserDto, user);
  }

  @UseGuards(UserGuard)
  @UseInterceptors(PhoneNumberTransformInterceptor)
  @ApiOperation({ summary: 'UPDATE USER PROFILE BY ID' })
  @ApiParam({ name: 'id', description: 'User profile ID' })
  @Patch('profile/:id')
  updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: CurrentUserType
  ) {
    return this.userService.updateUserProfile(id, updateUserDto, user);
  }

  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'DELETE USER PROFILE BY ID' })
  @Delete('profile/:id')
  removeProfile(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    return this.userService.removeUserProfile(id, user);
  }
}
