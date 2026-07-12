import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepo:Repository<User>,
        private jwtService: JwtService,
    ){}

    async register(dto: RegisterDto){
        const existing = await this.userRepo.findOne({where: {email: dto.email}});
        if(existing){
            throw new ConflictException('Email Already registered')
        }
        //else 
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = this.userRepo.create({
            email : dto.email,
            password: hashedPassword,
            name: dto.name
        });
        await this.userRepo.save(user)
        return this.buildAuthResponse(user);
    }

    async login(dto: LoginDto){
        console.log(dto)
         const user = await this.userRepo.findOne({ where: { email: dto.email } });
        if (!user) {
        throw new UnauthorizedException('Invalid credentials');
        }
         console.log('result-test:', user); 
        const passwordMatches = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatches) {
        throw new UnauthorizedException('Invalid credentials');
        }

        return this.buildAuthResponse(user);
    }


    private buildAuthResponse(user: User) {
    const payload = { sub: user.id, email: user.email , name: user.name,};
        return {
        accessToken: this.jwtService.sign(payload),
        user: { id: user.id, email: user.email, name: user.name },
        };
    }

}
