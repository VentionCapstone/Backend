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
import { ErrorDto } from './dto/error.dto';

@ApiTags('AMENITIES')
@UseGuards(UserGuard)
@Controller('amenities')
export class AmenitiesController {
  constructor(private amenitiesService: AmenitiesService) {}

  @Get('/list')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'GET AMENITIES LIST' })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 200,
    description: 'Success getting amenities list',
    type: getListResponseDto,
  })
  getAmenitiesList() {
    return this.amenitiesService.getAmenitiesList();
  }

  @Get('/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'GET AMENITIES BY ID' })
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
    type: ErrorDto,
  })
  getAmenities(@Param('id') id: string) {
    return this.amenitiesService.getAmenities(id);
  }

  @Put('/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'UPDATE AMENITIES BY ID' })
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
    type: ErrorDto,
  })
  @ApiBody({ type: AmenitiesDto })
  updateAmenities(@Param('id') id: string, @Body() dto: AmenitiesDto) {
    return this.amenitiesService.updateAmenities(id, dto);
  }

  @Post('/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'ADD AMENITIES BY ID' })
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
    type: ErrorDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Amenities for this accomodation already exist',
    type: ErrorDto,
  })
  @ApiBody({ type: AmenitiesDto })
  addAmenities(@Param('id') id: string, @Body() dto: AmenitiesDto) {
    return this.amenitiesService.addAmenities(id, dto);
  }

  @Delete('/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'DELETE AMENITIES BY ID' })
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
    type: ErrorDto,
  })
  deleteAmenities(@Param('id') id: string) {
    return this.amenitiesService.deleteAmenities(id);
  }
}
