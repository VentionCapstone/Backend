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
import { User } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AdminGuard } from '../common/guards/admin.guard';
import { UserGuard } from '../common/guards/user.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PhoneNumberTransformInterceptor } from './phone-validation/phoneNumberTransform.interceptor';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all users' })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Get user profile by id' })
  @ApiParam({ name: 'id', description: 'User profile ID' })
  @Get('profile/:id')
  getUserProfile(@Param('id') id: string) {
    return this.userService.getUserProfile(id);
  }

  @UseGuards(UserGuard)
  @UseInterceptors(PhoneNumberTransformInterceptor)
  @ApiOperation({ summary: 'CREATE USER PROFILE' })
  @Post('profile')
  createProfile(@Body() createUserDto: CreateUserDto, @CurrentUser() user: User) {
    return this.userService.createUserProfile(createUserDto, user);
  }

  @UseGuards(UserGuard)
  @UseInterceptors(PhoneNumberTransformInterceptor)
  @ApiOperation({ summary: 'UPDATE USER PROFILE BY ID' })
  @ApiParam({ name: 'id', description: 'User profile ID' })
  @Patch('/:id')
  updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User
  ) {
    return this.userService.updateUserProfile(id, updateUserDto, user);
  }

  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Delete user profile by id' })
  @Delete('/:id')
  removeProfile(@Param('id') id: string, @CurrentUser() user: User) {
    return this.userService.removeUserProfile(id, user);
  }
}
