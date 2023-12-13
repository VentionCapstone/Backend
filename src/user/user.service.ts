import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UiTheme, User } from '@prisma/client';
import ErrorsTypes from 'src/errors/errors.enum';
import { GlobalException } from 'src/exceptions/global.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async validateUserAutherization(id: string, userId: string) {
    const userProfile = await this.prismaService.userProfile.findFirst({
      where: { id },
    });

    if (!userProfile) {
      throw new NotFoundException(`User Profile with ID ${id} not found`);
    }

    if (userProfile.userId !== userId) {
      throw new UnauthorizedException('You are not authorized to perform this action');
    }
  }

  async findAll() {
    try {
      const users = await this.prismaService.user.findMany({
        include: { Profile: true },
      });

      if (!users) {
        throw new NotFoundException('Users not found');
      }

      return {
        message: 'Users successfully fetched',
        data: users,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new GlobalException(ErrorsTypes.USERS_LIST_FAILED_TO_GET);
    }
  }

  async getUser(id: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
        include: { Profile: true },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new GlobalException(ErrorsTypes.USER_FAILED_TO_GET);
    }
  }

  async getUserProfile(id: string) {
    try {
      const userProfile = await this.prismaService.userProfile.findFirst({
        where: { id },
      });

      if (!userProfile) {
        throw new NotFoundException(`User Profile with ID ${id} not found`);
      }

      return userProfile;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new GlobalException(ErrorsTypes.USER_PROFILE_FAILED_TO_GET);
    }
  }

  async createUserProfile(createUserDto: CreateUserDto, userData: User) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userData.id },
        include: { Profile: true },
      });

      if (!user) {
        throw new NotFoundException("User doesn't exist");
      } else if (user.Profile) {
        throw new NotFoundException(`User Profile with ID ${user.Profile.id} already exists`);
      }

      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
        },
      });

      const data = {
        phoneNumber: createUserDto.phoneNumber,
        imageUrl: createUserDto.imageUrl,
        gender: createUserDto.gender,
        country: createUserDto.country,
        language: createUserDto.language,
        uiTheme: createUserDto.uiTheme as UiTheme,
        description: createUserDto.description,
      };

      return await this.prismaService.userProfile.create({
        data: {
          ...data,
          User: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new GlobalException(ErrorsTypes.USER_PROFILE_FAILED_TO_ADD);
    }
  }

  async updateUserProfile(id: string, updateUserDto: UpdateUserDto, user: User) {
    try {
      if (!user) {
        throw new NotFoundException("User doesn't exist");
      }

      await this.validateUserAutherization(id, user.id);

      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          firstName: updateUserDto.firstName,
          lastName: updateUserDto.lastName,
        },
      });

      const data = {
        phoneNumber: updateUserDto.phoneNumber,
        imageUrl: updateUserDto.imageUrl,
        gender: updateUserDto.gender,
        country: updateUserDto.country,
        language: updateUserDto.language,
        uiTheme: updateUserDto.uiTheme as UiTheme,
        description: updateUserDto.description,
      };

      return await this.prismaService.userProfile.update({
        where: { id },
        data: data,
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) throw error;
      throw new GlobalException(ErrorsTypes.USER_PROFILE_FAILED_TO_UPDATE);
    }
  }

  async removeUserProfile(id: string, user: User) {
    try {
      console.log('user', user);
      if (!user) {
        throw new NotFoundException("User doesn't exist");
      }

      await this.validateUserAutherization(id, user.id);

      return await this.prismaService.userProfile.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) throw error;
      throw new GlobalException(ErrorsTypes.USER_PROFILE_FAILED_TO_DELETE);
    }
  }
}
