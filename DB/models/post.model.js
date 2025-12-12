import { sequelizeInstance } from "../connection.js";
import { DataTypes } from "sequelize";
export const postModel = sequelizeInstance.define(
  "post",
  {
    id: { type: DataTypes.INTEGER(11), primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(55), allowNull: false },
  },
  { timestamps: true }
);