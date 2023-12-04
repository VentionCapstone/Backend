import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { AmenitiesDto } from './dto';
import { UserGuard } from 'src/common/guards/user.guard';
import {} from '@nestjs/common';

@UseGuards(UserGuard)
@Controller('amenities')
export class AmenitiesController {
  constructor(private amenitiesService: AmenitiesService) {}

  @Get('get')
  getAmenities(@Query('id') id: string) {
    return this.amenitiesService.getAmenities(id);
  }

  @Put('update')
  updateAmenities(@Query('id') id: string, @Body() dto: AmenitiesDto) {
    return this.amenitiesService.updateAmenities(id, dto);
  }

  @Post('add')
  addAmenities(@Query('id') id: string, @Body() dto: AmenitiesDto) {
    return this.amenitiesService.addAmenities(id, dto);
  }

  @Delete('delete')
  deleteAmenities(@Query('id') id: string) {
    return this.amenitiesService.deleteAmenities(id);
  }
}
