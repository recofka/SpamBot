const User = require('../users/model');
const {toData} = require('./jwt');

const auth = (req, res, next) => {
    const auth = req.headers.authorization && req.headers.authorization.split(' ');
    if(auth && auth[0] === 'Bearer' && auth[1]){
        try {
            const data = toData(auth[1]);
            User
                .findById(data.userId)
                .then(user => {
                    if(!user) return next('User does not exist');

                    req.user = user;
                    next()
                })
                .catch(next)
        }catch(error){
            res.status(400).send({
                message: `Error ${error.name}: ${error.message}`
            })
        }
    } else{
        res.status(401).send({
            message: 'Please using valid password and email'
        })
    }
}

module.exports = auth;