import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfilEntity } from '../perfil/perfil.entity';
import { PerfilMetricasService } from './perfil-metricas.service';
import { MetricasEntity } from '../metricas/metricas.entity';
import { PerfilMetricasController } from './perfil-metricas.controller';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [PerfilMetricasService,UserService, AuthService, JwtStrategy, JwtService],
  imports: [TypeOrmModule.forFeature([PerfilEntity, MetricasEntity])],
  controllers: [PerfilMetricasController],
})
export class PerfilMetricasModule {}
