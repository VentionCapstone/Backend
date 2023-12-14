import { Controller, Get, Query } from '@nestjs/common';
import { AccommodationsListService } from './accommodationsList.service';
import { OrderAndFilter } from './dto/orderAndFilter.dto';
import { ApiTags, ApiOperation, ApiResponse, getSchemaPath, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('ACCOMMODATION LIST')
@Controller('accommodations')
export class AccommodationsListController {
  constructor(private readonly accommodationsListService: AccommodationsListService) {}

  @ApiOperation({ summary: 'GET ALL YOUR ACCOMMODATIONS' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Accommodations list',
    schema: {
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            $ref: getSchemaPath(OrderAndFilter),
          },
        },
      },
    },
  })
  @Get()
  async findOne(@Query() orderAndFilter: OrderAndFilter) {
    console.log(
      'file: accommodationsList.controller.ts:12 ~ AccommodationsListController ~ findOne ~ orderAndFilter:',
      orderAndFilter
    );

    const accommodationsList =
      await this.accommodationsListService.getAccommodationsList(orderAndFilter);
    return { success: true, data: accommodationsList };
  }
}
