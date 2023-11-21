import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule, BackendFeaturesMealModule } from '@avans-nx-workshop/backend/features';
import { BackendFeaturesUserModule } from '@avans-nx-workshop/backend/features';

@Module({
  imports: [BackendFeaturesMealModule, BackendFeaturesUserModule, MongooseModule.forRoot('mongodb://127.0.0.1:27017/ttvd'), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
