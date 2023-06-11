import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfilLikesService } from './perfil-likes.service';
import { PerfilEntity } from '../perfil/perfil.entity';
import { PublicacionEntity } from '../publicacion/publicacion.entity';
import { PerfilLikesController } from './perfil-likes.controller';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([PerfilEntity, PublicacionEntity])],
  providers: [PerfilLikesService,UserService, AuthService, JwtStrategy, JwtService],
  controllers: [PerfilLikesController],
})
export class PerfilLikesModule {}
