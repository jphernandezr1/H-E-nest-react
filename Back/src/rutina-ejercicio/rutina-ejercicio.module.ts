import { Module } from '@nestjs/common';
import { RutinaEjercicioService } from './rutina-ejercicio.service';
import { RutinaEjercicioController } from './rutina-ejercicio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EjercicioEntity } from 'src/ejercicio/ejercicio.entity';
import { RutinaEntity } from 'src/rutina/rutina.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [RutinaEjercicioService, UserService, AuthService, JwtStrategy, JwtService],
  imports: [TypeOrmModule.forFeature([RutinaEntity, EjercicioEntity])],
  controllers: [RutinaEjercicioController]
})
export class RutinaEjercicioModule {}
