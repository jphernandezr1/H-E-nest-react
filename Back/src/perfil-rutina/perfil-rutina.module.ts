import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfilEntity } from '../perfil/perfil.entity';
import { PerfilRutinaService } from './perfil-rutina.service';
import { RutinaEntity } from '../rutina/rutina.entity';
import { PerfilRutinaController } from './perfil-rutina.controller';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
    providers: [PerfilRutinaService, UserService, AuthService, JwtStrategy, JwtService],
  imports: [TypeOrmModule.forFeature([PerfilEntity, RutinaEntity])],
  controllers: [PerfilRutinaController],
})
export class PerfilRutinaModule {}
