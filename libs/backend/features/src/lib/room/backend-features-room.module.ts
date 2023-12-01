import { Module } from '@nestjs/common';
import { RoomController } from './room.controller'; 
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './room.schema';
import { RoomService } from './room.service';
import { UserModule } from '../user.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema}]), UserModule],
    controllers: [RoomController],
    providers: [RoomService],
    exports: [RoomService],
})
export class BackendFeaturesRoomModule {}