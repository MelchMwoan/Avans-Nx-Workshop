import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  AuthModule,
  BackendFeaturesExerciseModule,
  BackendFeaturesRoomModule,
  BackendFeaturesTrainingModule,
} from '@avans-nx-workshop/backend/features';
import { BackendFeaturesUserModule } from '@avans-nx-workshop/backend/features';
import { environment } from '@avans-nx-workshop/shared/util-env';
import { Neo4jModule } from 'nest-neo4j/dist';

@Module({
  imports: [
    Neo4jModule.forRoot({
      scheme: 'bolt+s',
      host: '92d8bfad.databases.neo4j.io',
      port: 7687,
      username: process.env.NEO4J_USER,
      password: process.env.NEO4J_PASSWORD
    }),
    BackendFeaturesUserModule,
    MongooseModule.forRoot(environment.databaseUrl),
    AuthModule,
    BackendFeaturesRoomModule,
    BackendFeaturesExerciseModule,
    BackendFeaturesTrainingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
