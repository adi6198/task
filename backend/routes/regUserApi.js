const express=require('express');
const router = express.Router();
const app=express();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const bodyParser = require('body-parser');
const RegUser = require('../models/regUser');

app.use(bodyParser.json());


router.route('/add').post((req, res) => {
    // let issue = new Issue(req.body);
    let user = new RegUser();
    let userData = req.body;
        userData.password = user.generateHash(userData.password);
    let newUser = new RegUser(userData);
        newUser.save()
        .then(regUser1 => {
            console.log(regUser1);
            res.status(200).json({'issue': 'Added successfully'});
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
    });


module.exports = router;