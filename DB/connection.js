//db connection
import { Sequelize } from "sequelize";

export const sequelizeInstance = new Sequelize("c40test", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export const connection = async () => {
  return await sequelizeInstance
    .sync({ alter: true , force: false })
    .then((res) => console.log("Connection has been established successfully"))
    .catch((err) => console.error("Unable to connect to the database", err));
};
