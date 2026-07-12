// src/bookings/entities/booking.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Service } from '../../services/entities/service.entity';
import { BookingStatus } from '../../common/enum/booking-status.enum';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  customerName!: string;

  @Column()
  customerEmail!: string;

  @Column()
  customerPhone!: string;

  @ManyToOne(() => Service, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'serviceId' })
  service!: Service;

  @Column()
  serviceId!: string;

  @Column({ type: 'date' })
  bookingDate!: string;

  @Column({ type: 'time' })
  bookingTime!: string;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status!: BookingStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}