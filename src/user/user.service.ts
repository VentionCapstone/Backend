import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UiTheme } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.user.findMany({
      include: { Profile: true },
    });
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
      throw new HttpException('Failed to get user.', HttpStatus.INTERNAL_SERVER_ERROR);
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
      throw new HttpException('Failed to get user profile.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createUserProfile(createUserDto: CreateUserDto) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: createUserDto.userId },
        include: { Profile: true },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${createUserDto.userId} not found`);
      } else if (user.Profile) {
        throw new NotFoundException(`User Profile with ID ${user.Profile.id} already exists`);
      }

      // update user
      await this.prismaService.user.update({
        where: { id: createUserDto.userId },
        data: {
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
        },
      });

      const data = {
        phoneNumber: createUserDto.phoneNumber,
        photoUrl: createUserDto.photoUrl,
        gender: createUserDto.gender,
        country: createUserDto.country,
        language: createUserDto.language,
        uiTheme: createUserDto.uiTheme as UiTheme,
        description: createUserDto.description,
      };

      return await this.prismaService.userProfile.create({
        data: {
          ...data,
          user: {
            connect: {
              id: createUserDto.userId,
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException('Failed to create user.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUserProfile(id: string, updateUserDto: UpdateUserDto) {
    try {
      if (!updateUserDto.userId) {
        throw new NotFoundException(`User with ID ${updateUserDto.userId} not found`);
      }

      const userProfile = await this.prismaService.userProfile.findFirst({
        where: { id },
      });

      if (!userProfile) {
        throw new NotFoundException(`User Profile with ID ${id} not found`);
      }

      // update user
      await this.prismaService.user.update({
        where: { id: updateUserDto.userId },
        data: {
          firstName: updateUserDto.firstName,
          lastName: updateUserDto.lastName,
        },
      });

      const data = {
        phoneNumber: updateUserDto.phoneNumber,
        photoUrl: updateUserDto.photoUrl,
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
      throw new HttpException('Failed to update user.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeUserProfile(id: string) {
    try {
      return await this.prismaService.userProfile.delete({
        where: { id },
      });
    } catch (error) {
      throw new HttpException('Failed to delete user.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
