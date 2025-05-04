import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'SearchLogsRequest' })
export class SearchLogsRequestDto {
    @ApiProperty({ example: '2024-12-11' })
        startDate: string;

    @ApiProperty({ example: '2024-12-11' })
        endDate: string;
}