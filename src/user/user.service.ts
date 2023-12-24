import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UiTheme } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';
import { AuthUser } from 'src/common/types/AuthUser.type';
import ErrorsTypes from 'src/errors/errors.enum';
import { GlobalException } from 'src/exceptions/global.exception';
import { translateMessage } from 'src/helpers/translateMessage.helper';
import MessagesTypes from 'src/messages/messages.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService
  ) {}

  async validateUserAuthorization(profileUserId: string, authUser: AuthUser) {
    if (authUser.role === 'ADMIN') {
      return true;
    }

    if (profileUserId !== authUser.id)
      throw new ForbiddenException(ErrorsTypes.FORBIDDEN_NOT_AUTHORIZED_USER);

    return true;
  }

  async findAll() {
    try {
      const users = await this.prismaService.user.findMany({
        include: { profile: true },
      });

      return {
        success: true,
        data: users,
      };
    } catch {
      throw new GlobalException(ErrorsTypes.USER_FAILED_TO_GET_LIST);
    }
  }

  async getUser(id: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
        include: { profile: true },
      });

      if (!user) throw new NotFoundException(ErrorsTypes.NOT_FOUND_AUTH_USER);

      return {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified,
          isEmailVerified: user.isEmailVerified,
          activationLink: user.activationLink,
          profile: user.profile,
        },
      };
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

      if (!userProfile) throw new NotFoundException(ErrorsTypes.NOT_FOUND_USER_PROFILE);

      return {
        success: true,
        data: userProfile,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new GlobalException(ErrorsTypes.USER_PROFILE_FAILED_TO_GET);
    }
  }

  async createUserProfile(createUserDto: CreateUserDto, userData: AuthUser) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userData.id },
        include: { profile: true },
      });

      if (!user) {
        throw new NotFoundException(ErrorsTypes.NOT_FOUND_AUTH_USER);
      } else if (user.profile) {
        throw new ConflictException(ErrorsTypes.CONFLICT_USER_PROFILE_ALREADY_EXIST);
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
          user: {
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

  async updateUserProfile(id: string, updateUserDto: UpdateUserDto, authUser: AuthUser) {
    try {
      const userProfile = await this.prismaService.userProfile.findFirst({
        where: { id },
      });

      if (!userProfile) throw new NotFoundException(ErrorsTypes.NOT_FOUND_USER_PROFILE);

      await this.validateUserAuthorization(userProfile.userId, authUser);

      await this.prismaService.user.update({
        where: { id: userProfile.userId },
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
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.USER_PROFILE_FAILED_TO_UPDATE);
    }
  }

  async removeUserProfile(id: string, authUser: AuthUser) {
    try {
      const userProfile = await this.prismaService.userProfile.findFirst({
        where: { id },
      });

      if (!userProfile) throw new NotFoundException(ErrorsTypes.NOT_FOUND_USER_PROFILE);

      await this.validateUserAuthorization(userProfile.userId, authUser);

      await this.prismaService.userProfile.delete({
        where: { id },
      });

      return {
        message: translateMessage(this.i18n, MessagesTypes.USER_PROFILE_DELETE_SUCCESS),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.USER_PROFILE_FAILED_TO_DELETE);
    }
  }
}
