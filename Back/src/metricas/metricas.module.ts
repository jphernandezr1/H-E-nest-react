import { Module } from '@nestjs/common';
import { MetricasService } from './metricas.service';
import { MetricasEntity } from './metricas.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricasController } from './metricas.controller';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [MetricasService,UserService, AuthService, JwtStrategy, JwtService],
  imports: [TypeOrmModule.forFeature([MetricasEntity])],
  controllers: [MetricasController],
})
export class MetricasModule {}
