const express = require("express");
const path = require("path");
const URL = require("./model/url");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
// import middleware
const { coreAuth, restrictUser } = require("./middleware/auth");

// import routes
const urlRoute = require("./routes/url");
const staticRouter = require("./routes/staticrouter");
const userRoute = require("./routes/user");
require("dotenv").config();

// Create express app
const app = express();
const PORT = process.env.PORT || 8080;

// Connect to database
mongoose
	.connect(process.env.mongodb)
	.then(() => {
		console.log("Connected to database");
	})
	.catch((error) => {
		console.error("Error connecting to database", error);
	});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(coreAuth);

// Routes
app.use("/url", restrictUser(["normal", "admin"]), urlRoute);
app.use("/user", userRoute);
app.use("/", staticRouter);

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/test", async (req, res) => {
	const urls = await URL.find({});
	return res.render("index", { urls: urls });
});

app.get("/url/:short_id", async (req, res) => {
	const short_id = req.params.short_id;
	const url = await URL.findOneAndUpdate(
		{ short_id: short_id },
		{
			$push: {
				visits: {
					timestamp: Date.now(),
				},
			},
		}
	);
	if (!url) {
		return res.status(404).json({ error: "url not found" });
	}
	return res.redirect(url.redirected_url);
});

app.listen(PORT, () =>
	console.log(`app listening on http://localhost:${PORT}/`)
);
