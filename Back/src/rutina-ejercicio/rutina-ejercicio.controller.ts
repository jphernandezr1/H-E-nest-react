/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    UseInterceptors
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RutinaEjercicioService } from './rutina-ejercicio.service';
import { EjercicioDto } from '../ejercicio/ejercicio.dto';
import { EjercicioEntity } from '../ejercicio/ejercicio.entity';
import { plainToInstance } from 'class-transformer';
import { RolesGlobales } from 'src/shared/security/roles-globales.decorator';
import { Role } from 'src/shared/security/role.enum';
import { Roles } from 'src/shared/security/roles.decorator';

@RolesGlobales(Role.RUTINA_EJERCICIO_T, Role.ADMIN)
@Controller('rutinas')
@UseInterceptors(BusinessErrorsInterceptor)
export class RutinaEjercicioController {
    constructor(private readonly rutinaEjercicioService: RutinaEjercicioService) { }

    @Roles(Role.RUTINA_EJERCICIO_E)
    @Post(':rutinaId/ejercicios/:ejercicioId')
    async addEjercicioRutina(@Param('rutinaId') rutinaId: string, @Param('ejercicioId') ejercicioId: string) {
        return await this.rutinaEjercicioService.addEjercicioRutina(rutinaId, ejercicioId);
    }

    @Roles(Role.RUTINA_EJERCICIO_L)
    @Get(':rutinaId/ejercicios/:ejercicioId')
    async findEjerciciosByRutinaIdEjercicioId(@Param('rutinaId') rutinaId: string, @Param('ejercicioId') ejercicioId: string) {
        return await this.rutinaEjercicioService.findEjercicioByRutinaIdEjercicioId(rutinaId, ejercicioId);
    }

    @Roles(Role.RUTINA_EJERCICIO_L)
    @Get(':rutinaId/ejercicios')
    async findEjerciciosByRutinaId(@Param('rutinaId') rutinaId: string) {
        return await this.rutinaEjercicioService.findEjercicioByRutinaId(rutinaId);
    }

    @Roles(Role.RUTINA_EJERCICIO_E)
    @Put(':rutinaId/ejercicios')
    async associateArtworksMuseum(@Body() ejerciciosDto: EjercicioDto[], @Param('rutinaId') rutinaId: string) {
        const ejercicios = plainToInstance(EjercicioEntity, ejerciciosDto)
        return await this.rutinaEjercicioService.associateEjerciciosRutina(rutinaId, ejercicios);
    }

    @Roles(Role.RUTINA_EJERCICIO_D)
    @Delete(':rutinaId/ejercicios/:ejerciciosId')
    @HttpCode(204)
    async deleteEjercicioRutina(@Param('rutinaId') rutinaId: string, @Param('ejercicioId') ejercicioId: string) {
        return await this.rutinaEjercicioService.deleteEjercicioRutina(rutinaId, ejercicioId);
    }
}
