define(function(require, exports, module){
    'use strict'

    var Validator = require('validator');

    new Validator({
        element : $('#form')
    }).addItem({
        name : 'username',
        rule : 'required email minlength{min:1}'
    });
});