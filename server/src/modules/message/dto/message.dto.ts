import { ApiProperty } from "@nestjs/swagger";

export class CreateMessageDto {
  @ApiProperty({
    description: 'userId',
    type: String
  })
  userId: string;
}