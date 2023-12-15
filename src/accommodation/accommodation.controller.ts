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
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccommodationService } from './accommodation.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import CreateAccommodationAndAddressDto from './dto/create-accommodation-address.dto';
import UpdateAccommodationAndAddressDto from './dto/update-accommodation-address.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  getSchemaPath,
  ApiBody,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserGuard } from 'src/common/guards/user.guard';
import { OrderAndFilter } from './dto/orderAndFilter.dto';

@UseGuards(UserGuard)
@ApiTags('ACCOMMODATION')
@Controller('accommodations')
export class AccommodationController {
  constructor(private readonly accommodationService: AccommodationService) {}
  @ApiOperation({ summary: 'CREATE ACCOMMODATION' })
  @ApiResponse({
    status: 201,
    description: 'Created accommodation',
    schema: {
      properties: {
        success: { type: 'boolean' },
        data: {
          $ref: getSchemaPath(CreateAccommodationAndAddressDto),
        },
      },
    },
  })
  @Post()
  async createAccommodation(@Body() body: CreateAccommodationAndAddressDto, @Req() req: any) {
    const createAccommodationAndAdress = {
      ...body.accommodation,
      previewImgUrl: body.accommodation.previewImgUrl || 'none',
      ownerId: req.user.id,
      Address: {
        create: body.address,
      },
    };
    const createdAccommodation = await this.accommodationService.createAccommodation(
      createAccommodationAndAdress
    );
    return { success: true, data: createdAccommodation };
  }

  @ApiOperation({ summary: 'ADD IMAGE TO ACCOMMODATION' })
  @ApiResponse({
    status: 201,
    description: 'Updated accommodation',
    schema: {
      properties: {
        success: { type: 'boolean' },
        data: {
          $ref: getSchemaPath(CreateAccommodationAndAddressDto),
        },
      },
    },
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
    @Req() req: any
  ) {
    if (!file) throw new NotFoundException('File for updation not provided');

    const updatedAccommodation = await this.accommodationService.addFileToAccommodation(
      id,
      file,
      req.user.id
    );

    return { success: true, data: updatedAccommodation };
  }

  @ApiOperation({ summary: 'UPDATE ACCOMMODATION' })
  @ApiResponse({
    status: 200,
    description: 'Updated accommodation',
    schema: {
      properties: {
        success: { type: 'boolean' },
        data: {
          $ref: getSchemaPath(CreateAccommodationAndAddressDto),
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Accommodation ID',
    required: true,
  })
  @Put('/:id')
  async updateAccommodation(
    @Body() body: UpdateAccommodationAndAddressDto,
    @Param('id') id: string,
    @Req() req: any
  ) {
    const updateAccommodationAndAdress = {
      ...body.accommodation,
      address: {
        update: body.address,
      },
    };

    const updatedAccommodation = await this.accommodationService.updateAccommodation(
      id,
      updateAccommodationAndAdress,
      req.user.id
    );

    return { success: true, data: updatedAccommodation };
  }

  @ApiOperation({ summary: 'DELETE ACCOMMODATION' })
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
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Accommodation ID',
    required: true,
  })
  @Delete('/:id')
  async deleteAccommodation(@Param('id') id: string, @Req() req: any) {
    await this.accommodationService.deleteAccommodation(id, req.user.id);
    return { success: true, data: {} };
  }

  @ApiOperation({ summary: 'Get all accommodations' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'All available accommodations list',
    schema: {
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            $ref: getSchemaPath(CreateAccommodationAndAddressDto),
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Get('/')
  async getAllAccommodations(@Query() orderAndFilter: OrderAndFilter) {
    const accommodationsList = await this.accommodationService.getAllAccommodations(orderAndFilter);
    return { success: true, data: accommodationsList };
  }

  @ApiOperation({ summary: 'GET ACCOMMODATION' })
  @ApiResponse({
    status: 200,
    description: 'Accommodation with provided id',
    schema: {
      properties: {
        success: { type: 'boolean' },
        data: {
          $ref: getSchemaPath(CreateAccommodationAndAddressDto),
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Accommodation ID',
    required: true,
  })
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const accommodations = await this.accommodationService.getOneAccommodation(id);
    return { success: true, data: accommodations };
  }
}
