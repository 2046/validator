define(function(require, exports, module){
    'use strict'

    var Validator = require('validator');

    new Validator({
        element : $('#form'),
        onFormValidated : function(pass, element){
            console.log(pass, element);
        }
    }).addItem({
        name : 'username',
        rule : 'required email',
        showMessage : function(element, ruleName){
            console.log(element, ruleName);
        },
        hideMessage : function(element, ruleName){
            console.log(element, ruleName);
        }
    }).addItem({
        name : 'username2',
        rule : 'required email'
    });
});