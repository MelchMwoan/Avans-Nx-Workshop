/* eslint-disable @nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { Neo4jModule } from 'nest-neo4j';
import { Neo4JExampleController } from './neo4j.controller';
import { Neo4JUserService } from './neo4j-users.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'libs/backend/features/src/lib/auth/constants';
import { UserService } from 'libs/backend/features/src/lib/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'libs/backend/features/src/lib/user/user.schema';
import { Training, TrainingSchema } from 'libs/backend/features/src/lib/training/training.schema';

@Module({
    imports: [Neo4jModule,
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '86400s' },
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema}]),
        MongooseModule.forFeature([{ name: Training.name, schema: TrainingSchema}])],
    controllers: [Neo4JExampleController],
    providers: [Neo4JUserService, UserService],
    exports: []
})
export class Neo4jBackendModule {}
