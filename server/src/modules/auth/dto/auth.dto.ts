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
    description: 'Full name',
    type: String
  })
  @MinLength(3)
  @MaxLength(32)
  @Matches(
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/, 
    { message: 'Full name a-Z(vietnamese), 0-9 and space' }
  )
  name: string;

  @ApiProperty({
    description: 'Username',
    type: String
  })
  @MinLength(3)
  @MaxLength(32)
  @Matches(/^[a-zA-Z0-9_\.]+$/, { message: 'Username a-Z 0-9 _ .' })
  username: string;

  @ApiProperty({
    description: 'Password',
    type: String
  })
  @MinLength(6)
  @MaxLength(32)
  password: string;
}