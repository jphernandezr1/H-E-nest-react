import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ForoModule } from './foro/foro.module';
import { PublicacionModule } from './publicacion/publicacion.module';
import { ForoEntity } from './foro/foro.entity';
import { PublicacionEntity } from './publicacion/publicacion.entity';
import { IngredienteModule } from './ingrediente/ingrediente.module';
import { RecetaModule } from './receta/receta.module';
import { CantidadModule } from './cantidad/cantidad.module';
import { IngredienteEntity } from './ingrediente/ingrediente.entity';
import { RecetaEntity } from './receta/receta.entity';
import { CantidadEntity } from './cantidad/cantidad.entity';
import { PerfilModule } from './perfil/perfil.module';
import { MetricasModule } from './metricas/metricas.module';
import { PerfilEntity } from './perfil/perfil.entity';
import { MetricasEntity } from './metricas/metricas.entity';
import { RutinaModule } from './rutina/rutina.module';
import { EjercicioModule } from './ejercicio/ejercicio.module';
import { RutinaEntity } from './rutina/rutina.entity';
import { EjercicioEntity } from './ejercicio/ejercicio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForoPublicacionModule } from './foro-publicacion/foro-publicacion.module';
import { PerfilPublcadorModule } from './perfil-publcador/perfil-publcador.module';
import { PerfilLikesModule } from './perfil-likes/perfil-likes.module';
import { PerfilMetricasModule } from './perfil-metricas/perfil-metricas.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RutinaRecetaModule } from './rutina-receta/rutina-receta.module';
import { PerfilRutinaService } from './perfil-rutina/perfil-rutina.service';
import { PerfilRutinaModule } from './perfil-rutina/perfil-rutina.module';
import { RutinaEjercicioModule } from './rutina-ejercicio/rutina-ejercicio.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './auth/guards/roles.guard';


@Module({
  imports: [
    PerfilModule,
    MetricasModule,
    IngredienteModule,
    RecetaModule,
    CantidadModule,
    RutinaModule,
    RutinaRecetaModule,
    RutinaEjercicioModule,
    EjercicioModule,
    ForoModule, 
    PublicacionModule,
    ForoPublicacionModule,
    PerfilPublcadorModule,
    PerfilLikesModule,
    PerfilMetricasModule,
    UserModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '35.194.60.97',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [
        MetricasEntity,
        PerfilEntity,
        IngredienteEntity,
        RecetaEntity,
        CantidadEntity,
        RutinaEntity,
        EjercicioEntity,
        ForoEntity,
        PublicacionEntity,
      ],
      dropSchema: false,
      synchronize: false,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService,AuthService, JwtStrategy, UserService, JwtService, {
    provide: APP_GUARD,
    useClass:RoleGuard,
  }],
})
export class AppModule {}
