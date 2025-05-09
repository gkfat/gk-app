import axios from 'axios';
import { Job } from 'bullmq';
import { APP_QUEUE_NAME } from 'src/constants/queue';
import { TaskState } from 'src/enums/task-state.enum';
import { Repository } from 'typeorm';

import {
    Processor,
    WorkerHost,
} from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';

import { ScheduledApiLog } from '../popcron/entities/scheduled-api-log';
import { ScheduledApiTask } from '../popcron/entities/scheduled-api-task';

@Processor(APP_QUEUE_NAME)
export class QueueProcessor extends WorkerHost {
    constructor(
        @InjectRepository(ScheduledApiTask)
        private readonly taskRepo: Repository<ScheduledApiTask>,
        @InjectRepository(ScheduledApiLog)
        private readonly logRepo: Repository<ScheduledApiLog>,
    ) {
        super();
    }

    async process(job: Job<ScheduledApiTask>) {
        const task = job.data;

        await this.taskRepo.update(task.id, { state: TaskState.PROCESSING });
    
        try {
            const start = Date.now();
            const res = await axios.get(task.api_url, { timeout: 5000 });
            const duration = Date.now() - start;
    
            await this.logRepo.insert(
                new ScheduledApiLog({
                    scheduled_task_id: task.id,
                    status_code: res.status,
                    response_body: res.data,
                    response_time: duration,
                }),
            );
    
            await this.taskRepo.update(task.id, { state: TaskState.SUCCESS });
        } catch (err) {
            await this.logRepo.insert(
                new ScheduledApiLog({
                    scheduled_task_id: task.id,
                    error_message: err.message,
                }),
            );
    
            const updated = await this.taskRepo.increment(task.id, 'retries', 1);
            const latest = await this.taskRepo.findOne({ where: { id: task.id } });
    
            if (latest.retries < 3) {
                throw err; // Bull will auto-retry based on job options
            } else {
                await this.taskRepo.update(task.id, { state: TaskState.FAILED });
            }
        }
    }
      
}