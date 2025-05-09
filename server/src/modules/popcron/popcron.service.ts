import { Repository } from 'typeorm';

import {
    Injectable,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { RegisterScheduledApiListRequestDto } from './dto/register-scheduled-api';
import { ScheduledApi } from './entities/scheduled-api';
import { ScheduledApiTask } from './entities/scheduled-api-task';

function scheduledApiFormatter(data: ScheduledApi) {
    
}

@Injectable()
export class PopcronService {
    private readonly logger = new Logger(PopcronService.name);
    
    constructor(
            @InjectRepository(ScheduledApi)
            private scheduledApiRepo: Repository<ScheduledApi>,
            @InjectRepository(ScheduledApiTask)
            private scheduledApiTaskRepo: Repository<ScheduledApiTask>,
    ) {}

    async listScheduledApiList(accountId: number) {
        const res = await this.scheduledApiRepo.find({ where: { account_id: accountId } });

        return res;
    }

    async registerScheduledApi(reqBody: RegisterScheduledApiListRequestDto) {
        
    }

}
