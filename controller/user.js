const User = require("../model/user");
const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {
	try {
		const { name, email, password } = req.body;
		await User.create({
			name,
			email,
			password,
		});
		res.status(201).redirect("/");
	} catch (error) {
		res.status(400).send(error);
	}
}

async function handleUserLogin(req, res) {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email, password });
		console.log(user);
		if (!user) {
			return res
				.status(401)
				.render("login.js", { error: "Invalid email or password" });
		}
		const token = setUser(user);
		res.cookie("uid", token, {
			expires: new Date(Date.now() + 3600000),
		});
		res.status(200).redirect("/");
	} catch (error) {
		res.status(400).send(error);
	}
}

module.exports = { handleUserSignup, handleUserLogin };
