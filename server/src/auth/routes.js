const { Router } = require('express');
const {toJWT} = require('./jwt');
const User = require('../users/model');
const auth = require('./middleware');
const bcrypt = require('bcrypt');

const router = new Router();

router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password){
        res.status(400).send({
            message: 'Please using valid email address password and password confirmation'
        })
    } else {
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(entity => {
            if(!entity){
                res.status(400).send({
                    message: 'User with that email does not exist'
                })
            }else if(bcrypt.compareSync(req.body.password, entity.password)){
                res.send({
                    jwt: toJWT({userId: entity.id})
                })
            } else {
                res.status(400).send({
                    message: 'Password incorrect'
                })
            }
        })
            .catch(error => {
                console.error(error);
                res.status(500).send({
                    message: 'Server error'
                })
            })
    }
});

module.exports = router;