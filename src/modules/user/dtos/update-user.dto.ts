import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";


export class UpdateUserDto  {
    @ApiProperty({
        type: String,
        required: true,
        example: 'Eshmat',
    })
    @IsOptional()
    @IsString()
    full_name: string;
    
    @ApiProperty({
        type: String,
        required: true,
        example: '+998933211232',
    })
    @IsPhoneNumber("UZ")
    @IsOptional()
    phone_number: string;

    @ApiProperty({
        type: String,
        required: true,
        example: 'Gap',
    })
    @IsOptional()
    @IsString()
    tg_user: string;
}