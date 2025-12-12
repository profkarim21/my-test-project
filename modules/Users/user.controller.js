import { userModel } from "../../DB/models/user.model.js";
export const addUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }
    const user = await userModel.create({ name, email, password });
    res.status(201).json({ message: "User added successfully", User: user });
  } catch (error) {
    // Handle potential duplicate email error
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ message: "Error adding user", error: "Email already exists." });
    }
    next(error); // Pass other errors to the global error handler
  }
};

export const getUsers = async (req, res, next) => {
  const users = await userModel.findAll();
  res.json({ message: "Users retrieved successfully", Users: users });
};

export const updateUser = async (req, res, next) => {
  const { email, name, password } = req.body;

  const user = await userModel.update(
    {
      name,
      password,
    },
    { where: { email: email } }
  );
  if (user[0]) {
    return res.json({ message: "Updated Successfully" });
  }
  res.status(404).json({ message: "User not found or no changes made." });
};
