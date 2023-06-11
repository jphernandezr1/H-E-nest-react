import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Role } from '../shared/security/role.enum';
import { Roles } from '../shared/security/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RecetaDto } from './receta.dto';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';
import { RoleGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { RolesGlobales } from 'src/shared/security/roles-globales.decorator';

@RolesGlobales(Role.RECETA_T, Role.ADMIN)
@Controller('recetas')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class RecetaController {

    constructor(private readonly recetaService: RecetaService) {}
    
    @Roles(Role.RECETA_L)
    @Get()
    async findAll() {
        return await this.recetaService.findAll();
    }
    
    @Roles(Role.RECETA_L)
    @Get(':recetaId')
    async findOne(@Param('recetaId') recetaId: string) {
        return await this.recetaService.findOne(recetaId);
    }

    @Roles(Role.RECETA_E)
    @Post()
    async create(@Body() recetaDTO: RecetaDto) {
        const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDTO);
        return await this.recetaService.create(receta);
    }
    
    @Roles(Role.RECETA_E)
    @Put(':recetaId')
    async update(@Param('recetaId') recetaId: string, @Body() recetaDTO: RecetaDto) {
        const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDTO);
        return await this.recetaService.update(recetaId, receta);
    }
    
    @Roles(Role.RECETA_E)
    @Put('calorias/:recetaId')
    async updateCalorias(@Param('recetaId') recetaId: string, @Body() calorias : number) {
        return await this.recetaService.updateCalorias(recetaId, calorias);
    }

    @Roles(Role.RECETA_E)
    @Put('like/:recetaId')
    async updateLikes(@Param('recetaId') recetaId: string) {
        return await this.recetaService.updateLikes(recetaId);
    }
    
    @Roles(Role.RECETA_D)
    @Delete(':recetaId')
    @HttpCode(204)
    async delete(@Param('recetaId') recetaId: string) {
        return await this.recetaService.delete(recetaId);
    }

    
}
