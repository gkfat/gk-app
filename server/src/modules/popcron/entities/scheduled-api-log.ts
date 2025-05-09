import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ScheduledApiLog {
    constructor(data: Partial<ScheduledApiLog>) {
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
        id: number;

    @Column({ type: 'bigint' })
        scheduled_task_id: number;

    @Column()
        status_code: number;

    @Column()
        response_time: number;

    @Column({
        type: 'json', nullable: true, 
    })
        response_body: any;

    @Column({
        type: 'json', nullable: true, 
    })
        error_message: any;

    @CreateDateColumn()
        create_at: Date;
}

