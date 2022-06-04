const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const client = require('../controllers/client');
const { isLoggedIn , isClientAuthor , validateClient } = require('../middleware');
const multer  = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

router.post('/', isLoggedIn , upload.single('clientImage') , validateClient, catchAsync(client.addClient))

router.route('/:client_id')
      .get(isClientAuthor , catchAsync(client.editClientForm))
      .put(isLoggedIn , isClientAuthor , upload.single('clientImage') , validateClient, catchAsync(client.updateClientForm))
      .delete(isLoggedIn , isClientAuthor , catchAsync(client.deleteClient))

module.exports = router;