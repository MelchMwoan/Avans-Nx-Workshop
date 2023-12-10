/* eslint-disable @nx/enforce-module-boundaries */
import { ITraining } from '@avans-nx-workshop/shared/api';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Training } from 'libs/backend/features/src/lib/training/training.schema';
import { TrainingService } from 'libs/backend/features/src/lib/training/training.service';
import mongoose, { Model } from 'mongoose';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class Neo4JUserService {
    private readonly logger: Logger = new Logger(Neo4JUserService.name);

    constructor(private readonly neo4jService: Neo4jService, @InjectModel(Training.name) private trainingModel: Model<Training>) {}

    async findAll(): Promise<any> {
        this.logger.log('findAll users');
        const results = await this.neo4jService.read(
            `MATCH (p:User) RETURN p;`
        );
        const users = results.records.map(
            (record: any) => record._fields[0].properties
        );
        return users;
    }

    async findRecommendations(req: any): Promise<ITraining[]> {
        this.logger.log("Finding recommendations");
        try {
            const results = await this.neo4jService.read(`MATCH (user:User {email: $userEmail})-[:PLAYED]->(:Training)<-[:PLAYED]-(otherUser:User)-[:PLAYED]->(recommendedTraining:Training)
            WHERE user <> otherUser
            AND NOT (user)-[:PLAYED]->(recommendedTraining)
            RETURN DISTINCT recommendedTraining
            `, {
                userEmail: req.user.email
            })
            const trainings = results.records.map(
                (record: any) => record._fields[0].properties['id']
            );
            const objectIdTrainings = trainings.map((id: string) => new mongoose.Types.ObjectId(id));
            return (await this.trainingModel.find({ _id: { $in: objectIdTrainings}}).exec()).map((trainingsFromDb) => {
                return trainingsFromDb as ITraining;
              });
        } catch (error) {
            Logger.error(`Error getting RCMND: ${error}`, "Neo UserService");
            throw error;

        }

    }
}
