import { Test, TestingModule } from '@nestjs/testing';
import { PerfilPublcadorService } from './perfil-publcador.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { PublicacionEntity } from '../publicacion/publicacion.entity';
import { PerfilEntity } from '../perfil/perfil.entity';

describe('PerfilPublcadorService', () => {
  let service: PerfilPublcadorService;
  let perfilRepository: Repository<PerfilEntity>;
  let publicadorRepository: Repository<PublicacionEntity>;
  let perfil: PerfilEntity;
  let publicacionesList: PublicacionEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerfilPublcadorService],
    }).compile();

    service = module.get<PerfilPublcadorService>(PerfilPublcadorService);
    perfilRepository = module.get<Repository<PerfilEntity>>(
      getRepositoryToken(PerfilEntity),
    );
    publicadorRepository = module.get<Repository<PublicacionEntity>>(
      getRepositoryToken(PublicacionEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    publicadorRepository.clear();
    perfilRepository.clear();

    publicacionesList = [];
    for(let i = 0; i < 5; i++){
        
      const publicacion: PublicacionEntity = await publicadorRepository.save({
        texto: faker.name.fullName(),
        numMegusta: Math.floor(Math.random() * 60) + 1
      });
      publicacionesList.push(publicacion);   
    }

    perfil = await perfilRepository.save({
      nombre: faker.name.fullName(),
      correo: faker.internet.email(),
      fechaDeNacimiento: faker.datatype.string(),
      documento: faker.datatype.number(),
      publicacion: publicacionesList,
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPublicacion should add an publicacion to a perfil', async () => {
    const newPub: PublicacionEntity = await publicadorRepository.save({
      id: faker.datatype.uuid(),
      texto: faker.name.fullName(),
      numMegusta: Math.floor(Math.random() * 60) + 1
    });

    const newPerfil: PerfilEntity = await perfilRepository.save({
      nombre: faker.name.fullName(),
      correo: faker.internet.email(),
      fechaDeNacimiento: faker.datatype.string(),
      documento: 10,
    })

    const result: PerfilEntity = await service.addPublicacionPerfil(newPerfil.id, newPub.id);
    
    expect(result.publicacion.length).toBe(1);
    expect(result.publicacion[0]).not.toBeNull();
    expect(result.publicacion[0].id).toBe(newPub.id)
    expect(result.publicacion[0].texto).toBe(newPub.texto)
    expect(result.publicacion[0].numMegusta).toBe(newPub.numMegusta)
    
  });

  it('addPublicacionPerfil should thrown exception for an invalid publicacion', async () => {
    const newPerfil: PerfilEntity = await perfilRepository.save({
      nombre: faker.name.fullName(),
      correo: faker.internet.email(),
      fechaDeNacimiento: faker.datatype.string(),
      documento: faker.datatype.number(),
    })

    await expect(() => service.addPublicacionPerfil(newPerfil.id, "0")).rejects.toHaveProperty("message", "la publicacion con ese id no fue encontrada");
  });

  it('addPublicacionPerfil should throw an exception for an invalid perfil', async () => {
    const newPub: PublicacionEntity = await publicadorRepository.save({
      id: faker.datatype.uuid(),
      texto: faker.name.fullName(),
      numMegusta: Math.floor(Math.random() * 60) + 1
    });

    await expect(() => service.addPublicacionPerfil("0", newPub.id)).rejects.toHaveProperty("message", "el perfil con ese id no fue encontrado");
  });

  it('findPublicacionPorPerfilIdPublicacionID should return publicacion by perfil', async () => {
    const pub: PublicacionEntity = publicacionesList[0];
    const pubguardada: PublicacionEntity = await service.findPublicacionPorPerfilIdpublicacionId(perfil.id, pub.id, )
    expect(pubguardada).not.toBeNull();
    expect(pubguardada.id).toBe(pub.id)
    expect(pubguardada.texto).toBe(pub.texto)
    expect(pubguardada.numMegusta).toBe(pub.numMegusta)
  });

  it('findPublicacionPorPerfilIdPublicacionID should throw an exception for an invalid publicacion', async () => {
    await expect(()=> service.findPublicacionPorPerfilIdpublicacionId(perfil.id, "0")).rejects.toHaveProperty("message", "la publicacion con ese id no fue encontrada"); 
  });

  it('findPublicacionPorPerfilIdPublicacionID should throw an exception for an invalid perfil', async () => {
    const pub: PublicacionEntity = publicacionesList[0]; 
    await expect(()=> service.findPublicacionPorPerfilIdpublicacionId("0", pub.id)).rejects.toHaveProperty("message", "el perfil con ese id no fue encontrado"); 
  });

  it('findPublicacionPorPerfilIdPublicacionID should throw an exception for an publicacion not associated to the perfil', async () => {
    const newPub: PublicacionEntity = await publicadorRepository.save({
      id: faker.datatype.uuid(),
      texto: faker.name.fullName(),
      numMegusta: Math.floor(Math.random() * 60) + 1
    });

    await expect(()=> service.findPublicacionPorPerfilIdpublicacionId(perfil.id, newPub.id)).rejects.toHaveProperty("message", "la publicacion con ese id no esta asociada al perfil"); 
  });

  it('findPublicacionPorPerfilId should return publicaciones by perfil', async ()=>{
    const publicaciones: PublicacionEntity[] = await service.findPublicacionPorPerfilId(perfil.id);
    expect(publicaciones.length).toBe(5)
  });

  it('findPublicacionPorPerfilId should throw an exception for an invalid perfil', async () => {
    await expect(()=> service.findPublicacionPorPerfilId("0")).rejects.toHaveProperty("message", "el perfil con ese id no fue encontrado"); 
  });

  it('asociarPublicacionPerfil should update publicacion list for a perfil', async () => {
    const newPub: PublicacionEntity = await publicadorRepository.save({
      id: faker.datatype.uuid(),
      texto: faker.name.fullName(),
      numMegusta: Math.floor(Math.random() * 60) + 1
    });

    const updatedPerfil: PerfilEntity = await service.asociarPublicacionPerfil(perfil.id, [newPub]);
    expect(updatedPerfil.publicacion.length).toBe(1);

    expect(updatedPerfil.publicacion[0]).not.toBeNull();
    expect(updatedPerfil.publicacion[0].id).toBe(newPub.id)
    expect(updatedPerfil.publicacion[0].texto).toBe(newPub.texto)
    expect(updatedPerfil.publicacion[0].numMegusta).toBe(newPub.numMegusta)
  });

  it('asociarPublicacionPerfil should throw an exception for an invalid perfil', async () => {
    const newPub: PublicacionEntity = await publicadorRepository.save({
      id: faker.datatype.uuid(),
      texto: faker.name.fullName(),
      numMegusta: Math.floor(Math.random() * 60) + 1
    });

    await expect(()=> service.asociarPublicacionPerfil("0", [newPub])).rejects.toHaveProperty("message", "el perfil con ese id no fue encontrado"); 
  });

  it('asociarPublicacionPerfil should throw an exception for an invalid publicacion', async () => {
    const newpubs: PublicacionEntity = publicacionesList[0];
    newpubs.id = "0";

    await expect(()=> service.asociarPublicacionPerfil(perfil.id, [newpubs])).rejects.toHaveProperty("message", "la publicacion con ese id no fue encontrada"); 
  });

  it('deletePublicacionPerfil should remove an publicacion from a perfil', async () => {
    const pub: PublicacionEntity = publicacionesList[0];
    
    await service.deletePublicacionPerfil(perfil.id, pub.id);

    const storedPerfil: PerfilEntity = await perfilRepository.findOne({where: {id: perfil.id}, relations: ["publicacion"]});
    const deletedPub: PublicacionEntity = storedPerfil.publicacion.find(a => a.id === pub.id);

    expect(deletedPub).toBeUndefined();

  });

  it('deletePublicacionPerfil should thrown an exception for an invalid publicacion', async () => {
    await expect(()=> service.deletePublicacionPerfil(perfil.id, "0")).rejects.toHaveProperty("message", "la publicacion con ese id no fue encontrada"); 
  });

  it('deletePublicacionPerfil should thrown an exception for an invalid perfil', async () => {
    const pub: PublicacionEntity = publicacionesList[0];
    await expect(()=> service.deletePublicacionPerfil("0", pub.id)).rejects.toHaveProperty("message", "el perfil con ese id no fue encontrado"); 
  });

  it('deletePublicacionPerfil should thrown an exception for an non asocciated publicacion', async () => {
    const newPub: PublicacionEntity = await publicadorRepository.save({
      id: faker.datatype.uuid(),
      texto: faker.name.fullName(),
      numMegusta: Math.floor(Math.random() * 60) + 1
    });

    await expect(()=> service.deletePublicacionPerfil(perfil.id, newPub.id)).rejects.toHaveProperty("message", "la publicacion con ese id no esta asociada al perfil"); 
  }); 


});
