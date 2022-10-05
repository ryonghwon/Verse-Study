import { Column, Entity } from 'typeorm'
import { IsString } from 'class-validator'
import CoreEntity from '../../common/entities/core.entity'

@Entity({ name: 'City' })
export default class CityEntity extends CoreEntity {
  @Column({ type: 'varchar', length: 45, nullable: false, default: '' })
  @IsString()
  name: string
}
