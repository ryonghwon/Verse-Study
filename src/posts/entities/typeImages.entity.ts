import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { IsString } from 'class-validator'
import CoreEntity from '../../common/entities/core.entity'
import PicturesEntity from '../../common/entities/pictures.entity'

@Entity({ name: 'Type_images' })
export default class TypeImagesEntity extends CoreEntity {
  @ManyToOne(() => PicturesEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    cascade: true
  })
  @JoinColumn({ name: 'image' })
  image: PicturesEntity

  @Column({ type: 'varchar', nullable: false, default: '' })
  @IsString()
  title: string

  @Column({ type: 'longtext', nullable: false })
  @IsString()
  description: string
}
