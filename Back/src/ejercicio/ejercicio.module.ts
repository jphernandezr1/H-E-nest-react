import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EjercicioService } from './ejercicio.service';
import { EjercicioEntity } from './ejercicio.entity';
import { EjercicioController } from './ejercicio.controller';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([EjercicioEntity])],
  providers: [EjercicioService,UserService, AuthService, JwtStrategy, JwtService],
  controllers: [EjercicioController]
})
export class EjercicioModule {}
