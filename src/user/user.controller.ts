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
@ApiTags('USER')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'GET ALL USERS' })
  @LangQuery()
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'GET USER BY ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @LangQuery()
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'GET USER PROFILE BY ID' })
  @ApiParam({ name: 'id', description: 'User profile ID' })
  @LangQuery()
  @Get('profile/:id')
  getUserProfile(@Param('id') id: string) {
    return this.userService.getUserProfile(id);
  }

  @UseGuards(UserGuard)
  @UseInterceptors(PhoneNumberTransformInterceptor)
  @ApiOperation({ summary: 'CREATE USER PROFILE' })
  @LangQuery()
  @Post('profile')
  createProfile(@Body() createUserDto: CreateUserDto, @CurrentUser() user: AuthUser) {
    return this.userService.createUserProfile(createUserDto, user);
  }

  @UseGuards(UserGuard)
  @UseInterceptors(PhoneNumberTransformInterceptor)
  @ApiOperation({ summary: 'UPDATE USER PROFILE BY ID' })
  @ApiParam({ name: 'id', description: 'User profile ID' })
  @LangQuery()
  @Patch('profile/:id')
  updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: AuthUser
  ) {
    return this.userService.updateUserProfile(id, updateUserDto, user);
  }

  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'DELETE USER PROFILE BY ID' })
  @LangQuery()
  @Delete('profile/:id')
  removeProfile(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.userService.removeUserProfile(id, user);
  }
}
