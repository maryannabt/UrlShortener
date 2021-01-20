const { validationResult } = require('express-validator');
const config = require('config');
const shortid = require('shortid');

const Link = require('../models/Link');
const HttpError = require('../models/http-error');

const generateLink = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    
};

const getLinks = async (req, res, next) => {
    
};

const getLinkById = async (req, res, next) => {
    
};

exports.generateLink = generateLink;
exports.getLinks = getLinks;
exports.getLinkById = getLinkById;