import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status';
import { BookingStatus } from 'src/common/enum/booking-status.enum';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.createBooking(createBookingDto);
  }

  @Get()
  searchCustomer( @Query('customerName') customerName?: string,
    @Query('status') status?: BookingStatus,) {
    return this.bookingsService.searchBooking(customerName, status);
  }

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.getBookingById(id);
  }

  @Patch(':id/status')
  update(@Param('id') id: string, @Body() dto: UpdateBookingStatusDto) {
    return this.bookingsService.update(id, dto);
  }

  @Patch(':id/cancel')
  remove(@Param('id') id: string) {
    return this.bookingsService.cancel(id);
  }
}
