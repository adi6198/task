const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const router = express.Router();
const Issue = require('./models/Issue');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/issues');

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});

router.route('/issues').get((req, res) => {
    Issue.find((err, issues) => {
        if (err)
            console.log(err);
        else
            console.log("Hello");
            res.json(issues);
    });
});

router.route('/issues/:id').get((req, res) => {
    Issue.findById(req.params.id, (err, issue) => {
        if (err)
            console.log(err);
        else
            res.json(issue);
    })
});

router.route('/issues/add').post((req, res) => {
    // let issue = new Issue(req.body);
    console.log(req.body.title);
    const issue = new Issue({
        title: req.body.title,
        responsible: req.body.responsible,
        description: req.body.description,
        severity: req.body.severity,
        status: req.body.status
    })
    // console.log(Issue);
    console.log(issue);
    issue.save()
        .then(issue1 => {
            console.log(issue1);
            res.status(200).json({'issue': 'Added successfully'});
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
});

router.route('/issues/update/:id').put((req, res) => {
    Issue.findById(req.params.id, (err, issue) => {
        if (!issue)
            return next(new Error('Could not load Document'));
        else {
            issue.title = req.body.title;
            issue.responsible = req.body.responsible;
            issue.description = req.body.description;
            issue.severity = req.body.severity;
            issue.status = req.body.status;

            issue.save().then(issue => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});

router.route('/issues/delete/:id').delete((req, res) => {
    Issue.findByIdAndRemove({_id: req.params.id}, (err, issue) => {
        if (err)
            res.json(err);
        else
            res.json('Removed successfully');
    });
});

app.use('/', router);

app.listen(4001, () => console.log(`Express server running on port 4001`));


