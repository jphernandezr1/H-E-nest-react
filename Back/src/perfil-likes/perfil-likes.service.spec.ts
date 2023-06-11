import { PerfilLikesService } from './perfil-likes.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { PublicacionEntity } from '../publicacion/publicacion.entity';
import { PerfilEntity } from '../perfil/perfil.entity';

describe('PerfilLikesService', () => {
  let service: PerfilLikesService;
  let perfilRepository: Repository<PerfilEntity>;
  let likesRepository: Repository<PublicacionEntity>;
  let perfil: PerfilEntity;
  let likesList: PublicacionEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerfilLikesService],
    }).compile();

    service = module.get<PerfilLikesService>(PerfilLikesService);
    perfilRepository = module.get<Repository<PerfilEntity>>(
      getRepositoryToken(PerfilEntity),
    );
    likesRepository = module.get<Repository<PublicacionEntity>>(
      getRepositoryToken(PublicacionEntity),
    );
    await seedDatabase();
  });
  const seedDatabase = async () => {
    likesRepository.clear();
    perfilRepository.clear();

    likesList = [];
    for(let i = 0; i < 5; i++){
        
      const publicacion: PublicacionEntity = await likesRepository.save({
        texto: faker.name.fullName(),
        numMegusta: Math.floor(Math.random() * 60) + 1
      });
      likesList.push(publicacion);   
    }

    perfil = await perfilRepository.save({
      nombre: faker.name.fullName(),
      correo: faker.internet.email(),
      fechaDeNacimiento: faker.datatype.string(),
      documento: faker.datatype.number(),
      likes: likesList,
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addLikePerfil should add an like to a perfil', async () => {
    const newPub: PublicacionEntity = await likesRepository.save({
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

    const result: PerfilEntity = await service.addLikePerfil(newPerfil.id, newPub.id);
    
    expect(result.likes.length).toBe(1);
    expect(result.likes[0]).not.toBeNull();
    expect(result.likes[0].id).toBe(newPub.id)
    expect(result.likes[0].texto).toBe(newPub.texto)
    expect(result.likes[0].numMegusta).toBe(newPub.numMegusta)
    
  });

  it('addLikePerfil should thrown exception for an invalid publicacion', async () => {
    const newPerfil: PerfilEntity = await perfilRepository.save({
      nombre: faker.name.fullName(),
      correo: faker.internet.email(),
      fechaDeNacimiento: faker.datatype.string(),
      documento: faker.datatype.number(),
    })

    await expect(() => service.addLikePerfil(newPerfil.id, "0")).rejects.toHaveProperty("message", "el like con ese id no fue encontrada");
  });

  it('addLikePerfil should throw an exception for an invalid perfil', async () => {
    const newPub: PublicacionEntity = await likesRepository.save({
      id: faker.datatype.uuid(),
      texto: faker.name.fullName(),
      numMegusta: Math.floor(Math.random() * 60) + 1
    });

    await expect(() => service.addLikePerfil("0", newPub.id)).rejects.toHaveProperty("message", "el perfil con ese id no fue encontrado");
  });

  it('findLikePorPerfilIdlikeId should return like by perfil', async () => {
    const newLike: PublicacionEntity = likesList[0];
    const pubguardada: PublicacionEntity = await service.findLikePorPerfilIdlikeId(perfil.id, newLike.id, )
    expect(pubguardada).not.toBeNull();
    expect(pubguardada.id).toBe(newLike.id)
    expect(pubguardada.texto).toBe(newLike.texto)
    expect(pubguardada.numMegusta).toBe(newLike.numMegusta)
  });

  it('findLikePorPerfilIdlikeId should throw an exception for an invalid like', async () => {
    await expect(()=> service.findLikePorPerfilIdlikeId(perfil.id, "0")).rejects.toHaveProperty("message", "el like con ese id no fue encontrada"); 
  });

  it('findLikePorPerfilIdlikeId should throw an exception for an invalid perfil', async () => {
    const newLike: PublicacionEntity = likesList[0]; 
    await expect(()=> service.findLikePorPerfilIdlikeId("0", newLike.id)).rejects.toHaveProperty("message", "el perfil con ese id no fue encontrado"); 
  });

  it('findLikePorPerfilIdlikeId should throw an exception for an like not associated to the perfil', async () => {
    const newLike: PublicacionEntity = await likesRepository.save({
      id: faker.datatype.uuid(),
      texto: faker.name.fullName(),
      numMegusta: Math.floor(Math.random() * 60) + 1
    });

    await expect(()=> service.findLikePorPerfilIdlikeId(perfil.id, newLike.id)).rejects.toHaveProperty("message", "el like con ese id no esta asociada al perfil"); 
  });

  it('findLikePorPerfilId should return likes by perfil', async ()=>{
    const publicaciones: PublicacionEntity[] = await service.findLikePorPerfilId(perfil.id);
    expect(publicaciones.length).toBe(5)
  });

  it('findLikePorPerfilId should throw an exception for an invalid perfil', async () => {
    await expect(()=> service.findLikePorPerfilId("0")).rejects.toHaveProperty("message", "el perfil con ese id no fue encontrado"); 
  });

  it('asociarlikePerfil should update likes list for a perfil', async () => {
    const newLike: PublicacionEntity = await likesRepository.save({
      id: faker.datatype.uuid(),
      texto: faker.name.fullName(),
      numMegusta: Math.floor(Math.random() * 60) + 1
    });

    const updatedPerfil: PerfilEntity = await service.asociarlikePerfil(perfil.id, [newLike]);
    expect(updatedPerfil.likes.length).toBe(1);

    expect(updatedPerfil.likes[0]).not.toBeNull();
    expect(updatedPerfil.likes[0].id).toBe(newLike.id)
    expect(updatedPerfil.likes[0].texto).toBe(newLike.texto)
    expect(updatedPerfil.likes[0].numMegusta).toBe(newLike.numMegusta)
  });

  it('asociarlikePerfil should throw an exception for an invalid perfil', async () => {
    const newLike: PublicacionEntity = await likesRepository.save({
      id: faker.datatype.uuid(),
      texto: faker.name.fullName(),
      numMegusta: Math.floor(Math.random() * 60) + 1
    });

    await expect(()=> service.asociarlikePerfil("0", [newLike])).rejects.toHaveProperty("message", "el perfil con ese id no fue encontrado"); 
  });

  it('asociarlikePerfil should throw an exception for an invalid like', async () => {
    const newLike: PublicacionEntity = likesList[0];
    newLike.id = "0";

    await expect(()=> service.asociarlikePerfil(perfil.id, [newLike])).rejects.toHaveProperty("message", "el like con ese id no fue encontrada"); 
  });

  it('deleteLikePerfil should remove an like from a perfil', async () => {
    const newLike: PublicacionEntity = likesList[0];
    
    await service.deleteLikePerfil(perfil.id, newLike.id);

    const storedPerfil: PerfilEntity = await perfilRepository.findOne({where: {id: perfil.id}, relations: ["likes"]});
    const deletedPub: PublicacionEntity = storedPerfil.likes.find(a => a.id === newLike.id);

    expect(deletedPub).toBeUndefined();

  });

  it('deleteLikePerfil should thrown an exception for an invalid like', async () => {
    await expect(()=> service.deleteLikePerfil(perfil.id, "0")).rejects.toHaveProperty("message", "el like con ese id no fue encontrada"); 
  });

  it('deleteLikePerfil should thrown an exception for an invalid perfil', async () => {
    const newLike: PublicacionEntity = likesList[0];
    await expect(()=> service.deleteLikePerfil("0", newLike.id)).rejects.toHaveProperty("message", "el perfil con ese id no fue encontrado"); 
  });

  it('deleteLikePerfil should thrown an exception for an non asocciated publicacion', async () => {
    const newLike: PublicacionEntity = await likesRepository.save({
      id: faker.datatype.uuid(),
      texto: faker.name.fullName(),
      numMegusta: Math.floor(Math.random() * 60) + 1
    });

    await expect(()=> service.deleteLikePerfil(perfil.id, newLike.id)).rejects.toHaveProperty("message", "el like con ese id no esta asociada al perfil"); 
  }); 


});
