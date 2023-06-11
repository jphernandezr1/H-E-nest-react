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
import { PerfilLikesService } from './perfil-likes.service';
import { RolesGlobales } from '../shared/security/roles-globales.decorator';
import { Role } from '../shared/security/role.enum';
import { RoleGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../shared/security/roles.decorator';

@RolesGlobales(Role.PERFIL_LIKES_T, Role.ADMIN)
@Controller('perfil')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class PerfilLikesController {
constructor(
    private readonly service: PerfilLikesService,
) {}
@Roles(Role.PERFIL_LIKES_E)
@Post(':perfilId/likes/:publicacionId')
async addLikePerfil(
    @Param('perfilId') perfilId: string,
    @Param('publicacionId') publicacionId: string,
) {
    return await this.service.addLikePerfil(
    perfilId,
    publicacionId,
    );
}
@Roles(Role.PERFIL_LIKES_L)
@Get(':perfilId/likes/:publicacionId')
async findLikePorPerfilIdlikeId(
    @Param('perfilId') perfilId: string,
    @Param('publicacionId') publicacionId: string,
) {
    return await this.service.findLikePorPerfilIdlikeId(
    perfilId,
    publicacionId,
    );
}
@Roles(Role.PERFIL_LIKES_L)
@Get(':perfilId/likes')
async findLikePorPerfilId(@Param('perfilId') perfilId: string) {
    return await this.service.findLikePorPerfilId(perfilId);
}
@Roles(Role.PERFIL_LIKES_E)
@Put(':perfilId/likes')
async asociarlikePerfil(
    @Body() publicacionesDto: PublicacionDto[],
    @Param('perfilId') foroId: string,
) {
    const publicacion = plainToInstance(PublicacionEntity, publicacionesDto);
    return await this.service.asociarlikePerfil(
    foroId,
    publicacion,
    );
}
@Roles(Role.PERFIL_LIKES_D)
@Delete(':perfilId/likes/:publicacionId')
@HttpCode(204)
async deleteLikePerfil(
    @Param('perfilId') perfilId: string,
    @Param('publicacionId') publicacionId: string,
) {
    return await this.service.deleteLikePerfil(
    perfilId,
    publicacionId,
    );
}
}
