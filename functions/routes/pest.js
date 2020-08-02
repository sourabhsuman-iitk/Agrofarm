const functions = require('firebase-functions');
const express = require("express");
const router = express.Router();

const admin = require("firebase-admin");

const db = admin.firestore()


//pest 
//pest index
router.get('/pest/:lang', async (req, res)=>{
    await db.collection('pests').doc(req.params.lang).collection('pest').orderBy("sortOrder", "asc").get().then((snapshot) =>{
            db.collection('pestGroups').doc(req.params.lang).collection('pestGroup').get().then((pestg) =>{
                res.render('pest/index', {snapshot: snapshot, lang: req.params.lang, pestg: pestg})
            })
        })
})
//select language
router.get('/addpest/select', (req, res) => {
    res.render('pest/select')
})
//add pest 
router.get('/addpest/:lang', async (req, res) =>{
    await db.collection('pestGroups').doc(req.params.lang).collection('pestGroup').get().then((pestg) =>{
        db.collection('chemicalProducts').doc(req.params.lang).collection('chemicalProduct').get().then((chemp) =>{
            res.render('pest/add', {lang: req.params.lang, pestg: pestg, chemp: chemp})
        })
    })
})
//add pest  post route
router.post('/pest', async (req, res) => {
    
    if(req.body.lang === 'english'){
        await db.collection('pests').doc('english').collection('pest').add({
            name: req.body.name,
            image: req.body.image,
            sortOrder: parseInt(req.body.sortOrder),
            description: req.body.description,
            active: req.body.active,
            symptom: req.body.symptom,
            control: req.body.control,
            cause: req.body.cause,
            linkedPestGroupId: req.body.linkedPestGroupId,
            linkedChemicalProdId: req.body.linkedChemicalProdId,
            language: req.body.lang
          })
          res.redirect('/pest/'+ req.body.lang)
    } else if(req.body.lang === 'gujrati') {
        await db.collection('pests').doc('gujrati').collection('pest').add({
            name: req.body.name,
            image: req.body.image,
            sortOrder: parseInt(req.body.sortOrder),
            description: req.body.description,
            active: req.body.active,
            symptom: req.body.symptom,
            control: req.body.control,
            cause: req.body.cause,
            linkedPestGroupId: req.body.linkedPestGroupId,
            linkedChemicalProdId: req.body.linkedChemicalProdId,
            language: req.body.lang
          })
          res.redirect('/pest/'+ req.body.lang)
    }
    
      
})
//show 
router.get('/pest/show/:lang/:id', (req, res) => {
    let pestGrpRef = db.collection('pestGroups').doc(req.params.lang).collection('pestGroup')
    let chemProdRef = db.collection('chemicalProducts').doc(req.params.lang).collection('chemicalProduct') 
    let cropRef = db.collection('pests').doc(req.params.lang).collection('pest').doc(req.params.id)  
        cropRef.get().then((crop) =>{
            pestGrpRef.get().then((pestg) =>{
                chemProdRef.get().then((chemp) =>{
        res.render('pest/show', {crop: crop, pestg: pestg, chemp: chemp})
                })
            })
        }).catch(function(error) {
            console.log("Error getting document:", error);
    });
})
//edit route
router.get('/pest/edit/:lang/:id', async (req,res) =>{
    let pestGrpRef = db.collection('pestGroups').doc(req.params.lang).collection('pestGroup')
    let chemProdRef = db.collection('chemicalProducts').doc(req.params.lang).collection('chemicalProduct') 
    let cropRef = db.collection('pests').doc(req.params.lang).collection('pest').doc(req.params.id)  
        await cropRef.get().then((crop) =>{
            pestGrpRef.get().then((pestg) =>{
                chemProdRef.get().then((chemp) =>{
            res.render('pest/edit', {crop: crop, pestg: pestg, chemp: chemp})
                })
            })
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
})
//update route
router.post('/pest/edit/:lang/:id', async (req, res) =>{
    await db.collection('pests').doc(req.params.lang).collection('pest').doc(req.params.id).update({
        name: req.body.name,
        image: req.body.image,
        sortOrder: parseInt(req.body.sortOrder),
        description: req.body.description,
        active: req.body.active,
        symptom: req.body.symptom,
        control: req.body.control,
        cause: req.body.cause,
        linkedPestGroupId: req.body.linkedPestGroupId,
        linkedChemicalProdId: req.body.linkedChemicalProdId
      })
      res.redirect('/pest/'+ req.params.lang)
})

//delete route
router.post('/pest/delete/:lang/:id', async (req, res) => {
    await db.collection('pests').doc(req.params.lang).collection('pest').doc(req.params.id).delete()

    res.redirect('/pest/'+ req.params.lang)
})


module.exports = router ;