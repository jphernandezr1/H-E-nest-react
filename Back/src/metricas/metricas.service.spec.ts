/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { MetricasEntity } from './metricas.entity';
import { MetricasService } from './metricas.service';
import { faker } from '@faker-js/faker';

describe('MetricasService', () => {
 let service: MetricasService;
 // eslint-disable-next-line @typescript-eslint/no-unused-vars
 let repository: Repository<MetricasEntity>;
 let metricasList: MetricasEntity[];

 beforeEach(async () => {
   const module: TestingModule = await Test.createTestingModule({
     imports: [...TypeOrmTestingConfig()],
     providers: [MetricasService],
   }).compile();

   service = module.get<MetricasService>(MetricasService);
   repository = module.get<Repository<MetricasEntity>>(getRepositoryToken(MetricasEntity));
   await seedDatabase();
 });

 const seedDatabase = async () => {
  //repository.query('TRUNCATE TABLE "metricas_entity" CASCADE');
  repository.clear();
  metricasList = [];
  for (let i = 0; i < 5; i++) {
    const metrica: MetricasEntity = await repository.save({
      nombre: faker.name.fullName(),
      unidad: faker.random.word(),
      valor: faker.datatype.number()
    });
    metricasList.push(metrica);
  }
}

it('should be defined', () => {
  expect(service).toBeDefined();
});
it('findAll debe retornar todos las metricas', async () => {
  const metricas: MetricasEntity[] = await service.findAll()
  //repository.query('SELECT * FROM metricas_entity');
  expect(metricas).not.toBeNull();
  expect(metricas).toHaveLength(metricasList.length);
});
it('findOne debe retornar una metrica por id', async () => {
  const metricaActual: MetricasEntity = metricasList[0];
  const metrica: MetricasEntity = await service.findOne(metricaActual.id);
  expect(metrica).not.toBeNull();
  expect(metrica.nombre).toEqual(metricaActual.nombre)
  expect(metrica.unidad).toEqual(metricaActual.unidad)
  expect(metrica.valor).toEqual(metricaActual.valor)
});
it('findOne debe retornar error al dar un id no valido', async () => {
  await expect(() => service.findOne("00000000-e89b-12d3-a456-426614174000")).rejects.toHaveProperty("message", "la metrica con ese id, no se encontro")
});
it('create deberia retornar una nueva metrica', async () => {
  
  const metrica: MetricasEntity = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    nombre: faker.name.fullName(),
    unidad: faker.random.word(),
    valor: faker.datatype.number(),
    perfil: null
  }

  const nuevaMetrica: MetricasEntity = await service.create(metrica);
  expect(nuevaMetrica).not.toBeNull();

  const metrica1: MetricasEntity = await repository.findOne({ where: { id: nuevaMetrica.id } })
  expect(metrica1).not.toBeNull();
  expect(metrica1.nombre).toEqual(nuevaMetrica.nombre)
  expect(metrica1.unidad).toEqual(nuevaMetrica.unidad)
  expect(metrica1.valor).toEqual(nuevaMetrica.valor)
});

it('update deberia actualizar una metrica', async () => {
  const metrica: MetricasEntity = metricasList[0];
  metrica.valor = 15;
  const metricaActualizado: MetricasEntity = await service.update(metrica.id, metrica);
  expect(metricaActualizado).not.toBeNull();
  const metrica1: MetricasEntity = await repository.findOne({ where: { id: metrica.id } })
  expect(metrica1).not.toBeNull();
  expect(metrica1.nombre).toEqual(metrica.nombre)
  expect(metrica1.unidad).toEqual(metrica.unidad)
  expect(metrica1.valor).toEqual(metrica.valor)
});
it('update deberia dar un error para una metrica no existente', async () => {
  let metrica: MetricasEntity = metricasList[0];
  metrica = {
    ...metrica, valor: 15
  }
  await expect(() => service.update('10000000-e89b-12d3-a456-426614174000', metrica)).rejects.toHaveProperty("message", "la metrica con ese id, no se encontro")
});
it('delete deberia eliminar una metrica', async () => {
  const metrica: MetricasEntity = metricasList[0];
  await service.delete(metrica.id);
  const metricaEliminado: MetricasEntity = await repository.findOne({ where: { id: metrica.id } })
  expect(metricaEliminado).toBeNull();
});
it('delete deberia generar un error para una metrica no valido', async () => {
  await expect(() => service.delete("10000000-e89b-12d3-a456-426614174000")).rejects.toHaveProperty("message", "la metrica con ese id, no se encontro")
});


});