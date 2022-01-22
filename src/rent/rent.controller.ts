import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { RentService } from './rent.service';
import { DateIntervalInput } from './inputs/date-interval.input';
import { RentSessionInput } from './inputs/rent-session.input';
import { ApiBadRequestResponse, ApiResponse } from '@nestjs/swagger';
import { CarAvailabilityDto } from './dto/car-availability.dto';
import { RentSessionDto } from './dto/rent-session.dto';
import { RentCostDto } from './dto/rent-cost.dto';

@Controller('rent')
export class RentController {
  private readonly dayInMilliseconds = 24 * 60 * 60 * 1000;

  constructor(private rentService: RentService) {}

  @Post('cost')
  @ApiResponse({ type: RentCostDto })
  calculateCost(@Body() dateIntervalInput: DateIntervalInput) {
    const diff =
      dateIntervalInput.endsAt.getTime() - dateIntervalInput.beginsAt.getTime();
    const days = Math.round(diff / this.dayInMilliseconds) + 1;
    return { cost: this.rentService.calculateCost(days) };
  }

  @Post('available')
  @ApiResponse({ type: CarAvailabilityDto })
  async isAvailable(
    @Body() rentSessionInput: RentSessionInput,
  ): Promise<CarAvailabilityDto> {
    return {
      available: await this.rentService.isCarAvailable(
        rentSessionInput.carId,
        rentSessionInput.beginsAt,
        rentSessionInput.endsAt,
      ),
    };
  }

  @Post('session')
  @ApiResponse({ type: RentSessionDto })
  @ApiBadRequestResponse({ description: 'Car is unavailable' })
  async createSession(@Body() rentSessionInput: RentSessionInput) {
    try {
      return await this.rentService.createSession(
        rentSessionInput.carId,
        rentSessionInput.beginsAt,
        rentSessionInput.endsAt,
      );
    } catch (e) {
      if (
        e instanceof Error &&
        e.message == this.rentService.carIsUnavailable
      ) {
        throw new BadRequestException({ error: e.message });
      }
      throw e;
    }
  }
}
