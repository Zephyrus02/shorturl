const express = require("express");
const router = require("express").Router();
const { createShortUrl, getAnalytics } = require("../controller/url");

router.post("/", createShortUrl);

router.get("/analytics/:short_id", getAnalytics);

module.exports = router;
