import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { IsDate, IsNumber, IsString } from 'class-validator'

@Entity({ name: 'Verse' })
export default class VerseEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number

  @Column({ type: 'varchar', nullable: false, default: '' })
  @IsString()
  name: string

  @Column({ type: 'varchar', nullable: false, default: '' })
  @IsString()
  contents: string

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  @IsDate()
  created_at: Date

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)'
  })
  @IsDate()
  updated_at: Date
}
