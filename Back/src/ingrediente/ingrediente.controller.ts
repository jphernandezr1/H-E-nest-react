import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Role } from '../shared/security/role.enum';
import { RolesGlobales } from '../shared/security/roles-globales.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { IngredienteDto } from './ingrediente.dto';
import { IngredienteEntity } from './ingrediente.entity';
import { IngredienteService } from './ingrediente.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/roles.guard';
import { Roles } from '../shared/security/roles.decorator';

@RolesGlobales(Role.INGREDIENTE_T, Role.ADMIN)
@Controller('ingredientes')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class IngredienteController {

    constructor(private readonly ingredienteService: IngredienteService){}

    @Roles(Role.INGREDIENTE_L)
    @Get()
    async findAll() {
        return await this.ingredienteService.findAll();
    }

    @Roles(Role.INGREDIENTE_L)
    @Get(':ingredienteId')
    async findOne(@Param('ingredienteId') ingredienteId: string) {
        return await this.ingredienteService.findOne(ingredienteId);
    }

    @Roles(Role.INGREDIENTE_E)
    @Post()
    async create(@Body() ingredienteDTO: IngredienteDto) {
        const ingrediente: IngredienteEntity = plainToInstance(IngredienteEntity, ingredienteDTO);
        return await this.ingredienteService.create(ingrediente);
    }

    @Roles(Role.INGREDIENTE_E)
    @Put(':ingredienteId')
    async update(@Param('ingredienteId') ingredienteId: string, @Body() ingredienteDTO: IngredienteDto) {
        const ingrediente: IngredienteEntity = plainToInstance(IngredienteEntity, ingredienteDTO);
        return await this.ingredienteService.update(ingredienteId, ingrediente);
    }

    @Roles(Role.INGREDIENTE_D)
    @Delete(':ingredienteId')
    @HttpCode(204)
    async delete(@Param('ingredienteId') ingredienteId: string) {
        return await this.ingredienteService.delete(ingredienteId);
    }

}
