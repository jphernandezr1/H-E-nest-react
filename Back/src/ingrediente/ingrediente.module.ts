import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredienteService } from './ingrediente.service';
import { IngredienteEntity } from './ingrediente.entity';
import { IngredienteController } from './ingrediente.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UserService } from '../user/user.service';

@Module({
  providers: [IngredienteService, UserService, AuthService, JwtStrategy, JwtService],
  imports: [TypeOrmModule.forFeature([IngredienteEntity])],
  controllers: [IngredienteController]
})
export class IngredienteModule {}
