import { Module } from '@nestjs/common';
import { PublicacionService } from './publicacion.service';
import { PublicacionEntity } from './publicacion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicacionController } from './publicacion.controller';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [PublicacionService,UserService, AuthService, JwtStrategy, JwtService],
  imports: [TypeOrmModule.forFeature([PublicacionEntity])],
  controllers: [PublicacionController],
})
export class PublicacionModule {}
