import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccommodationService } from './accommodation.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
  getSchemaPath,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { UserGuard } from 'src/common/guards/user.guard';
import AccommodationResponseDto, { AccommodationDto } from './dto/accommodation-response.dto';
import { OrderAndFilter } from './dto/orderAndFilter.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ReviewDto } from 'src/reviews/dto/review-response.dto';
import { LangQuery } from 'src/customDecorators/langQuery.decorator';
import CreateAccommodationDto from './dto/create-accommodation.dto';
import UpdateAccommodationDto from './dto/update-accommodation.dto';

@ApiTags('accommodation')
@Controller('accommodations')
export class AccommodationController {
  constructor(private readonly accommodationService: AccommodationService) {}
  @ApiOperation({ summary: 'Create accommodation' })
  @ApiResponse({
    status: 201,
    description: 'Created accommodation',
    type: AccommodationResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @LangQuery()
  @Post('/')
  async createAccommodation(
    @Body() body: CreateAccommodationDto,
    @CurrentUser('id') userId: string
  ) {
    const createAccommodationAndAdress = {
      ...body,
      previewImgUrl: body.previewImgUrl || 'none',
      thumbnailUrl: body.thumbnailUrl || 'none',
      ownerId: userId,
      address: {
        create: body.address,
      },
    };
    const createdAccommodation = await this.accommodationService.createAccommodation(
      createAccommodationAndAdress
    );
    return { success: true, data: createdAccommodation };
  }

  @ApiOperation({ summary: 'Add image to accommodation' })
  @ApiResponse({
    status: 201,
    description: 'Updated accommodation',
    type: AccommodationResponseDto,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'File is required',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Accommodation ID',
    required: true,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (only .jpg, .jpeg, .png allowed), size < 10MB!',
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @LangQuery()
  @Post('/:id/file')
  @UseInterceptors(FileInterceptor('file'))
  async updateAccommodationAddFile(
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
    if (!file) throw new NotFoundException('File for updation not provided');

    const updatedAccommodation = await this.accommodationService.addFileToAccommodation(
      id,
      file,
      userId
    );

    return { success: true, data: updatedAccommodation };
  }

  @ApiOperation({ summary: 'Update accommodation' })
  @ApiResponse({
    status: 200,
    description: 'Updated accommodation',
    type: AccommodationResponseDto,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Accommodation ID',
    required: true,
  })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @LangQuery()
  @Put('/:id')
  async updateAccommodation(
    @Body() body: UpdateAccommodationDto,
    @Param('id') id: string,
    @CurrentUser('id') userId: string
  ) {
    const updateAccommodationAndAdress = {
      ...body,
      address: {
        update: body.address,
      },
    };

    const updatedAccommodation = await this.accommodationService.updateAccommodation(
      id,
      updateAccommodationAndAdress,
      userId
    );

    return { success: true, data: updatedAccommodation };
  }

  @ApiOperation({ summary: 'Restore accommodation' })
  @ApiResponse({
    status: 200,
    description: 'Restored accommodation',
    type: AccommodationResponseDto,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Accommodation id',
    required: true,
  })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Patch('/:id/restore')
  async restoreAccommodation(@Param('id') id: string, @CurrentUser('id') userId: string) {
    const accommodation = await this.accommodationService.restoreAccommodation(id, userId);

    return { success: true, data: accommodation };
  }

  @ApiOperation({ summary: 'Delete accommodation' })
  @ApiResponse({
    status: 200,
    description: 'Deleted accommodation',
    schema: {
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Accommodation ID',
    required: true,
  })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @LangQuery()
  @Delete('/:id')
  async deleteAccommodation(@Param('id') id: string, @CurrentUser('id') userId: string) {
    await this.accommodationService.deleteAccommodation(id, userId);
    return { success: true, data: {} };
  }

  @ApiOperation({ summary: 'Get all accommodations' })
  @ApiResponse({
    status: 200,
    description: 'All available accommodations list',
    schema: {
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            $ref: getSchemaPath(AccommodationDto),
          },
        },
      },
    },
  })
  @Get('/')
  async getAllAccommodations(@Query() orderAndFilter: OrderAndFilter) {
    const data = await this.accommodationService.getAllAccommodations(orderAndFilter);
    return { success: true, ...data };
  }

  @ApiOperation({ summary: 'Get all your accommodations' })
  @ApiResponse({
    status: 200,
    description: 'Accommodations list',
    schema: {
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            $ref: getSchemaPath(AccommodationDto),
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description:
      'Optional query, bring equal or less number of reviews, need to be passed it pair with page.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description:
      'Optional query, skips <page * limit> number of reviews, need to be passed it pair with limit.',
  })
  @Get('/:userId/accommodations')
  async findAll(
    @Param('userId') userId: string,
    @Query() limitAndPage: { page: string; limit: string }
  ) {
    const accommodations = await this.accommodationService.getUserAccommodations(
      userId,
      limitAndPage
    );
    return { success: true, data: accommodations };
  }

  @ApiOperation({ summary: 'Get all reviews to this accommodation' })
  @ApiResponse({
    status: 200,
    description: 'Reviews of this accommodation',
    schema: {
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            $ref: getSchemaPath(ReviewDto),
          },
        },
        countByRating: {
          type: 'object',
          additionalProperties: {
            type: 'integer',
          },
        },
        averageRate: {
          type: 'number',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description:
      'Optional query, bring equal or less number of reviews, need to be passed it pair with page.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description:
      'Optional query, skips <page * limit> number of reviews, need to be passed it pair with limit.',
  })
  @Get('/:accommodationId/reviews')
  async getAllReviews(
    @Param('accommodationId') accommodationId: string,
    @Query() limitAndPage: { page: string; limit: string }
  ) {
    const review = await this.accommodationService.getAccommodationReviews(
      accommodationId,
      limitAndPage
    );
    return { success: true, ...review };
  }

  @ApiOperation({ summary: 'Get accommodation' })
  @ApiResponse({
    status: 200,
    description: 'Accommodation with provided id',
    type: AccommodationResponseDto,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Accommodation ID',
    required: true,
  })
  @LangQuery()
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const accommodations = await this.accommodationService.getOneAccommodation(id);
    return { success: true, data: accommodations };
  }
}
