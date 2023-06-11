import { Module } from '@nestjs/common';
import { RutinaService } from './rutina.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RutinaEntity } from './rutina.entity';
import { RutinaController } from './rutina.controller';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([RutinaEntity])],
  providers: [RutinaService, UserService, AuthService, JwtStrategy, JwtService],
  controllers: [RutinaController]
})
export class RutinaModule {}
