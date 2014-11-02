define(function(require, exports, module){
    'use strict'

    var Validator = require('validator');

    Validator.addRule('account', Validator.getRule('email').or('mobile'))

    new Validator({
        element : $('#form'),
        onFormValidated : function(pass, element){
            console.log(pass, element);
        }
    }).addItem({
        name : 'username',
        rule : 'required email minlength{min:8} maxlength{max:16}',
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