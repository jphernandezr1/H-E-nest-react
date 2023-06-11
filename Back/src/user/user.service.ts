import { Injectable } from '@nestjs/common';
import { Role } from '../shared/security/role.enum';
import { User } from './user';

@Injectable()
export class UserService {
    private users: User[] = [
        new User(1, "admin", "admin", [Role.ADMIN]),
        new User(2, "user", "admin", [Role.USER]),
        new User(3, "JulianaRecetaT", "juli", [Role.RECETA_T]),
        new User(4, "JulianaRecetaL", "juli", [Role.RECETA_L]),
        new User(5, "JulianaRecetaE", "juli", [Role.RECETA_E]),
        new User(6, "JulianaRecetaD", "juli", [Role.RECETA_D]),
        new User(7, "JulianaIngredienteT", "juli", [Role.INGREDIENTE_T]),
        new User(8, "JulianaIngredienteL", "juli", [Role.INGREDIENTE_L]),
        new User(9, "JulianaIngredienteE", "juli", [Role.INGREDIENTE_E]),
        new User(10, "JulianaIngredienteD", "juli", [Role.INGREDIENTE_D]),
        new User(11, "JulianaCantidadT", "juli", [Role.CANTIDAD_T]),
        new User(12, "JulianaCantidadL", "juli", [Role.CANTIDAD_L]),
        new User(13, "JulianaCantidadE", "juli", [Role.CANTIDAD_E]),
        new User(14, "JulianaCantidadD", "juli", [Role.CANTIDAD_D]),
        new User(15, "JulianaRutinaRecetaT", "juli", [Role.RUTINA_RECETA_T]),
        new User(16, "JulianaRutinaRecetaL", "juli", [Role.RUTINA_RECETA_L]),
        new User(17, "JulianaRutinaRecetaE", "juli", [Role.RUTINA_RECETA_E]),
        new User(18, "JulianaRutinaRecetaD", "juli", [Role.RUTINA_RECETA_D]),
        new User(80, "MateoEjercicioT", "mate", [Role.EJERCICIO_T]),
        new User(81, "MateoEjercicioL", "mate", [Role.EJERCICIO_L]),
        new User(82, "MateoEjercicioE", "mate", [Role.EJERCICIO_E]),
        new User(83, "MateoEjercicioD", "mate", [Role.EJERCICIO_D]),
        new User(84, "MateoRutinaT", "mate", [Role.RUTINA_T]),
        new User(85, "MateoRutinaL", "mate", [Role.RUTINA_L]),
        new User(86, "MateoRutinaE", "mate", [Role.RUTINA_E]),
        new User(87, "MateoRutinaD", "mate", [Role.RUTINA_D]),
        new User(88, "MateoRutinaEjercicioT", "mate", [Role.RUTINA_EJERCICIO_T]),
        new User(89, "MateoRutinaEjercicioL", "mate", [Role.RUTINA_EJERCICIO_L]),
        new User(90, "MateoRutinaEjercicioE", "mate", [Role.RUTINA_EJERCICIO_E]),
        new User(91, "MateoRutinaEjercicioD", "mate", [Role.RUTINA_EJERCICIO_D]),
        new User(92, "MateoRutinaPerfilT", "mate", [Role.RUTINA_PERFIL_T]),
        new User(93, "MateoRutinaPerfilL", "mate", [Role.RUTINA_PERFIL_L]),
        new User(94, "MateoRutinaPerfilE", "mate", [Role.RUTINA_PERFIL_E]),
        new User(95, "MateoRutinaPerfilD", "mate", [Role.RUTINA_PERFIL_D]),
        new User(19, "JuanT", "juan", [Role.PERFIL_T, Role.PERFIL_LIKES_T, Role.PERFIL_METRICA_T, Role.PERFIL_PUBLICACION_T, Role.METRICA_T, Role.PUBLICACION_T,Role.FORO_T, Role.FORO_PUBLICACION_T, Role.RECETA_T, Role.RUTINA_PERFIL_T, Role.RECETA_T, Role.INGREDIENTE_T,  ]),
        new User(20, "JuanL", "juan", [Role.PERFIL_L, Role.PERFIL_LIKES_L, Role.PERFIL_METRICA_L, Role.PERFIL_PUBLICACION_L, Role.METRICA_L]),
        new User(21, "JuanE", "juan", [Role.PERFIL_E, Role.PERFIL_LIKES_E, Role.PERFIL_METRICA_E, Role.PERFIL_PUBLICACION_E, Role.METRICA_E]),
        new User(22, "JuanD", "juan", [Role.PERFIL_D, Role.PERFIL_LIKES_D, Role.PERFIL_METRICA_D, Role.PERFIL_PUBLICACION_D, Role.METRICA_D]),
        new User(23, "MajoPublicacionT", "majo", [Role.PUBLICACION_T]),
        new User(24, "MajoPublicacionL", "majo", [Role.PUBLICACION_L]),
        new User(25, "MajoPublicacionE", "majo", [Role.PUBLICACION_E]),
        new User(26, "MajoPublicacionD", "majo", [Role.PUBLICACION_D]),
        new User(27, "MajoForoT", "majo", [Role.FORO_T]),
        new User(28, "MajoForoL", "majo", [Role.FORO_L]),
        new User(29, "MajoForoE", "majo", [Role.FORO_E]),
        new User(30, "MajoForoD", "majo", [Role.FORO_D]),
        new User(31, "MajoForoPublicacionT", "majo", [Role.FORO_PUBLICACION_T]),
        new User(32, "MajoForoPublicacionL", "majo", [Role.FORO_PUBLICACION_L]),
        new User(33, "MajoForoPublicacionE", "majo", [Role.FORO_PUBLICACION_E]),
        new User(34, "MajoForoPublicacionD", "majo", [Role.FORO_PUBLICACION_D]),
    ];

    async addRole(id: string, role: string): Promise<User> {
        const user = await this.findOne(id);
        const rol = Role[role];
        user.roles.push(rol);
        return user;
    }

    async findbyusername(username: string): Promise<User> {
        return this.users.find(user => user.username === username);
    }

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }

    async create(user: User): Promise<User> {
        this.users.push(user);
        return user;
    }

    async update(user: User): Promise<User> {
        const index = this.users.findIndex(u => u.id === user.id);
        this.users[index] = user;
        return user;
    }

    async findAll(): Promise<User[]> {
        return this.users;
    }

}