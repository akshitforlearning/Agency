const Agency = require('../models/agency');
const Client = require('../models/client');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const agency = await Agency.find({});
    res.render('agency/index.ejs', { agency });
}

module.exports.newForm = (req, res) => {
    res.render('agency/new.ejs');
}

module.exports.submitForm = async (req, res, next) => {
    const data = req.body;
    const agency = new Agency(data);
    agency.images = req.files.map(el => ({url: el.path , filename: el.filename}));
    agency.author = req.user._id;
    await agency.save();
    req.flash('success' , 'New Agency Added Successfully');
    res.redirect(`/agency/${agency._id}`);
}

module.exports.showAgencyPage = async (req, res) => {
    const { id } = req.params;
    const agency = await Agency.findById(id).populate({
        path: 'clients',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!agency){
        req.flash('error' , 'Requested Agency Not Found');
        return res.redirect('/agency');
    }
    res.render('agency/show.ejs', { agency });
}

module.exports.editAgencyForm = async (req, res) => {
    const { id } = req.params;
    const agency = await Agency.findById(id);
    if(!agency){
        req.flash('error' , 'Requested Agency Not Found');
        return res.redirect('/agency');
    }
    res.render('agency/edit.ejs', { agency });
}

module.exports.updateAgencyForm = async (req, res) => {
    const { id } = req.params;
    const agency = await Agency.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    const imgs = req.files.map(el => ({url: el.path , filename: el.filename}));
    agency.images.push(...imgs);
    await agency.save();
    
    //Deleting images selected in agency edit form
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await agency.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }

    req.flash('update' , 'Agency Details Updated Successfully');
    res.redirect(`/agency/${agency._id}`);
}

module.exports.deleteAgency = async (req, res) => {
    const { id } = req.params;
    const agency = await Agency.findByIdAndDelete(id);
    await Client.deleteMany({ _id: { $in: agency.clients } });
    req.flash('remove' , 'Agency Removed Successfully');
    res.redirect('/agency');
}