import { IsDateString, IsEmail, IsOptional, IsString, IsUUID, Matches, MinLength } from "class-validator";

export class CreateBookingDto {
    @IsString()
    @MinLength(2)
    customerName!: string;

    @IsEmail()
    customerEmail!: string;

    @IsString()
    customerPhone!: string;

    @IsUUID()
    serviceId!: string;

    @IsDateString()
    bookingDate! : string;

    @IsString()
    bookingTime! : string;


    @IsOptional()
    notes? : string
}
