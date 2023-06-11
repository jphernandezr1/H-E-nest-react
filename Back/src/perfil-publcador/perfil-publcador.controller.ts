import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PublicacionEntity } from '../publicacion/publicacion.entity';
import { PublicacionDto } from '../publicacion/publicacion.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PerfilPublcadorService } from './perfil-publcador.service';
import { RolesGlobales } from '../shared/security/roles-globales.decorator';
import { Role } from '../shared/security/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/roles.guard';
import { Roles } from '../shared/security/roles.decorator';
@RolesGlobales(Role.PERFIL_LIKES_T, Role.ADMIN)
@Controller('perfil')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class PerfilPublcadorController {
constructor(
    private readonly perfilPublicadorService: PerfilPublcadorService,
) {}
@Roles(Role.PERFIL_PUBLICACION_E)
@Post(':perfilId/publicaciones/:publicacionId')
async addpublicacionPerfil(
    @Param('perfilId') perfilId: string,
    @Param('publicacionId') publicacionId: string,
) {
    return await this.perfilPublicadorService.addPublicacionPerfil(
    perfilId,
    publicacionId,
    );
}
@Roles(Role.PERFIL_PUBLICACION_L)
@Get(':perfilId/publicaciones/:publicacionId')
async findPublicacionPorPerfilIdpublicacionId(
    @Param('perfilId') perfilId: string,
    @Param('publicacionId') publicacionId: string,
) {
    return await this.perfilPublicadorService.findPublicacionPorPerfilIdpublicacionId(
    perfilId,
    publicacionId,
    );
}
@Roles(Role.PERFIL_PUBLICACION_L)
@Get(':perfilId/publicaciones')
async findPublicacionPorPerfilId(@Param('perfilId') perfilId: string) {
    return await this.perfilPublicadorService.findPublicacionPorPerfilId(perfilId);
}
@Roles(Role.PERFIL_PUBLICACION_E)
@Put(':perfilId/publicaciones')
async asociarPublicacionPerfil(
    @Body() publicacionesDto: PublicacionDto[],
    @Param('perfilId') foroId: string,
) {
    const publicacion = plainToInstance(PublicacionEntity, publicacionesDto);
    return await this.perfilPublicadorService.asociarPublicacionPerfil(
    foroId,
    publicacion,
    );
}
@Roles(Role.PERFIL_PUBLICACION_D)
@Delete(':perfilId/publicaciones/:publicacionId')
@HttpCode(204)
async deletePublicacionPerfil(
    @Param('perfilId') perfilId: string,
    @Param('publicacionId') publicacionId: string,
) {
    return await this.perfilPublicadorService.deletePublicacionPerfil(
    perfilId,
    publicacionId,
    );
}
}
