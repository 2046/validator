'use strict'

var rules = {};

function addRule(name, operator){
    if(operator instanceof RegExp){
        rules[name] = function(options){
            return operator.test($(options.element).val());
        };
    }else if(isFunction(operator)){
        rules[name] = function(options){
            return operator.call(this, options);
        };
    }else{
        throw new Error('The second argument must be a regexp or a function.');
    }
};

function getRule(name){
    return rules[name];
};

addRule('text', /.*/);
addRule('radio', /.*/);
addRule('password', /.*/);
addRule('checkbox', /.*/);
addRule('mobile', /^1\d{10}$/);
addRule('email', /^\s*([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,20})\s*$/);
addRule('url', /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/);
addRule('date', /^\d{4}\-[01]?\d\-[0-3]?\d$|^[01]\d\/[0-3]\d\/\d{4}$|^\d{4}年[01]?\d月[0-3]?\d[日号]$/);
addRule('number', /^[+-]?[1-9][0-9]*(\.[0-9]+)?([eE][+-][1-9][0-9]*)?$|^[+-]?0?\.[0-9]+([eE][+-][1-9][0-9]*)?$|^0$/);

addRule('required', function(options){
    var element = $(options.element);

    switch(element.attr('type')){
        case 'checkbox' :
        case 'radio' :
            var checked = false;
            element.each(function(i, item){
                if($(item).prop('checked')){
                    checked = true;
                    return false;
                }
            });
            return checked;
        default :
            return Boolean($.trim(element.val()));
    }
});
addRule('min', function(options){
    return Number(options.element.val()) >= Number(options.min);
});
addRule('max', function(options){
    return Number(options.element.val()) <= Number(options.max);
});
addRule('minlength', function(options){
    return options.element.val().length >= Number(options.min);
});
addRule('maxlength', function(options){
    return options.element.val().length <= Number(options.max);
});

module.exports = {
    getRule : getRule,
    addRule : addRule
};

function isFunction(val){
    return Object.prototype.toString.call(val) === '[object Function]';
};