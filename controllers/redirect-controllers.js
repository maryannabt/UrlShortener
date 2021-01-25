const Link = require('../models/Link');
const HttpError = require('../models/http-error');

const redirectLink = async (req, res, next) => {
    let link;
    try {
        link = await Link.findOne({ code: req.params.code });
    } catch (err) {
        const error = new HttpError('Something went wrong, could not redirect.', 500);
        return next(error);
    }

    if (!link) {
        const error = new HttpError('Could not find the requested link.', 404);
        return next(error);
    }

    link.clicks++;

    try {
        await link.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not redirect.', 500);
        return next(error);
    }

    res.redirect(link.from);
};

exports.redirectLink = redirectLink;