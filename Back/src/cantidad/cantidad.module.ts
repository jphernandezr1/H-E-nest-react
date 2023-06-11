import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CantidadService } from './cantidad.service';
import { CantidadEntity } from './cantidad.entity';
import { CantidadController } from './cantidad.controller';
import { RecetaEntity } from '../receta/receta.entity';
import { IngredienteEntity } from '../ingrediente/ingrediente.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UserService } from '../user/user.service';
import { RecetaService } from 'src/receta/receta.service';

@Module({
  providers: [CantidadService, UserService, AuthService, JwtStrategy, JwtService, RecetaService ],
  imports: [TypeOrmModule.forFeature([CantidadEntity, RecetaEntity, IngredienteEntity])],
  controllers: [CantidadController]
})
export class CantidadModule {}