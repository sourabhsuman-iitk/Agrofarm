const functions = require('firebase-functions');
const express = require("express");
const router = express.Router();

const admin = require("firebase-admin");

const db = admin.firestore()


//product
router.get('/productbrand/:lang', async (req, res)=>{
    await db.collection('productBrands').doc(req.params.lang).collection('productBrand').orderBy("sortOrder", "asc").get().then((snapshot) =>{
            db.collection('chemicalProducts').doc(req.params.lang).collection('chemicalProduct').get().then((chemp) =>{
                res.render('productBrand/index', {snapshot: snapshot , lang: req.params.lang, chemp: chemp})
            })
        })
})
//select language
router.get('/addproductbrand/select', (req, res) => {
    res.render('productBrand/select')
})
//add 
router.get('/addproductbrand/:lang', async (req, res) =>{
    await db.collection('chemicalProducts').doc(req.params.lang).collection('chemicalProduct').get().then((chemp) =>{
        res.render('productBrand/add', {lang: req.params.lang, chemp: chemp})
    })
})
//add  post route
router.post('/productbrand', async (req, res) => {
    
    if(req.body.lang === 'english'){
        await db.collection('productBrands').doc('english').collection('productBrand').add({
            brandname: req.body.brandname,
            compname: req.body.compname,
            image: req.body.image,
            sortOrder: parseInt(req.body.sortOrder),
            description: req.body.description,
            active: req.body.active,
            application: req.body.application,
            linkedChemicalProdId: req.body.linkedChemicalProdId,
            language: req.body.lang
          })
          res.redirect('/productbrand/'+ req.body.lang)
    } else if(req.body.lang === 'gujrati') {
        await db.collection('productBrands').doc('gujrati').collection('productBrand').add({
            brandname: req.body.brandname,
            compname: req.body.compname,
            image: req.body.image,
            sortOrder:  parseInt(req.body.sortOrder),
            description: req.body.description,
            active: req.body.active,
            application: req.body.application,
            linkedChemicalProdId: req.body.linkedChemicalProdId,
            language: req.body.lang
          })
          res.redirect('/productbrand/'+ req.body.lang)
    }
    
      
})
//show 
router.get('/productbrand/show/:lang/:id', (req, res) => {
    let chemProdRef = db.collection('chemicalProducts').doc(req.params.lang).collection('chemicalProduct') 
    let cropRef = db.collection('productBrands').doc(req.params.lang).collection('productBrand').doc(req.params.id)  
        cropRef.get().then((crop) =>{
            chemProdRef.get().then((chemp) =>{
        res.render('productBrand/show', {crop : crop, chemp: chemp})
            })
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
} )
//edit route
router.get('/productbrand/edit/:lang/:id', async (req,res) =>{
    let chemProdRef = db.collection('chemicalProducts').doc(req.params.lang).collection('chemicalProduct') 
    let cropRef = db.collection('productBrands').doc(req.params.lang).collection('productBrand').doc(req.params.id)  
        await cropRef.get().then((crop) =>{
            chemProdRef.get().then((chemp) =>{
                res.render('productBrand/edit', {crop : crop, chemp: chemp})
            })
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
})
//update route
router.post('/productbrand/edit/:lang/:id', async (req, res) =>{
    await db.collection('productBrands').doc(req.params.lang).collection('productBrand').doc(req.params.id).update({
        brandname: req.body.brandname,
        compname: req.body.compname,
        image: req.body.image,
        sortOrder:  parseInt(req.body.sortOrder),
        description: req.body.description,
        active: req.body.active,
        application: req.body.application,
        linkedChemicalProdId: req.body.linkedChemicalProdId
      })
      res.redirect('/productbrand/'+ req.params.lang)
})

//delete route
router.post('/productbrand/delete/:lang/:id', async (req, res) => {
    await db.collection('productBrands').doc(req.params.lang).collection('productBrand').doc(req.params.id).delete()

    res.redirect('/productbrand/'+ req.params.lang)
})

module.exports = router ;