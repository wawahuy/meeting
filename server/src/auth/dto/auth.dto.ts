import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
  @ApiProperty({
    description: 'Username',
    type: String
  })
  username: string;

  @ApiProperty({
    description: 'Password',
    type: String
  })
  password: string;
}

export class SignUpDto {
  @ApiProperty({
    description: 'Username',
    type: String
  })
  username: string;

  @ApiProperty({
    description: 'Password',
    type: String
  })
  password: string;
}