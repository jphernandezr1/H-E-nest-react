import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RutinaRecetaService } from './rutina-receta.service';
import { RutinaRecetaController } from './rutina-receta.controller';
import { RutinaEntity } from '../rutina/rutina.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UserService } from '../user/user.service';

@Module({
  providers: [RutinaRecetaService, UserService, AuthService, JwtStrategy, JwtService],
  imports: [TypeOrmModule.forFeature([RutinaEntity, RecetaEntity])],
  controllers: [RutinaRecetaController]
})
export class RutinaRecetaModule {}
