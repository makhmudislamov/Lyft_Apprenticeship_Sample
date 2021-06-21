const { Offer, validate } = require("../models/offer");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// GET method: returns all offers
router.get("/", async (req, res) => {
    const offer = await Offer.find().sort("name");
    res.send(offer);
});

// POST method: posts new offer after validation
router.post("/", [auth], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send("Invalid user.");
    let offer = new Offer({
        displayname: req.body.displayname,
        sendingFrom: req.body.sendingFrom,
        sendingTo: req.body.sendingTo,
        amount: req.body.amount,
        exchangeType: req.body.exchangeType,
        status: req.body.status,
        userId: req.body.userId,
    });
    user.offers.push(offer);
    await offer.save();
    await user.save();
    res.send(offer);
});

// PUT method: edits one offer
router.put("/:id", [auth], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send("Invalid user.");

    const offer = await Offer.findByIdAndUpdate(
        req.params.id,
        {
            displayname: req.body.displayname,
            sendingFrom: req.body.sendingFrom,
            sendingTo: req.body.sendingTo,
            amount: req.body.amount,
            exchangeType: req.body.exchangeType,
            status: req.body.status,
            user: { _id: user._id },
        },
        { new: true }
    );

    if (!offer)
        return res
            .status(404)
            .send("The offer with the given ID was not found.");

    res.send(offer);
});

// DELETE method: deletes one offer
// [auth, admin] - only admin can deleted offers.
router.delete("/:id", [auth, admin], async (req, res) => {
    const offer = await Offer.findByIdAndRemove(req.params.id);

    if (!offer)
        return res
            .status(404)
            .send("The offer with the given ID was not found.");

    res.send(offer);
});

// GET method: returns one specific offer
router.get("/:id", async (req, res) => {
    const offer = await Offer.findById(req.params.id);

    if (!offer)
        return res
            .status(404)
            .send("The offer with the given ID was not found.");

    res.send(offer);
});

module.exports = router;
