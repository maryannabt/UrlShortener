const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const config = require('config');
const shortid = require('shortid');

const Link = require('../models/Link');
const User = require('../models/User');
const HttpError = require('../models/http-error');

const generateLink = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { from } = req.body;

    const baseUrl = config.get('baseUrl');
    const code = shortid.generate();
    const to = baseUrl + '/t/' + code;

    const createdLink = new Link({
        from, to, code, creator: req.userData.userId
    });

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError('Generating link failed, please try again.', 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Could not find user for provided id.', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdLink.save({ session: sess });
        user.links.push(createdLink);
        await user.save({ session: sess });
        await sess.commitTransaction();
      } catch (err) {
        const error = new HttpError('Generating link failed, please try again.', 500);
        return next(error);
      }
    
      res.status(201).json({ link: createdLink.toObject({ getters: true }) });
};

const getLinks = async (req, res, next) => {
    const userId = req.userData.userId;

    let userWithLinks;
    try {
        userWithLinks = await User.findById(userId).populate('links');
    } catch (err) {
        const error = new HttpError('Fetching links failed, please try again later.', 500);
        return next(error);
    }

    if (!userWithLinks || userWithLinks.links.length === 0) {
        return next(new HttpError('Could not find links for the provided user id.', 404));
    }

    res.json({
        links: userWithLinks.links.map(link =>
        link.toObject({ getters: true })
        )
    });
};

const getLinkById = async (req, res, next) => {
    const linkId = req.params.id;

    let link;
    try {
        link = await Link.findById(linkId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a link.', 500);
        return next(error);
    }

    if (!link) {
        const error = new HttpError('Could not find link for the provided id.', 404);
        return next(error);
    }

    res.json({ link: link.toObject({ getters: true }) });
};

exports.generateLink = generateLink;
exports.getLinks = getLinks;
exports.getLinkById = getLinkById;