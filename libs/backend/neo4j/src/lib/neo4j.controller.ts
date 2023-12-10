/* eslint-disable @nx/enforce-module-boundaries */
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { Neo4JUserService } from './neo4j-users.service';
import { Public } from 'libs/backend/features/src/lib/auth/decorators/public.decorator';
import { AuthGuard } from 'libs/backend/features/src/lib/auth/auth.guard';
import { ITraining } from '@avans-nx-workshop/shared/api';

@Controller('users')
export class Neo4JExampleController {
    constructor(private readonly neo4jService: Neo4JUserService) {}

    @Get('')
    async getAllUsers(): Promise<any> {
        const results = await this.neo4jService.findAll();
        return results;
    }

    @Get('/rcmnd')
    @UseGuards(AuthGuard)
    async getRcmnd(@Request() req: any): Promise<ITraining[]> {
        return await this.neo4jService.findRecommendations(req);
    }
}
