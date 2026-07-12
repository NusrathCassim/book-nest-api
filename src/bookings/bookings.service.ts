import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository, ILike} from 'typeorm';
import { BookingStatus } from 'src/common/enum/booking-status.enum';
import { Service } from 'src/services/entities/service.entity';
import { UpdateBookingStatusDto } from './dto/update-booking-status';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepo : Repository<Booking>,
    @InjectRepository(Service) private serviceRepo: Repository<Service>
    
  ){}

  async createBooking(dto: CreateBookingDto) {
    const service = await this.serviceRepo.findOne({ where: { id: dto.serviceId } });
    if (!service) {
      throw new NotFoundException(`Service with ID ${dto.serviceId} not found`);
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(dto.bookingDate);
    if (bookingDate < today) {
      throw new BadRequestException('Booking date cannot be in the past');
    }
    const duplicate = await this.bookingRepo.findOne({
      where: {
        serviceId: dto.serviceId,
        bookingDate: dto.bookingDate,
        bookingTime: dto.bookingTime,
        status: BookingStatus.PENDING, // or CONFIRMED, see note below
      },
    });
    if (duplicate) {
      throw new ConflictException(
        'A booking already exists for this service at the selected date and time',
      );
    }

    const booking = this.bookingRepo.create(dto);
    return this.bookingRepo.save(booking);
  }
  findAll() {
    return this.bookingRepo.find()
  }

  async getBookingById(id: string) {
    const booking = await  this.bookingRepo.findOne({where : {id}})
    if(!booking){
      throw new NotFoundException(
            `booking with Id ${id} not available`
      )
    }
    return booking;
  
  }

  async update(id: string, dto: UpdateBookingStatusDto) {
    const booking = await this.getBookingById(id)
    if(booking.status === BookingStatus.CANCELLED && dto.status === BookingStatus.COMPLETED)
    {
      throw new BadRequestException('Cancelled bookings cannot be marked as completed');
    
    }
    Object.assign(booking, dto)
    return this.bookingRepo.save(booking)
  }

  async cancel(id: string) {
    const booking = await this.getBookingById(id);
    booking.status = BookingStatus.CANCELLED;
    return this.bookingRepo.save(booking);
  }

  searchBooking(customerName?: string, status?: BookingStatus) {
    const where: Record<string, any> = {};

    if (customerName) {
      where.customerName = ILike(`%${customerName}%`);
    }
    if (status) {
      where.status = status;
    }

    return this.bookingRepo.find({ where });
  }
}
