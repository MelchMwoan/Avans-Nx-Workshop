import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomSchema } from './room/room.schema';
import { RoomService } from './room/room.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }]),
  ],
  controllers: [],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
