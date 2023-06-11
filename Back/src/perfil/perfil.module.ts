import { Module } from '@nestjs/common';
import { PerfilService } from './perfil.service';
import { PerfilEntity } from './perfil.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfilController } from './perfil.controller';
import { UserService } from '../user/user.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [PerfilService,UserService, AuthService, JwtStrategy, JwtService],
  imports: [TypeOrmModule.forFeature([PerfilEntity])],
  controllers: [PerfilController],
})
export class PerfilModule {}
