import { Module } from '@nestjs/common';
import { ForoService } from './foro.service';
import { ForoEntity } from './foro.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForoController } from './foro.controller';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [ForoService, UserService, AuthService, JwtStrategy, JwtService],
  imports: [TypeOrmModule.forFeature([ForoEntity])],
  controllers: [ForoController],
})
export class ForoModule {}
