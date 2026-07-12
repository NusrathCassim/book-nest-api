import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service) private serviceRepo: Repository<Service>
  ){}
 
  
  createService(dto: CreateServiceDto){
    const service = this.serviceRepo.create(dto)
    return this.serviceRepo.save(service);
  }

  getAllServices(){
    return this.serviceRepo.find()
  }

  async getServiceById(id: string){
    const service= await this.serviceRepo.findOne({where : {id}})
    if(!service){
      throw new NotFoundException(
        `Service with Id ${id} not available`
      )
    }
    return service;
  }

  async update(id: string, dto: UpdateServiceDto){
    const service = await this.getServiceById(id);
    Object.assign(service, dto);
    return this.serviceRepo.save(service)
  }
  async remove(id: string){
    const service = await this.getServiceById(id);
    try {
    await this.serviceRepo.remove(service);
  } catch (err) {
    throw new ConflictException('Cannot delete service with existing bookings');
  }
  return { message: 'Service deleted successfully' };
  }
}
