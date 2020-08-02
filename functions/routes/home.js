const functions = require('firebase-functions');
const express = require("express");
const router = express.Router();

const admin = require("firebase-admin");

const db = admin.firestore()

router.get('/', (req, res) => {
    res.render('login')
})
router.get('/home', (req, res) => {
    res.render('dash')
})

module.exports = router ;