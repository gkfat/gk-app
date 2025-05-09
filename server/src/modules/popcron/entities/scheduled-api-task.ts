import { TaskState } from 'src/enums/task-state.enum';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ScheduledApiTask {
    constructor(data: Partial<ScheduledApiTask>) {
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
        id: number;

    @Column({ type: 'bigint' })
        scheduled_api_id: number;
        
    @Column()
        api_url: string;

    @Column()
        execute_at: Date;

    @Column({ default: TaskState.PENDING })
        state: TaskState;

    @Column()
        retries: number;

    @CreateDateColumn()
        create_at: Date;
}

