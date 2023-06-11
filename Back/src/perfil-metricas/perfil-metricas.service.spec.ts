import { Test, TestingModule } from '@nestjs/testing';
import { PerfilMetricasService } from './perfil-metricas.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { MetricasEntity } from '../metricas/metricas.entity';
import { PerfilEntity } from '../perfil/perfil.entity';

describe('PerfilMetricasService', () => {
  let service: PerfilMetricasService;
  let perfilRepository: Repository<PerfilEntity>;
  let metricasRepository: Repository<MetricasEntity>;
  let perfil: PerfilEntity;
  let metricasList: MetricasEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerfilMetricasService],
    }).compile();

    service = module.get<PerfilMetricasService>(PerfilMetricasService);
    perfilRepository = module.get<Repository<PerfilEntity>>(
      getRepositoryToken(PerfilEntity),
    );
    metricasRepository = module.get<Repository<MetricasEntity>>(
      getRepositoryToken(MetricasEntity),
    );
    await seedDatabase();
  });
  const seedDatabase = async () => {
    metricasRepository.clear();
    perfilRepository.clear();

    metricasList = [];
    for(let i = 0; i < 5; i++){
        
      const metrica: MetricasEntity = await metricasRepository.save({
        nombre: faker.name.fullName(),
        unidad: faker.random.word(),
        valor: faker.datatype.number()
      });
      metricasList.push(metrica);   
    }

    perfil = await perfilRepository.save({
      nombre: faker.name.fullName(),
      correo: faker.internet.email(),
      fechaDeNacimiento: faker.datatype.string(),
      documento: faker.datatype.number(),
      metricas: metricasList,
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMetricaPerfil should add an metrica to a perfil', async () => {
    const metrica: MetricasEntity = await metricasRepository.save({
      nombre: faker.name.fullName(),
      unidad: faker.random.word(),
      valor: faker.datatype.number()
    });

    const newPerfil: PerfilEntity = await perfilRepository.save({
      nombre: faker.name.fullName(),
      correo: faker.internet.email(),
      fechaDeNacimiento: faker.datatype.string(),
      documento: 10,
    })

    const result: PerfilEntity = await service.addMetricaPerfil(newPerfil.id, metrica.id);
    
    expect(result.metricas.length).toBe(1);
    expect(result.metricas[0]).not.toBeNull();
    expect(result.metricas[0].id).toBe(metrica.id);
    expect(result.metricas[0].nombre).toBe(metrica.nombre);
    expect(result.metricas[0].unidad).toBe(metrica.unidad);
    expect(result.metricas[0].valor).toBe(metrica.valor);

    
  });

  it('addMetricaPerfil should thrown exception for an invalid metrica', async () => {
    const newPerfil: PerfilEntity = await perfilRepository.save({
      nombre: faker.name.fullName(),
      correo: faker.internet.email(),
      fechaDeNacimiento: faker.datatype.string(),
      documento: faker.datatype.number(),
    })

    await expect(() => service.addMetricaPerfil(newPerfil.id, "0")).rejects.toHaveProperty("message", "la metrica con ese id no fue encontrada");
  });

  it('addMetricaPerfil should throw an exception for an invalid perfil', async () => {
    const metrica: MetricasEntity = await metricasRepository.save({
      nombre: faker.name.fullName(),
      unidad: faker.random.word(),
      valor: faker.datatype.number()
    });

    await expect(() => service.addMetricaPerfil("0", metrica.id)).rejects.toHaveProperty("message", "el perfil con ese id no fue encontrado");
  });

  it('findMetricaPorPerfilIdMetricaId should return metrica by perfil', async () => {
    const metrica: MetricasEntity = metricasList[0];
    const metguardada: MetricasEntity = await service.findMetricaPorPerfilIdMetricaId(perfil.id, metrica.id, )
    expect(metguardada).not.toBeNull();
    expect(metguardada.id).toBe(metrica.id)
    expect(metguardada.nombre).toBe(metrica.nombre)
    expect(metguardada.unidad).toBe(metrica.unidad)
    expect(metguardada.valor).toBe(metrica.valor)
  });

  it('findMetricaPorPerfilIdMetricaId should throw an exception for an invalid metrica', async () => {
    await expect(()=> service.findMetricaPorPerfilIdMetricaId(perfil.id, "0")).rejects.toHaveProperty("message", "la metrica con ese id no fue encontrada"); 
  });

  it('findMetricaPorPerfilIdMetricaId should throw an exception for an invalid perfil', async () => {
    const metrica: MetricasEntity = metricasList[0];
    await expect(()=> service.findMetricaPorPerfilIdMetricaId("0", metrica.id)).rejects.toHaveProperty("message", "el perfil con ese id no fue encontrado"); 
  });

  it('findMetricaPorPerfilIdMetricaId should throw an exception for an metrica not associated to the perfil', async () => {
    const metrica: MetricasEntity = await metricasRepository.save({
      nombre: faker.name.fullName(),
      unidad: faker.random.word(),
      valor: faker.datatype.number()
    });

    await expect(()=> service.findMetricaPorPerfilIdMetricaId(perfil.id, metrica.id)).rejects.toHaveProperty("message", "la metrica con ese id no esta asociada al perfil"); 
  });

  it('findMetricasPorPerfilId should return metricas by perfil', async ()=>{
    const metricas: MetricasEntity[] = await service.findMetricasPorPerfilId(perfil.id);
    expect(metricas.length).toBe(5)
  });

  it('findMetricasPorPerfilId should throw an exception for an invalid perfil', async () => {
    await expect(()=> service.findMetricasPorPerfilId("0")).rejects.toHaveProperty("message", "el perfil con ese id no fue encontrado"); 
  });

  it('asociarMetricasPerfil should update ,metricas list for a perfil', async () => {
    const metrica: MetricasEntity = await metricasRepository.save({
      nombre: faker.name.fullName(),
      unidad: faker.random.word(),
      valor: faker.datatype.number()
    });

    const updatedPerfil: PerfilEntity = await service.asociarMetricasPerfil(perfil.id, [metrica]);
    expect(updatedPerfil.metricas.length).toBe(1);
    expect(updatedPerfil.metricas[0]).not.toBeNull();
    expect(updatedPerfil.metricas[0].id).toBe(metrica.id)
    expect(updatedPerfil.metricas[0].nombre).toBe(metrica.nombre)
    expect(updatedPerfil.metricas[0].unidad).toBe(metrica.unidad)
    expect(updatedPerfil.metricas[0].valor).toBe(metrica.valor)
  });

  it('asociarMetricasPerfil should throw an exception for an invalid perfil', async () => {
    const metrica: MetricasEntity = await metricasRepository.save({
      nombre: faker.name.fullName(),
      unidad: faker.random.word(),
      valor: faker.datatype.number()
    });

    await expect(()=> service.asociarMetricasPerfil("0", [metrica])).rejects.toHaveProperty("message", "el perfil con ese id no fue encontrado"); 
  });

  it('asociarMetricasPerfil should throw an exception for an invalid metrica', async () => {
    const metrica: MetricasEntity = metricasList[0];
    metrica.id = "0";

    await expect(()=> service.asociarMetricasPerfil(perfil.id, [metrica])).rejects.toHaveProperty("message", "la metrica con ese id no fue encontrada"); 
  });

  it('deleteMetricaPerfil should remove an metrica from a perfil', async () => {
    const metrica: MetricasEntity = metricasList[0];
    
    await service.deleteMetricaPerfil(perfil.id, metrica.id);

    const storedPerfil: PerfilEntity = await perfilRepository.findOne({where: {id: perfil.id}, relations: ["metricas"]});
    const deletedMet: MetricasEntity = storedPerfil.metricas.find(a => a.id === metrica.id);

    expect(deletedMet).toBeUndefined();

  });

  it('deleteMetricaPerfil should thrown an exception for an invalid metrica', async () => {
    await expect(()=> service.deleteMetricaPerfil(perfil.id, "0")).rejects.toHaveProperty("message", "la metrica con ese id no fue encontrada"); 
  });

  it('deleteMetricaPerfil should thrown an exception for an invalid perfil', async () => {
    const metrica: MetricasEntity = metricasList[0];
    await expect(()=> service.deleteMetricaPerfil("0", metrica.id)).rejects.toHaveProperty("message", "el perfil con ese id no fue encontrado"); 
  });

  it('deleteMetricaPerfil should thrown an exception for an non asocciated metrica', async () => {
    const metrica: MetricasEntity = await metricasRepository.save({
      nombre: faker.name.fullName(),
      unidad: faker.random.word(),
      valor: faker.datatype.number()
    });

    await expect(()=> service.deleteMetricaPerfil(perfil.id, metrica.id)).rejects.toHaveProperty("message", "la metrica con ese id no esta asociada al perfil"); 
  }); 


});
