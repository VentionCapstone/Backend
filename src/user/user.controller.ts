import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('USER')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'GET ALL USERS' })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'GET USER BY ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @ApiOperation({ summary: 'GET USER PROFILE BY ID' })
  @ApiParam({ name: 'id', description: 'User profile ID' })
  @Get('profile/:id')
  getUserProfile(@Param('id') id: string) {
    return this.userService.getUserProfile(id);
  }

  @ApiOperation({ summary: 'CREATE USER PROFILE' })
  @Post('profile')
  createProfile(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUserProfile(createUserDto);
  }

  @ApiOperation({ summary: 'UPDATE USER PROFILE BY ID' })
  @ApiParam({ name: 'id', description: 'User profile ID' })
  @Patch('profile/:id')
  updateProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUserProfile(id, updateUserDto);
  }

  @ApiOperation({ summary: 'DELETE USER PROFILE BY ID' })
  @Delete('profile/:id')
  removeProfile(@Param('id') id: string) {
    return this.userService.removeUserProfile(id);
  }
}
