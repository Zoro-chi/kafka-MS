const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const router = express.Router();
require("dotenv").config();

const generateToken = (user) => {
	return jwt.sign(user, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

router.post("/register", async (req, res) => {
	const { email, password, username } = req.body;
	const userExists = await db.query("SELECT * FROM users WHERE email = $1", [
		email,
	]);

	if (userExists.rows.length > 0) {
		return res.status(400).json({ message: "User already exists" });
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const newUser = await db.query(
		"INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING *",
		[email, hashedPassword, username]
	);

	return res
		.status(201)
		.json({ message: "User created successfully", user: newUser.rows[0] });
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

	if (user.rows.length === 0) {
		return res.status(400).json({ message: "User does not exist" });
	}

	const validPassword = bcrypt.compare(password, user.rows[0].password);

	if (!validPassword) {
		return res.status(400).json({ message: "Invalid credentials" });
	}

	const token = generateToken({
		id: user.rows[0].id,
		email: user.rows[0].email,
	});

	return res.status(200).json({ message: "Login successful", token });
});

router.get("/validate", async (req, res) => {
	const token = req.headers["authorization"];

	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	try {
		const tokenData = token.split(" ")[1];
		const user = jwt.verify(tokenData, process.env.JWT_SECRET);
		return res.status(200).json({ ...user });
	} catch (error) {
		return res.status(403).json({ message: "Invalid Token" });
	}
});

module.exports = router;
