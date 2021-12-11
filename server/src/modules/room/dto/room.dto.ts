import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray } from "class-validator";

export class CreateRoomDto {
  @ApiProperty({
    description: 'Room name',
    type: String
  })
  name?: string;

  @ApiProperty({
    description: 'User id list',
    type: [String]
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @Type(() => String)
  users?: string[];
}
