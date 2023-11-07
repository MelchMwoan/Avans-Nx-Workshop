import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BackendFeaturesMealModule } from '@avans-nx-workshop/backend/features';

@Module({
  imports: [BackendFeaturesMealModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
