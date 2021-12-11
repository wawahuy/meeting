import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'Username',
    type: String
  })
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  @Matches(/^[a-z0-9_\.]+$/, { message: 'Username a-Z 0-9 _ .' })
  username: string;

  @ApiProperty({
    description: 'Password',
    type: String
  })
  @MinLength(6)
  @MaxLength(32)
  password: string;
}

export class SignUpDto {
  @ApiProperty({
    description: 'Username',
    type: String
  })
  @MinLength(3)
  @MaxLength(32)
  @Matches(/^[a-z0-9_\.]+$/, { message: 'Username a-Z 0-9 _ .' })
  username: string;

  @ApiProperty({
    description: 'Password',
    type: String
  })
  @MinLength(6)
  @MaxLength(32)
  password: string;
}