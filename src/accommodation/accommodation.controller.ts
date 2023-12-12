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
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { UserGuard } from 'src/common/guards/user.guard';
import AccommodationResponseDto from './dto/accommodation-response.dto';

@UseGuards(UserGuard)
@ApiTags('ACCOMMODATION')
@Controller('accommodation')
export class AccommodationController {
  constructor(private readonly accommodationService: AccommodationService) {}
  @ApiOperation({ summary: 'CREATE ACCOMMODATION' })
  @ApiResponse({
    status: 201,
    description: 'Created accommodation',
    type: AccommodationResponseDto,
  })
  @Post('/create')
  async createAccommodation(@Body() body: CreateAccommodationAndAddressDto, @Req() req: any) {
    const createAccommodationAndAdress = {
      ...body.accommodation,
      previewImgUrl: body.accommodation.previewImgUrl || 'none',
      thumbnailUrl: body.accommodation.thumbnailUrl || 'none',
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
    type: AccommodationResponseDto,
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
    type: AccommodationResponseDto,
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
    const updateAccommodationAndAdress = {
      ...body.accommodation,
      Address: {
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
  @Delete('/delete/:id')
  async deleteAccommodation(@Param('id') id: string, @Req() req: any) {
    await this.accommodationService.deleteAccommodation(id, req.user.id);
    return { success: true, data: {} };
  }

  @ApiOperation({ summary: 'GET ACCOMMODATION' })
  @ApiResponse({
    status: 200,
    description: 'Accommodation with provided id',
    type: AccommodationResponseDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Accommodation ID',
    required: true,
  })
  @Get('/get/:id')
  async findOne(@Param('id') id: string) {
    const accommodation = await this.accommodationService.getOneAccommodation(id);
    return { success: true, data: accommodation };
  }

  @ApiOperation({ summary: 'GET ALL YOUR ACCOMMODATIONS' })
  @ApiResponse({
    status: 200,
    description: 'Accommodations list',
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
  @Get('/getAll')
  async findAll(@Req() res: any) {
    const accommodations = await this.accommodationService.getListOfAccommodations(res.user.id);
    return { success: true, data: accommodations };
  }
}
