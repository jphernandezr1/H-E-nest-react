import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PublicacionEntity } from '../publicacion/publicacion.entity';
import { MetricasEntity } from '../metricas/metricas.entity';
import { RutinaEntity } from '../rutina/rutina.entity';


@Entity()
export class PerfilEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  correo: string;

  @Column()
  fechaDeNacimiento: string;

  @Column()
  documento: number;

  @OneToMany(() => PublicacionEntity, (publicacion) => publicacion.publicador)
  publicacion: PublicacionEntity[];

  @ManyToMany(() => PublicacionEntity, (likes) => likes.likes)
  @JoinTable()
  likes: PublicacionEntity[];

  @OneToMany(() => MetricasEntity, (metricas) => metricas.perfil)
  metricas: MetricasEntity[];

  @ManyToMany(() => RutinaEntity)
  @JoinTable()
  rutinas: RutinaEntity[];


}