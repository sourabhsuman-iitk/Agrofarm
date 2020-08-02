const functions = require('firebase-functions');
// const firebase = require('firebase-admin')
const express = require('express')

const admin = require("firebase-admin");
const serviceAccount = require("./ServiceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://agrofarm-samx191.firebaseio.com"
});
const db = admin.firestore()

const app = express()
app.set('views', './views')
app.set("view engine", "ejs")


const homeRoutes = require('./routes/home')
const chemicalProductRoutes = require('./routes/chemicalProduct')
const cropRoutes = require('./routes/crop')
const cropCategoryRoutes = require('./routes/cropCategory')
const pestRoutes = require('./routes/pest')
const pestGroupRoutes = require('./routes/pestGroup')
const productBrandRoutes = require('./routes/productBrand')

app.use(homeRoutes)
app.use(chemicalProductRoutes)
app.use(cropRoutes)
app.use(cropCategoryRoutes)
app.use(pestRoutes)
app.use(pestGroupRoutes)
app.use(productBrandRoutes)

app.use(function(req, res, next){
    res.status(404).render("error")
})

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.app = functions.https.onRequest(app)
