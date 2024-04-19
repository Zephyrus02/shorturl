const router = require("express").Router();
const URL = require("../model/url");
const { restrictUser } = require("../middleware/auth");

router.get("/", restrictUser(["normal", "admin"]), async (req, res) => {
	const allURL = await URL.find({ createdBy: req.user.id });
	return res.render("index", { urls: allURL });
});

router.get("/signup", (req, res) => {
	return res.render("signup");
});

router.get("/login", (req, res) => {
	return res.render("login");
});

router.get("/admin/urls", restrictUser(["admin"]), async (req, res) => {
	const allURL = await URL.find({});
	return res.render("index", { urls: allURL });
});

module.exports = router;
