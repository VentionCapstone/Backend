import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserGuard } from 'src/common/guards/user.guard';
import { LangQuery } from 'src/customDecorators/langQuery.decorator';
import { AmenitiesService } from './amenities.service';
import { AmenitiesRequestDto, AmenitiesResponseDto, AmenitiesListResponseDto } from './dto';

@ApiTags('amenitites')
@UseGuards(UserGuard)
@Controller('amenities')
export class AmenitiesController {
  constructor(private amenitiesService: AmenitiesService) {}

  @Get('')
  @LangQuery()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get amenities list' })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 200,
    description: 'Success getting amenities list',
    type: AmenitiesListResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async getAmenitiesList() {
    const amenitiesList = await this.amenitiesService.getAmenitiesList();
    return { success: true, data: amenitiesList };
  }

  @Get('/:id')
  @LangQuery()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get amenities by id' })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 200,
    description: 'Success getting amenities',
    type: AmenitiesResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async getAmenities(@Param('id') id: string) {
    const amenitiesById = await this.amenitiesService.getAmenities(id);
    return { success: true, data: amenitiesById };
  }

  @Post('/:id')
  @LangQuery()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add amenities by id' })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 201,
    description: 'Success adding amenities',
    type: AmenitiesResponseDto,
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
  @ApiBody({ type: AmenitiesRequestDto })
  async addAmenities(
    @Param('id') id: string,
    @Body() dto: AmenitiesRequestDto,
    @CurrentUser('id') userId: string
  ) {
    const addedAmenities = await this.amenitiesService.addAmenities(id, dto, userId);
    return { success: true, data: addedAmenities };
  }

  @Put('/:id')
  @LangQuery()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update amenities by id' })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 200,
    description: 'Success updating amenities',
    type: AmenitiesResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiBody({ type: AmenitiesRequestDto })
  async updateAmenities(
    @Param('id') id: string,
    @Body() dto: AmenitiesRequestDto,
    @CurrentUser('id') userId: string
  ) {
    const updatedAmenities = await this.amenitiesService.updateAmenities(id, dto, userId);
    return { success: true, data: updatedAmenities };
  }

  @Delete('/:id')
  @LangQuery()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete amenities by id' })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 200,
    description: 'Success deleting amenities',
    type: AmenitiesResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async deleteAmenities(@Param('id') id: string, @CurrentUser('id') userId: string) {
    await this.amenitiesService.deleteAmenities(id, userId);
    return { success: true, data: {} };
  }
}
