const Agency = require('../models/agency');
const Client = require('../models/client');
const { cloudinary } = require('../cloudinary');

module.exports.addClient = async (req, res) => {
    const { id } = req.params;
    const agency = await Agency.findById(id);
    const clients = new Client(req.body);
    clients.author = req.user._id;
    agency.clients.push(clients);
    clients.agency.push(agency);
    clients.clientImages.url = req.file.path;
    clients.clientImages.filename = req.file.filename;
    await clients.save();
    await agency.save();
    req.flash('success', 'New Client Added Successfully');
    res.redirect(`/agency/${agency._id}`);
}

module.exports.editClientForm = async (req, res) => {
    const { id, client_id } = req.params;
    const agency = await Agency.findById(id);
    const clients = await Client.findById(client_id);
    res.render('client/edit.ejs', { agency, clients });
}

module.exports.updateClientForm = async (req, res) => {
    const { id, client_id } = req.params;
    const agency = await Agency.findById(id);
    const clients = await Client.findByIdAndUpdate(client_id, req.body, { runValidators: true, new: true });

    if (req.file && req.body.deleteImages) {
        await cloudinary.uploader.destroy(req.body.deleteImages);
        await clients.updateOne({clientImages: {url: req.file.path , filename: req.file.filename}});
        console.log(clients);
    }

    req.flash('update', 'Client Details Updated Successfully');
    res.redirect(`/agency/${agency._id}`);
}

module.exports.deleteClient = async (req, res) => {
    const { id, client_id } = req.params;
    await Agency.findByIdAndUpdate(id, { $pull: { clients: client_id } });
    await Client.findByIdAndDelete(client_id);
    req.flash('remove', 'Client Removed Successfully');
    res.redirect(`/agency/${id}`);
}