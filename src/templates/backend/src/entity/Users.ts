import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 45
    })
    first_name: string;

    @Column({
        length: 45
    })
    last_name: string;

    @Column({
        length: 45,
        unique: true
    })
    email: string;

    @Column({
        length: 45
    })
    password: string;

    @Column({
        type: "datetime",
        default: () => "CURRENT_TIMESTAMP"
    })
    created_at: string;

    @Column({
        type: "datetime",
        nullable: true
    })
    updated_at: string;

}
