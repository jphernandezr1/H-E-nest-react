import {Body,Controller,Delete,Get,HttpCode,Param,Post,Put,UseGuards,UseInterceptors,} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PerfilService } from './perfil.service';
import { PerfilDto } from './perfil.dto';
import { PerfilEntity } from './perfil.entity';
import { plainToInstance } from 'class-transformer';
import { RolesGlobales } from '../shared/security/roles-globales.decorator';
import { Role } from '../shared/security/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/roles.guard';
import { Roles } from '../shared/security/roles.decorator';

@RolesGlobales(Role.PERFIL_T, Role.ADMIN)
@Controller('perfil')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class PerfilController {
    constructor(private readonly service: PerfilService) {}
    
    @Roles(Role.PERFIL_L)
    @Get()
    async findAll() {
        return await this.service.findAll();
    }

    @Roles(Role.PERFIL_L)
    @Get(':perfilId')
    async findOne(@Param('perfilId') perfilId: string) {
        return await this.service.findOne(perfilId);
    }

    @Roles(Role.PERFIL_E)
    @Post()
    async create(@Body() perfilDto: PerfilDto) {
        const perfil: PerfilEntity = plainToInstance(PerfilEntity, perfilDto);
        return await this.service.create(perfil);
    }
    @Roles(Role.PERFIL_E)
    @Put(':perfilId')
    async update(@Param('perfilId') perfilId: string, @Body() perfilDto: PerfilDto) {
        const perfil: PerfilEntity = plainToInstance(PerfilEntity, perfilDto);
        return await this.service.update(perfilId, perfil);
    }

    @Roles(Role.PERFIL_D)
    @Delete(':perfilId')
    @HttpCode(204)
    async delete(@Param('perfilId') perfilId: string) {
        return await this.service.delete(perfilId);
    }
}

