require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();

const PostModel = require("./models/posts");

mongoose
	.connect(process.env.CONNECTION_STRING)
	.then(() => console.log("Connected!"));

app.use(express.json());

app.get("/posts", async (req, res) => {
	const result = await PostModel.find();
	console.log(result);
	res.send(result);
});

app.post("/post", async (req, res) => {
	const { name, room_num, message } = req.body;

	if (!name || !room_num || !message) {
		return res.status(400).send("Invalid input");
	}

	const post = new PostModel({
		name,
		room_num,
		message,
	});

	await post.save();

	res.send(post);
});

app.listen(6100, () => {
	console.log("Server is running on port 6100");
});
