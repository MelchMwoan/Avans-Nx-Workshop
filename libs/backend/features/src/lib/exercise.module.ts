import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExerciseSchema } from './exercise/exercise.schema';
import { ExerciseService } from './exercise/exercise.service';
import { Neo4jModule } from 'nest-neo4j/dist';

@Module({
  imports: [Neo4jModule,
    MongooseModule.forFeature([{ name: 'Exercise', schema: ExerciseSchema }]),
  ],
  controllers: [],
  providers: [ExerciseService],
  exports: [ExerciseService],
})
export class ExerciseModule {}
