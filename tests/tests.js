var assert = require('assert');
//const { login } = require('../controllers/users.js');
//const { getOne } = require('../controllers/users.js');
// const { webscrapper } = require('../models/product.js');

const {User} = require("../models/user.js");
const request = require('request');
const { mongoose } = require('mongoose');

describe('Webscrapper Tests with Mocha', function(){
    describe('Test Models', function(){
        describe('Login', function(){
            let email = 'user1@gmail.com';
            let password = 'pass123';
            var login = new UserModel(email, password);       
            it('Test creation of a valid user with parameters matching', function(){                
                assert.strictEqual(login.email, 'user1@mun.ca');
                assert.strictEqual(login.password, 'pass123');
            });
            it('Test if user is invalid function (Invalid Email)', async function(){
                let c1 = new Contact('user1#gmail@com', password);
                assert.strictEqual(await c1.isValid(), false);
            });
            it('Test if user is invalid function (Invalid password)', async function(){
                let c2 = new Contact(email, '70X11122X2');
                assert.strictEqual(await c2.isValid(), false);
            });
        });
    });

    
});