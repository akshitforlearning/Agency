const { agencySchema , clientSchema } = require('./schemas');
const Agency = require('./models/agency');
const Client = require('./models/client');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.flash('userError' , 'You need to be signed in first');
        return res.redirect('/login');
    }
    next();
};

module.exports.validateAgency = (req, res, next) => {
    const { error } = agencySchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
};

module.exports.isAuthor = async (req , res , next) => {
    const {id} = req.params;
    const agency = await Agency.findById(id);
    if(!agency.author.equals(req.user._id)){
        req.flash('error' , 'You do not have permission to do that');
        return res.redirect(`/agency/${id}`);
    }
    next();
};

module.exports.isClientAuthor = async (req , res , next) => {
    const { id , client_id } = req.params;
    const client = await Client.findById(client_id);
    if(!client.author.equals(req.user._id)){
        req.flash('error' , 'You do not have permission to do that');
        return res.redirect(`/agency/${id}`);
    }
    next();
};

module.exports.validateClient = (req, res, next) => {
    const { error } = clientSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
};



