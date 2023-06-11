import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfilPublcadorService } from './perfil-publcador.service';
import { PerfilEntity } from '../perfil/perfil.entity';
import { PublicacionEntity } from '../publicacion/publicacion.entity';
import { PerfilPublcadorController } from './perfil-publcador.controller';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([PerfilEntity, PublicacionEntity])],
  providers: [PerfilPublcadorService, UserService, AuthService, JwtStrategy, JwtService],
  controllers: [PerfilPublcadorController],
})
export class PerfilPublcadorModule {}
