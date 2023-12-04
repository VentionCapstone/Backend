import { Body, Controller, Delete, Get, Post, Put, Param, UseGuards } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { AmenitiesDto } from './dto';
import { UserGuard } from 'src/common/guards/user.guard';

@UseGuards(UserGuard)
@Controller('amenities')
export class AmenitiesController {
  constructor(private amenitiesService: AmenitiesService) {}

  @Get('get/:id')
  getAmenities(@Param('id') id: string) {
    return this.amenitiesService.getAmenities(id);
  }

  @Put('update/:id')
  updateAmenities(@Param('id') id: string, @Body() dto: AmenitiesDto) {
    return this.amenitiesService.updateAmenities(id, dto);
  }

  @Post('add/:id')
  addAmenities(@Param('id') id: string, @Body() dto: AmenitiesDto) {
    return this.amenitiesService.addAmenities(id, dto);
  }

  @Delete('delete/:id')
  deleteAmenities(@Param('id') id: string) {
    return this.amenitiesService.deleteAmenities(id);
  }
}
