import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { AmenitiesDto } from './dto';

@Controller('accomodation')
export class AmenitiesController {
  constructor(private amenitiesService: AmenitiesService) {}

  @Get('amenities')
  getAmenities(@Query('id') id: string) {
    return this.amenitiesService.getAmenities(id);
  }

  @Put('amenities')
  updateAmenities(@Query('id') id: string, @Body() dto: AmenitiesDto) {
    return this.amenitiesService.updateAmenities(id, dto);
  }

  @Post('amenities')
  addAmenities(@Query('id') id: string, @Body() dto: AmenitiesDto) {
    return this.amenitiesService.addAmenities(id, dto);
  }

  @Delete('amenities')
  deleteAmenities(@Query('id') id: string) {
    return this.amenitiesService.deleteAmenities(id);
  }
}
