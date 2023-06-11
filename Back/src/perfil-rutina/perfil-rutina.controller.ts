
/* eslint-disable prettier/prettier */
import {  Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PerfilDto } from 'src/perfil/perfil.dto';
import { RutinaDto } from 'src/rutina/rutina.dto';
import { RutinaEntity } from 'src/rutina/rutina.entity';
import { Role } from 'src/shared/security/role.enum';
import { RolesGlobales } from 'src/shared/security/roles-globales.decorator';
import { Roles } from 'src/shared/security/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PerfilRutinaService } from './perfil-rutina.service';

@RolesGlobales(Role.RUTINA_PERFIL_T, Role.ADMIN)
@Controller('perfil')
@UseInterceptors(BusinessErrorsInterceptor)
export class PerfilRutinaController {
    constructor(private readonly perfilRutinaService: PerfilRutinaService){}

    @Roles(Role.RUTINA_PERFIL_E)
    @Post(':perfilId/rutinas/:rutinaId')
   async addRutinaPerfil(@Param('perfilId') perfilId: string, @Param('rutinaId') rutinaId: string){
       return await this.perfilRutinaService.addRutinaPerfil(perfilId, rutinaId);
   }


   @Roles(Role.RUTINA_PERFIL_L)
   @Get(':perfilId/rutinas/:rutinaId')
   async findRutinaByPerfilIdRutinaId(@Param('perfilId') museumId: string, @Param('rutinaId') artworkId: string){
       return await this.perfilRutinaService.findRutinaByPerfilIdRutinaId(museumId, artworkId);
   }

   @Roles(Role.RUTINA_PERFIL_L)
   @Get(':perfilId/rutinas')
   async findARutinasByPerfilId(@Param('perfilId') perfilId: string){
       return await this.perfilRutinaService.findARutinasByPerfilId(perfilId);
   }

   @Roles(Role.RUTINA_PERFIL_E)
   @Put(':perfilId/rutinas')
   async associateRutinPerfil(@Body() rutinasDto: PerfilDto[], @Param('perfilId') perfilId: string){
       const rutinas = plainToInstance(RutinaEntity, rutinasDto)
       return await this.perfilRutinaService.associateRutinPerfil(perfilId, rutinas);
   }

   @Roles(Role.RUTINA_PERFIL_D)
   @Delete(':perfilId/rutinas/:rutinaId')
@HttpCode(204)
   async deleteRutinaPerfil(@Param('perfilId') perfilId: string, @Param('rutinaId') rutinaId: string){
       return await this.perfilRutinaService.deleteRutinaPerfil(perfilId, rutinaId);
   }
}
