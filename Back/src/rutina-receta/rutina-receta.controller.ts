import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { RoleGuard } from '../auth/guards/roles.guard';
import { Role } from '../shared/security/role.enum';
import { RolesGlobales } from '../shared/security/roles-globales.decorator';
import { RecetaDto } from '../receta/receta.dto';
import { RecetaEntity } from '../receta/receta.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RutinaRecetaService } from './rutina-receta.service';
import { Roles } from 'src/shared/security/roles.decorator';

@RolesGlobales(Role.RUTINA_RECETA_T, Role.ADMIN)
@Controller('rutinas')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class RutinaRecetaController {
    constructor(private readonly rutinaRecetaService: RutinaRecetaService) {}

    @Roles(Role.RUTINA_RECETA_E)
    @Post(':rutinaId/recetas/:recetaId')
    async create(@Param('rutinaId') rutinaId: string, @Param('recetaId') recetaId: string) {
        return await this.rutinaRecetaService.addRecetaRutina(rutinaId, recetaId);
    }

    @Roles(Role.RUTINA_RECETA_L)
    @Get(':rutinaId/recetas/:recetaId')
    async findRecetaByRutinaIdRecetaId(@Param('rutinaId') rutinaId: string, @Param('recetaId') recetaId: string) {
        return await this.rutinaRecetaService.findRecetaByRutinaIdRecetaId(rutinaId, recetaId);
    }

    @Roles(Role.RUTINA_RECETA_L)
    @Get(':rutinaId/recetas')
    async findRecetasByRutinaId(@Param('rutinaId') rutinaId: string) {
        return await this.rutinaRecetaService.findRecetasByRutinaId(rutinaId);
    }

    @Roles(Role.RUTINA_RECETA_E)
    @Put(':rutinaId/recetas')
    async associateRecetasRutina(@Body() recetasDto: RecetaDto[], @Param('rutinaId') rutinaId: string) {
        const recetas = plainToInstance(RecetaEntity, recetasDto);
        return await this.rutinaRecetaService.associateRecetasRutina(rutinaId, recetas);
    }

    @Roles(Role.RUTINA_RECETA_D)
    @Delete(':rutinaId/recetas/:recetaId')
    @HttpCode(204)
    async deleteRecetaRutina(@Param('rutinaId') rutinaId: string, @Param('recetaId') recetaId: string) {
        return await this.rutinaRecetaService.deleteRecetaRutina(rutinaId, recetaId);
    }
}

