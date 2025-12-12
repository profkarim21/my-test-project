import { sequelizeInstance } from "../connection.js";
import { DataTypes } from "sequelize";
export const userModel = sequelizeInstance.define(
  "user",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
  },
  { timestamps: true }
);
console.log(userModel == sequelizeInstance.models.user);




