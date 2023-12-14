import { Body, Controller, Delete, Get, Post, Put, Param, UseGuards } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { AmenitiesDto } from './dto';
import { UserGuard } from 'src/common/guards/user.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseDto, getListResponseDto } from './dto/amenititesResponse.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('amenitites')
@UseGuards(UserGuard)
@Controller('amenities')
export class AmenitiesController {
  constructor(private amenitiesService: AmenitiesService) {}

  @Get('')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get amenities list' })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 200,
    description: 'Success getting amenities list',
    type: getListResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  getAmenitiesList() {
    return this.amenitiesService.getAmenitiesList();
  }

  @Get('/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get amenities by id' })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 200,
    description: 'Success getting amenities',
    type: ResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  getAmenities(@Param('id') id: string) {
    return this.amenitiesService.getAmenities(id);
  }

  @Post('/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add amenities by id' })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 201,
    description: 'Success adding amenities',
    type: ResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @ApiResponse({
    status: 409,
    description: 'Amenities for this accomodation already exist',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiBody({ type: AmenitiesDto })
  addAmenities(
    @Param('id') id: string,
    @Body() dto: AmenitiesDto,
    @CurrentUser('id') userId: string
  ) {
    return this.amenitiesService.addAmenities(id, dto, userId);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update amenities by id' })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 200,
    description: 'Success updating amenities',
    type: ResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiBody({ type: AmenitiesDto })
  updateAmenities(
    @Param('id') id: string,
    @Body() dto: AmenitiesDto,
    @CurrentUser('id') userId: string
  ) {
    return this.amenitiesService.updateAmenities(id, dto, userId);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete amenities by id' })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 200,
    description: 'Success deleting amenities',
    type: ResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  deleteAmenities(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.amenitiesService.deleteAmenities(id, userId);
  }
}
