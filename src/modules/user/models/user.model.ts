import { 
    Table, 
    Model, 
    Column, 
    DataType,  
  } from 'sequelize-typescript';
  
  @Table({ tableName: 'userss', timestamps: true })
  export class User extends Model {

    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id: number;

    @Column({ type: DataType.STRING, allowNull: true })
    full_name: string;

    @Column({ type: DataType.BIGINT, allowNull: true })
    phone_number?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    type:string;

    @Column({ type: DataType.STRING, allowNull: true })
    address:string;
  }
  