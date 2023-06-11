import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForoEntity } from '../foro/foro.entity';
import { ForoPublicacionController } from './foro-publicacion.controller';
import { ForoPublicacionService } from './foro-publicacion.service';
import { PublicacionEntity } from '../publicacion/publicacion.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([ForoEntity, PublicacionEntity])],
  providers: [ForoPublicacionService, UserService, AuthService, JwtStrategy, JwtService],
  controllers: [ForoPublicacionController],
})
export class ForoPublicacionModule {}
