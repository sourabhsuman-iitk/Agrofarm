const functions = require('firebase-functions');
const express = require("express");
const router = express.Router();

const admin = require("firebase-admin");

const db = admin.firestore()

//pest groups
//pest group index
router.get('/pestgroup/:lang', async (req, res)=>{
    await db.collection('pestGroups').doc(req.params.lang).collection('pestGroup').orderBy("sortOrder", "asc").get().then((snapshot) =>{
                db.collection('pests').doc(req.params.lang).collection('pest').get().then((pest) =>{
                    res.render('pestGroup/index', {snapshot: snapshot, lang: req.params.lang, pest: pest})
                })
        })
})
//select language
router.get('/addpestgroup/select', (req, res) => {
    res.render('pestGroup/select')
})
//add pest group
router.get('/addpestgroup/:lang', (req, res) =>{
    res.render('pestGroup/add', {lang: req.params.lang})
})
//add pest group post route
router.post('/pestgroup', async (req, res) => {
    
    if(req.body.lang === 'english'){
        await db.collection('pestGroups').doc('english').collection('pestGroup').add({
            name: req.body.name,
            image: req.body.image,
            sortOrder:parseInt(req.body.sortOrder),
            active: req.body.active,
            language: req.body.lang
          })
          res.redirect('/pestgroup/'+ req.body.lang)
    } else if(req.body.lang === 'gujrati') {
        await db.collection('pestGroups').doc('gujrati').collection('pestGroup').add({
            name: req.body.name,
            image: req.body.image,
            sortOrder: parseInt(req.body.sortOrder),
            active: req.body.active,
            language: req.body.lang
          })
          res.redirect('/pestgroup/'+ req.body.lang)
    }
    
      
})
//edit route
router.get('/pestgroup/edit/:lang/:id', async (req,res) =>{

    let cropRef = db.collection('pestGroups').doc(req.params.lang).collection('pestGroup').doc(req.params.id)  
        await cropRef.get().then((doc) =>{
            
            res.render('pestGroup/edit', {crop : doc})
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
})
//update route
router.post('/pestgroup/edit/:lang/:id', async (req, res) =>{
    await db.collection('pestGroups').doc(req.params.lang).collection('pestGroup').doc(req.params.id).update({
        name: req.body.name,
        image: req.body.image,
        sortOrder: parseInt(req.body.sortOrder),
        active: req.body.active
      })
      res.redirect('/pestgroup/'+ req.params.lang)
})

//delete route
router.post('/pestgroup/delete/:lang/:id', async (req, res) => {
    await db.collection('pestGroups').doc(req.params.lang).collection('pestGroup').doc(req.params.id).delete()

    res.redirect('/pestgroup/'+ req.params.lang)
})


module.exports = router ;