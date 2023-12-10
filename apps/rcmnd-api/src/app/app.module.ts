import { Module } from '@nestjs/common';
import { Neo4jBackendModule } from '@avans-nx-workshop/backend/neo4j';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Neo4jModule } from 'nest-neo4j/dist'
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from '@avans-nx-workshop/shared/util-env';

@Module({
  imports: [
    Neo4jModule.forRoot({
      scheme: 'bolt+s',
      host: '92d8bfad.databases.neo4j.io',
      port: 7687,
      username: "neo4j",
      password: "22tg5FOtu_8jNwsdwkBBMrPxLfGmL3XKeUdYYxXh8dQ"
    }),
    Neo4jBackendModule,
    MongooseModule.forRoot(environment.databaseUrl),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
