import { Column, Entity } from 'typeorm'
import { IsOptional, IsString } from 'class-validator'
import CoreEntity from './core.entity'

@Entity({ name: 'Pictures' })
export default class PicturesEntity extends CoreEntity {
  @Column({ type: 'varchar', nullable: false, default: '' })
  @IsString()
  name: string

  @Column({ type: 'varchar', nullable: false, default: '' })
  @IsString()
  stored_name: string

  @Column({ type: 'varchar', nullable: false, default: '' })
  @IsString()
  stored_path: string

  @Column({ type: 'varchar', nullable: false })
  @IsString()
  mime_type: string

  @Column({ type: 'int', nullable: true })
  @IsString()
  @IsOptional()
  width: number

  @Column({ type: 'int', nullable: true })
  @IsString()
  @IsOptional()
  height: number
}
