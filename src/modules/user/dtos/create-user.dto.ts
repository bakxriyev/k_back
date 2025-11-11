import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        type: String,
        required: false,
        example: 'Eshmat',
    })
    @IsString()
    full_name: string;

    @ApiProperty({
        type: String,
        required: false,
        example: '+998933211232',
    })
    @IsPhoneNumber("UZ")
    phone_number?: string;

    @ApiProperty({
        type: String,
        required: false,
        example: 'Gap',
    })
    @IsString()
    type: string;

    @ApiProperty({
        type: String,
        required: false,
        example: 'Toshkent'
    })
    @IsString()
    address: string;
    
}