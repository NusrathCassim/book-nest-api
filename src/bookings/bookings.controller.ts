import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.createBooking(createBookingDto);
  }

  @Get()
  searchCustomer(@Query('customerName') customerName?: string) {
    return this.bookingsService.searchBooking(customerName);
  }

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.getBookingById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookingStatusDto) {
    return this.bookingsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.cancel(id);
  }
}
