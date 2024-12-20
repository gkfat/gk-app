import { Response } from 'express';
import { RequirePermissions } from 'src/decorators/require-permissions.decorators';
import { Permissions } from 'src/enums';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PermissionsGuard } from 'src/middlewares/permissions.guard';

import {
    Controller,
    Get,
    Param,
    Res,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
} from '@nestjs/swagger';

import { QuoteTicker } from './dto/quote-ticker.dto';
import { GetTickersDto } from './dto/ticker.dto';
import { MarketDataService } from './market-data.service';

@ApiBearerAuth('Authorization')
@Controller('market-data')
export class MarketDataController {
    constructor(
        private readonly marketDataService: MarketDataService,
    ) {}

    @Get('intraday/tickers')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.marketData.intraday.get)
    @ApiOkResponse({ type: GetTickersDto })
    async listTickers(@Res() res: Response<GetTickersDto>) {
        const result = await this.marketDataService.listTickers();

        return res.json(result);
    }

    @Get('intraday/quote/:ticker')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.marketData.intraday.get)
    @ApiOkResponse({ type: QuoteTicker })
    async quoteTicler(@Param('ticker') ticker: string, @Res() res: Response<QuoteTicker>) {
        const result = await this.marketDataService.quoteTicker(ticker);

        return res.json(result);
    }
}
