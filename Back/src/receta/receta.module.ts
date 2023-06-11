import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';
import { RecetaController } from './receta.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UserService } from '../user/user.service';

@Module({
  providers: [RecetaService, UserService, AuthService, JwtStrategy, JwtService],
  imports: [TypeOrmModule.forFeature([RecetaEntity])],
  controllers: [RecetaController]
})
export class RecetaModule {}
