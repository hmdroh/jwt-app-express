const { json } = require('express');
const express = require('express')
const jwt = require('jsonwebtoken')

const app = express();

app.get('/api', (req,res)=>{
    res.json({
        message: 'welcome to the api'
    })
})

app.post('/api/posts', verifyToken, (req,res)=>{
    jwt.verify(req.token, 'mysecretkey', (err, authData)=>{
        if(err){
            // forbidden
            res.sendStatus(403)
        }else {
            res.json({
                message: 'Protected data1',
                authData
            })
        }
    })
})

app.post('/api/login', (req,res)=>{
    const user = {id:1, username: 'hamed', email:'hamed@farsales.com'}
    jwt.sign(
        {user}, 
        'mysecretkey', 
        {expiresIn: '30s'},
    (err, token)=>{
        res.json({token})
    });
})

/** FORMAT
    Authorization: Bearer <access_token>
 */
// verifying token
function verifyToken(req, res, next){

    // get the auth header value
    const bHeader = req.headers['authorization'];
    if(typeof bHeader!== 'undefined' ){
        // split
        const bearer = bHeader.split(' ');
        // get token from array
        const bearerToken = bearer[1];
        // set token
        req.token = bearerToken;
        // next middle wear
        next()
    }else {
        // forbidden
        res.sendStatus(403);
    }
}

app.listen(5000, ()=> console.log('http://localhost:5000'))


/** The front end app should have header with the 
 * Authorization: Bearer {TOKEN}
 * header to access the protected route
 * 
 */