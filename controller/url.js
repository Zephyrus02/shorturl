const shortid = require("shortid");
const URL = require("../model/url");

async function createShortUrl(req, res) {
	const body = req.body;
	const allURL = await URL.find({ createdBy: req.user.id });
	if (!body.url) {
		return res.status(400).json({ error: "url is required" });
	}
	const short_id = shortid();
	await URL.create({
		short_id: short_id,
		redirected_url: body.url,
		visits: [],
		createdBy: req.user.id,
	});
	return res.render("index", { id: short_id, urls: allURL });
}

async function getAnalytics(req, res) {
	const short_id = req.params.short_id;
	const url = await URL.findOne({ short_id: short_id });
	if (!url) {
		return res.status(404).json({ error: "url not found" });
	}
	return res.json({ Total_Visits: url.visits.length, Analytics: url.visits });
}

module.exports = { createShortUrl, getAnalytics };
