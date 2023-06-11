import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { Roles } from '../shared/security/roles.decorator';
import { RoleGuard } from '../auth/guards/roles.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { Role } from '../shared/security/role.enum';
import { RolesGlobales } from '../shared/security/roles-globales.decorator';
import { CantidadDto } from './cantidad.dto';
import { CantidadEntity } from './cantidad.entity';
import { CantidadService } from './cantidad.service';
import { RecetaService } from 'src/receta/receta.service';

@RolesGlobales(Role.CANTIDAD_T, Role.ADMIN)
@Controller('cantidades')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class CantidadController {
    constructor(private readonly cantidadService: CantidadService, private readonly recetaService: RecetaService) {}
    
    @Roles(Role.CANTIDAD_L)
    @Get()
    async findAll() {
        return await this.cantidadService.findAll();
    }
    @Roles(Role.CANTIDAD_L)
    @Get(':cantidadId')
    async findOne(@Param('cantidadId') cantidadId: string) {
        return await this.cantidadService.findOne(cantidadId);
    }
    
    @Roles(Role.CANTIDAD_L)
    @Get(':cantidadId/recetas/:recetaId/ingredientes/:ingredienteId')
    async findIngrredienteByRecetaIdIngredienteId(@Param('cantidadId') cantidadId: string, @Param('recetaId') recetaId: string, @Param('ingredienteId') ingredienteId: string) {
        return await this.cantidadService.findIngrredienteByRecetaIdIngredienteId(recetaId, ingredienteId);
    }

    @Roles(Role.CANTIDAD_L)
    @Get('/recetas/:recetaId/ingredientes')
    async findIngredientesByRecetaId(@Param('recetaId') recetaId: string) {
        return await this.cantidadService.findIngredientesByRecetaId(recetaId);
    }

    @Roles(Role.CANTIDAD_E)
    @Post()
    async create(@Body() cantidadDTO: CantidadDto) {
        const cantidad: CantidadEntity = plainToInstance(CantidadEntity, cantidadDTO);
        return await this.cantidadService.create(cantidad);
    }

    @Roles(Role.CANTIDAD_E)
    @Post(':cantidadId/recetas/:recetaId/ingredientes/:ingredienteId')
    async addIngredienteToReceta(@Param('cantidadId') cantidadId: string, @Param('recetaId') recetaId: string, @Param('ingredienteId') ingredienteId: string) {
        const receta = await this.cantidadService.addIngredienteToReceta(recetaId, ingredienteId, cantidadId)
        return await this.recetaService.updateCalorias(recetaId, receta.calTotales);
    }

    @Roles(Role.CANTIDAD_E)
    @Put(':cantidadId')
    async update(@Param('cantidadId') cantidadId: string, @Body() cantidadDTO: CantidadDto) {
        const cantidad: CantidadEntity = plainToInstance(CantidadEntity, cantidadDTO);
        return await this.cantidadService.update(cantidadId, cantidad);
    }

    @Roles(Role.CANTIDAD_D)
    @Delete(':cantidadId')
    @HttpCode(204)
    async delete(@Param('cantidadId') cantidadId: string) {
        return await this.cantidadService.delete(cantidadId);
    }

    @Roles(Role.CANTIDAD_D)
    @Delete(':cantidadId/recetas/:recetaId/ingredientes/:ingredienteId')
    @HttpCode(204)
    async deleteIngredienteFromReceta(@Param('cantidadId') cantidadId: string, @Param('recetaId') recetaId: string, @Param('ingredienteId') ingredienteId: string) {
        return await this.cantidadService.deleteIngredienteFromReceta(recetaId, ingredienteId);
    }
    
}
