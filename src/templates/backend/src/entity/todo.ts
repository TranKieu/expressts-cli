import { Entity, ObjectIdColumn, Column, BeforeInsert } from 'typeorm';
import { ObjectID as ObjectIDType } from 'typeorm';
import { IsBoolean } from 'class-validator';

@Entity()
export class Todo {
  @ObjectIdColumn()
  id!: ObjectIDType;

  @Column({
    unique: true
  })
  content!: string;

  @Column()
  @IsBoolean()
  isCompleted!: boolean;

  // dành cho Default
  @BeforeInsert()
  beforeInsertAction() {
    this.isCompleted = false;
  }
}
