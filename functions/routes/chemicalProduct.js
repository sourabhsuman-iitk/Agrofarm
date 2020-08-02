const functions = require('firebase-functions');
const express = require("express");
const router = express.Router();

const admin = require("firebase-admin");

const db = admin.firestore()


//chemical prod
//chemical prod index
router.get('/chemicalproduct/:lang', async (req, res)=>{
    await db.collection('chemicalProducts').doc(req.params.lang).collection('chemicalProduct').orderBy("sortOrder", "asc").get().then((snapshot) =>{
             db.collection('productBrands').doc(req.params.lang).collection('productBrand').get().then( (prod) =>{
                res.render('chemicalProduct/index', {snapshot: snapshot, lang: req.params.lang, prod: prod})
            })
        })
})
//select language
router.get('/addchemicalproduct/select', (req, res) => {
    res.render('chemicalProduct/select')
})
//add pest group
router.get('/addchemicalproduct/:lang', (req, res) =>{
    res.render('chemicalProduct/add', {lang: req.params.lang})
})

//add pest group post route
router.post('/chemicalproduct', async (req, res) => {
    
    if(req.body.lang === 'english'){
        await db.collection('chemicalProducts').doc('english').collection('chemicalProduct').add({
            name: req.body.name,
            sortOrder:  parseInt(req.body.sortOrder),
            active: req.body.active,
            language: req.body.lang
          })
          res.redirect('/chemicalproduct/'+ req.body.lang)
    } else if(req.body.lang === 'gujrati') {
        await db.collection('chemicalProducts').doc('gujrati').collection('chemicalProduct').add({
            name: req.body.name,
            sortOrder:  parseInt(req.body.sortOrder),
            active: req.body.active,
            language: req.body.lang
          })
          res.redirect('/chemicalproduct/'+ req.body.lang)
    }
    
      
})
//edit route
router.get('/chemicalproduct/edit/:lang/:id', async (req,res) =>{

    let cropRef = db.collection('chemicalProducts').doc(req.params.lang).collection('chemicalProduct').doc(req.params.id)  
        await cropRef.get().then((doc) =>{
            
            res.render('chemicalProduct/edit', {crop : doc})
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
})
//update route
router.post('/chemicalproduct/edit/:lang/:id', async (req, res) =>{
    await db.collection('chemicalProducts').doc(req.params.lang).collection('chemicalProduct').doc(req.params.id).update({
        name: req.body.name,
        sortOrder:  parseInt(req.body.sortOrder),
        active: req.body.active
      })
      res.redirect('/chemicalproduct/'+ req.params.lang)
})

//delete route
router.post('/chemicalproduct/delete/:lang/:id', async (req, res) => {
    await db.collection('chemicalProducts').doc(req.params.lang).collection('chemicalProduct').doc(req.params.id).delete()

    res.redirect('/chemicalproduct/'+ req.params.lang)
})

module.exports = router ;