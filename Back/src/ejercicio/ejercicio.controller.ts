
import {Body,Controller,Delete,Get,HttpCode,Param,Post,Put,UseGuards,UseInterceptors,} from '@nestjs/common';
import { EjercicioService } from './ejercicio.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { EjercicioDto } from './ejercicio.dto';
import { EjercicioEntity } from './ejercicio.entity';
import { plainToInstance } from 'class-transformer';
import { RolesGlobales } from 'src/shared/security/roles-globales.decorator';
import { Role } from 'src/shared/security/role.enum';
import { Roles } from 'src/shared/security/roles.decorator';


@RolesGlobales(Role.EJERCICIO_T, Role.ADMIN)
@Controller('ejercicios')
@UseInterceptors(BusinessErrorsInterceptor)
export class EjercicioController {
    constructor(private readonly service: EjercicioService) {}

    @Roles(Role.EJERCICIO_L)
    @Get()
    async findAll() {
        return await this.service.findAll();
    }

    @Roles(Role.EJERCICIO_L)
    @Get(':ejercicioId')
    async findOne(@Param('ejercicioId') metricaId: string) {
        return await this.service.findOne(metricaId);
    }

   
    @Roles(Role.EJERCICIO_E)
    @Post()
    @HttpCode(201)
    async create(@Body() metricasDto: EjercicioDto) {
        const metrica: EjercicioEntity = plainToInstance(EjercicioEntity, metricasDto);
        return await this.service.create(metrica);
    }

    @Roles(Role.EJERCICIO_E)
    @Put(':ejercicioId')
    async update(@Param('ejercicioId') metricaId: string, @Body() metricasDto: EjercicioDto) {
        const metrica: EjercicioEntity = plainToInstance(EjercicioEntity, metricasDto);
        return await this.service.update(metricaId, metrica);
    }

    @Roles(Role.EJERCICIO_D)
    @Delete(':ejercicioId')
    @HttpCode(204)
    async delete(@Param('ejercicioId') metricaId: string) {
        return await this.service.delete(metricaId);
    }
}
