const functions = require('firebase-functions');
const express = require("express");
const router = express.Router();

const admin = require("firebase-admin");

const db = admin.firestore()

//crop category index
router.get('/cropcategory/:lang', async (req, res)=>{
    await db.collection('cropCategories').doc(req.params.lang).collection('cropCategory').orderBy("sortOrder", "asc").get().then((snapshot) =>{
                db.collection('crops').doc(req.params.lang).collection('crop').get().then((crop) =>{
                    res.render('cropCategory/index', {snapshot: snapshot, lang: req.params.lang, crop: crop})
                })
        })
})
//select language
router.get('/addcropcategory/select', (req, res) => {
    res.render('cropCategory/select')
})
//add crop category
router.get('/addcropcategory/:lang', (req, res) =>{
    res.render('cropCategory/add', {lang: req.params.lang})
})
//add crop category post route
router.post('/cropcategory', async (req, res) => {
    
    if(req.body.lang === 'english'){
        await db.collection('cropCategories').doc('english').collection('cropCategory').add({
            name: req.body.name,
            image: req.body.image,
            sortOrder:  parseInt(req.body.sortOrder),
            active: req.body.active,
            language: req.body.lang
          })
          res.redirect('/cropcategory/'+ req.body.lang)
    } else if(req.body.lang === 'gujrati') {
        await db.collection('cropCategories').doc('gujrati').collection('cropCategory').add({
            name: req.body.name,
            image: req.body.image,
            sortOrder:  parseInt(req.body.sortOrder),
            active: req.body.active,
            language: req.body.lang
          })
          res.redirect('/cropcategory/'+ req.body.lang)
    }
    
      
})
//edit crop category 
router.get('/cropcategory/edit/:lang/:id', async (req,res) =>{

    let cropRef = db.collection('cropCategories').doc(req.params.lang).collection('cropCategory').doc(req.params.id)  
        await cropRef.get().then((doc) =>{
            console.log(doc.data())
            res.render('cropCategory/edit', {crop : doc})
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
})
//update route
router.post('/cropcategory/edit/:lang/:id', async (req, res) =>{
    await db.collection('cropCategories').doc(req.params.lang).collection('cropCategory').doc(req.params.id).update({
        name: req.body.name,
        image: req.body.image,
        sortOrder: parseInt(req.body.sortOrder),
        active: req.body.active
      })
      res.redirect('/cropcategory/'+ req.params.lang)
})





//delete crop category
router.post('/cropcategory/delete/:lang/:id', async (req, res) => {
    await db.collection('cropCategories').doc(req.params.lang).collection('cropCategory').doc(req.params.id).delete()

    res.redirect('/cropcategory/'+ req.params.lang)
})



module.exports = router ;