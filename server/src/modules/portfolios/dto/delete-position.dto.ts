import {
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';
import { EnumAssetType } from 'src/enums';

import {
  ApiProperty,
  ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'DeletePositionDto' })
export class DeletePositionDto {
    @IsEnum(EnumAssetType)
    @IsNotEmpty()
    @ApiProperty({
        enum: EnumAssetType, description: '資產類型', 
    })
        assetType: EnumAssetType;
    
    @ValidateIf((o) => o.assetType === EnumAssetType.STOCK)
    @IsString()
    @ApiProperty({ description: '股票 symbol' })
        symbol?: string;
}
