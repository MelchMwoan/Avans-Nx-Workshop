import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  AuthModule,
  BackendFeaturesExerciseModule,
  BackendFeaturesMealModule,
  BackendFeaturesRoomModule,
  BackendFeaturesTrainingModule,
} from '@avans-nx-workshop/backend/features';
import { BackendFeaturesUserModule } from '@avans-nx-workshop/backend/features';
import { environment } from '@avans-nx-workshop/shared/util-env';

@Module({
  imports: [
    BackendFeaturesMealModule,
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
