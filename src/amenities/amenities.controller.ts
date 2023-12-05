import { Body, Controller, Delete, Get, Post, Put, Param, UseGuards } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { AmenitiesDto } from './dto';
import { UserGuard } from 'src/common/guards/user.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from './dto/amenititesResponse.dto';
import { ErrorDto } from './dto/error.dto';

@ApiTags('amenities')
@UseGuards(UserGuard)
@Controller('amenities')
export class AmenitiesController {
  constructor(private amenitiesService: AmenitiesService) {}

  @Get('get/:id')
  @ApiOperation({ summary: 'Get amenities list' })
  @ApiResponse({
    status: 201,
    description: 'Success getting amenities',
    type: ResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Incorrect apartment id',
    type: ErrorDto,
  })
  getAmenities(@Param('id') id: string) {
    return this.amenitiesService.getAmenities(id);
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update amenities list' })
  @ApiResponse({
    status: 201,
    description: 'Success updating amenities',
    type: ResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Record to update not found.',
    type: ErrorDto,
  })
  @ApiBody({ type: [AmenitiesDto] })
  updateAmenities(@Param('id') id: string, @Body() dto: AmenitiesDto) {
    return this.amenitiesService.updateAmenities(id, dto);
  }

  @Post('add/:id')
  @ApiOperation({ summary: 'Add amenities list' })
  @ApiResponse({
    status: 201,
    description: 'Success adding amenities',
    type: ResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Incorrect apartment id',
    type: ErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Amenities for this accomodation already exist',
    type: ErrorDto,
  })
  @ApiBody({ type: [AmenitiesDto] })
  addAmenities(@Param('id') id: string, @Body() dto: AmenitiesDto) {
    return this.amenitiesService.addAmenities(id, dto);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete amenities list' })
  @ApiResponse({
    status: 201,
    description: 'Success deleting amenities',
    type: ResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Incorrect apartment id',
    type: ErrorDto,
  })
  deleteAmenities(@Param('id') id: string) {
    return this.amenitiesService.deleteAmenities(id);
  }
}
