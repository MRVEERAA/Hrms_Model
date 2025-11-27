import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Organisation from "../models/organisation.js";
import User from "../models/user.model.js";
import Log from "../models/log.model.js";

export const Register = async (req, res) => {
  try {
    const { email, password, orgName, adminName } = req.body;

    if (!email || !adminName || !orgName || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid Email format" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }

    const existingOrg = await Organisation.findOne({
      where: { name: orgName },
    });
    if (existingOrg) {
      return res.status(409).json({ error: "Organisation Already Exists" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email Already Exists" });
    }

    const organisation = await Organisation.create({ name: orgName });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: adminName,
      email,
      password_hash: hash,
      organisation_id: organisation.id,
      role: "admin",
    });

    const token = jwt.sign(
      { userId: user.id, orgId: organisation.id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    await Log.create({
      organisation_id: organisation.id,
      user_id: user.id,
      action: `User '${user.id}' created organisation '${organisation.id}'`,
      meta: { email, orgName, adminName },
    });

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organisationId: organisation.id,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password, orgName } = req.body;

    if (!email || !password || !orgName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    //find organisation
    const organisation = await Organisation.findOne({
      where: { name: orgName },
    });
    if (!organisation) {
      return res.status(400).json({ message: "Organisation not found" });
    }
    // find user
    const user = await User.findOne({
      where: {
        email,
        organisation_id: organisation.id,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user.id, orgId: user.organisation_id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    //Upload logs action
    await Log.create({
      user_id: user.id,
      organisation_id: organisation.id,
      action: `User '${user.id}' logged in`,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        orgId: user.organisation_id,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
