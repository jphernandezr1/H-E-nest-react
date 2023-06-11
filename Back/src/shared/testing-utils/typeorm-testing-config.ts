import { TypeOrmModule } from '@nestjs/typeorm';
import { ForoEntity } from '../../foro/foro.entity';
import { PublicacionEntity } from '../../publicacion/publicacion.entity';
import { IngredienteEntity } from '../../ingrediente/ingrediente.entity';
import { RecetaEntity } from '../../receta/receta.entity';
import { CantidadEntity } from '../../cantidad/cantidad.entity';
import { PerfilEntity } from '../../perfil/perfil.entity';
import { MetricasEntity } from '../../metricas/metricas.entity';
import { RutinaEntity } from '../../rutina/rutina.entity';
import { EjercicioEntity } from '../../ejercicio/ejercicio.entity';
export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      ForoEntity,
      PublicacionEntity,
      IngredienteEntity,
      RecetaEntity,
      CantidadEntity,
      PerfilEntity,
      MetricasEntity,
      RutinaEntity,
      EjercicioEntity,
    ],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    ForoEntity,
    PublicacionEntity,
    IngredienteEntity,
    RecetaEntity,
    CantidadEntity,
    PerfilEntity,
    MetricasEntity,
    RutinaEntity,
    EjercicioEntity,
  ]),
  /*TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'he',
    entities: [
      ForoEntity,
      PublicacionEntity,
      IngredienteEntity,
      RecetaEntity,
      CantidadEntity,
      PerfilEntity,
      MetricasEntity,
      RutinaEntity,
      EjercicioEntity,
    ],
    dropSchema: true,
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    ForoEntity,
    PublicacionEntity,
    IngredienteEntity,
    RecetaEntity,
    CantidadEntity,
    PerfilEntity,
    MetricasEntity,
    RutinaEntity,
    EjercicioEntity,
  ]),*/
];
