import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
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
} from '@nestjs/swagger';
import {} from '@nestjs/common';
import { UserGuard } from 'src/common/guards/user.guard';

@UseGuards(UserGuard)
@ApiTags('ACCOMMODATION')
@Controller('accommodation')
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
  @Post('/create')
  async createAccommodation(@Body() body: CreateAccommodationAndAddressDto, @Req() req: any) {
    try {
      const createAccommodationAndAdress = {
        ...body.accommodation,
        previewImgUrl: body.accommodation.previewImgUrl || 'none',
        ownerId: req.user.id,
        address: {
          create: body.address,
        },
      };
      const createdAccommodation = await this.accommodationService.createAccommodation(
        createAccommodationAndAdress
      );
      return { success: true, data: createdAccommodation };
    } catch (error) {
      return { success: false, error: error.message };
    }
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
  @Post('/file/:id')
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
    try {
      if (!file) {
        throw new Error('No file provided.');
      }

      const updatedAccommodation = await this.accommodationService.addFileToAccommodation(
        id,
        file,
        req.user.id
      );

      return { success: true, data: updatedAccommodation };
    } catch (error) {
      return { success: false, error: error.message };
    }
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
  @Put('/update/:id')
  async updateAccommodation(
    @Body() body: UpdateAccommodationAndAddressDto,
    @Param('id') id: string,
    @Req() req: any
  ) {
    try {
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
    } catch (error) {
      return { success: false, error: error.message };
    }
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
  @Delete('/delete/:id')
  async deleteAccommodation(@Param('id') id: string, @Req() req: any) {
    try {
      await this.accommodationService.deleteAccommodation(id, req.user.id);
      return { success: true, data: {} };
    } catch (error) {
      return { success: false, error: error.message };
    }
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
  @Get('/get/:id')
  async findOne(@Param('id') id: string) {
    try {
      const accommodation = await this.accommodationService.getOneAccommodation(id);

      return { success: true, data: accommodation };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
