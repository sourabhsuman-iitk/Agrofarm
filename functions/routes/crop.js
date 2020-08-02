const functions = require('firebase-functions');
const express = require("express");
const router = express.Router();

const admin = require("firebase-admin");

const db = admin.firestore()

//crop index
router.get('/crop/:lang', async (req, res)=>{
    await db.collection('crops').doc(req.params.lang).collection('crop').orderBy("sortOrder", "asc").get().then( (snapshot) =>{
             db.collection('cropCategories').doc(req.params.lang).collection('cropCategory').get().then((catg) =>{
                  res.render('crop/index', {snapshot: snapshot, lang: req.params.lang, catg: catg})
            })
        })
   
})
//add crop post route  
router.post('/crop', async (req, res) => {
    if(req.body.lang === 'english'){
    await db.collection('crops').doc('english').collection('crop').add({
        name: req.body.name,
        image: req.body.image,
        sortOrder: parseInt(req.body.sortOrder),
        active: req.body.active,
        description: req.body.description,
        linkedCategoryId: req.body.linkedCategoryId,
        linkedPestId: req.body.linkedPestId,
        language: req.body.lang
      }).catch(function(error) {
        console.log("Error getting document:", error);
    });
      res.redirect('/crop/'+ req.body.lang)
    } else if(req.body.lang === 'gujrati') {
        await db.collection('crops').doc('gujrati').collection('crop').add({
            name: req.body.name,
            image: req.body.image,
            sortOrder: parseInt(req.body.sortOrder),
            active: req.body.active,
            description: req.body.description,
            linkedCategoryId: req.body.linkedCategoryId, 
            linkedPestId: req.body.linkedPestId,
            language: req.body.lang
          }).catch(function(error) {
            console.log("Error getting document:", error);
        });
          res.redirect('/crop/'+ req.body.lang)
    }
    
})
//select language
router.get('/addcrop/select', (req, res) => {
    res.render('crop/select')
})
//add crop
router.get('/addcrop/:lang', async (req, res) =>{
    await  db.collection('cropCategories').doc(req.params.lang).collection('cropCategory').get().then((catg) =>{
            db.collection('pests').doc(req.params.lang).collection('pest').get().then((pest) =>{
                res.render('crop/add', {lang: req.params.lang, catg: catg, pest: pest})
            })
    })
})
//show crop
router.get('/crop/show/:lang/:id', async (req, res) => {
    
    let pestRef = db.collection('pests').doc(req.params.lang).collection('pest')
    let catRef = db.collection('cropCategories').doc(req.params.lang).collection('cropCategory') 
    let cropRef = db.collection('crops').doc(req.params.lang).collection('crop').doc(req.params.id)  
        await cropRef.get().then((crop) =>{
                 catRef.get().then((catg) =>{
                     pestRef.get().then((pest) =>{
            res.render('crop/show', {crop : crop, catg: catg, pest: pest})
                })
            })
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
} ) 
//edit crop 
router.get('/crop/edit/:lang/:id', async (req,res) =>{
    let cropRef = db.collection('crops').doc(req.params.lang).collection('crop').doc(req.params.id)  
        await cropRef.get().then((doc) =>{
             db.collection('cropCategories').doc(req.params.lang).collection('cropCategory').get().then((catg) =>{
                db.collection('pests').doc(req.params.lang).collection('pest').get().then((pest) =>{
                 res.render('crop/edit', {crop: doc, catg: catg, pest: pest})
                })
            })
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
})
//update route
router.post('/crop/edit/:lang/:id', async (req, res) =>{
    await db.collection('crops').doc(req.params.lang).collection('crop').doc(req.params.id).update({
        name: req.body.name,
        image: req.body.image,
        sortOrder: parseInt(req.body.sortOrder),
        active: req.body.active,
        description: req.body.description,
        linkedCategoryId: req.body.linkedCategoryId,
        linkedPestId: req.body.linkedPestId
      }).catch(function(error) {
        console.log("Error ", error);
    });
      res.redirect('/crop/' + req.params.lang)
})
//delete crop
router.post('/crop/delete/:lang/:id', async (req, res) => {
    await db.collection('crops').doc(req.params.lang).collection('crop').doc(req.params.id).delete()

    res.redirect('/crop/' + req.params.lang)
})

module.exports = router ;