import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  Column,
  BeforeInsert
} from 'typeorm';
import { IsBoolean } from 'class-validator';

@Entity()
export class Todo {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({
    unique: true
  })
  content: string;

  @Column()
  @IsBoolean()
  isCompleted: boolean;

  // dành cho Default
  @BeforeInsert()
  beforeInsertAction() {
    this.isCompleted = false;
  }
}
