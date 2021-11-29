import { ApiProperty } from "@nestjs/swagger";
import { MessageType } from "src/schema/message.schema";

export class CreateMessageDto {
  @ApiProperty({
    description: 'userId',
    type: String
  })
  userId: string;
}

export class CreateMessageContentDto {
  @ApiProperty({
    description: Object.keys(MessageType).map(v => v + ": " + MessageType[v]).join('<br/>'),
    type: Number,
  })
  type: MessageType;
  
  @ApiProperty({
    description: 'data',
    type: String
  })
  data: string;
}