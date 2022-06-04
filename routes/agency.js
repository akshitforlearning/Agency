const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const agency = require('../controllers/agency');
const { isLoggedIn , isAuthor , validateAgency } = require('../middleware');
const multer  = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

router.route('/')
      .get(catchAsync(agency.index))
      .post(isLoggedIn , upload.array('image') , validateAgency , catchAsync(agency.submitForm))

router.get('/new', isLoggedIn , agency.newForm)

router.route('/:id')
      .get(catchAsync(agency.showAgencyPage))
      .put(isLoggedIn , isAuthor , upload.array('image') , validateAgency, catchAsync(agency.updateAgencyForm))
      .delete(isLoggedIn , isAuthor , catchAsync(agency.deleteAgency))

router.get('/:id/edit', isLoggedIn , isAuthor , catchAsync(agency.editAgencyForm))

module.exports = router;