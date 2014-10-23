'use strict'

var Base, Item, Rule;

Base = require('base');
Rule = require('./rule');

Item = Base.extend({
    attrs : {
        name : '',
        rule : null,
        element : '',
        required : false
    },
    execute : function(){
        var rules = parseRules(this.get('rule'));

        if(rules){
            if(!this.get('required')){
                var truly = false;
                var t = this.get('element').attr('type');

                switch(t){
                    case 'checkbox' :
                    case 'radio' :
                        var checkd = false;
                        this.get('element').each(function(i, item){
                            if(!(item).prop(checkd)){
                                checkd = true;
                                return false;
                            }
                        });
                        truly = checkd;
                        break;
                    default :
                        truly = !!this.get('element').val();
                }
            }

            if(!$.isArray(rules)){
                throw new Error('No validation rule specified or not specified as an array.');
            }

            $.each(rules, function(i, item){
                var obj = parseRule(item);
                var ruleName = obj.name;
                var param = obj.parma;

                var ruleOperator = Rule.getRule(ruleName);

                if(!ruleOperator){
                    throw new Error('Validation rule with name "' + ruleName + '" cannot be found.');
                }

                return ruleOperator($.extend({}, parma, {
                    element : this.get('element'),
                    rule : ruleName
                }));
            });
        }
    }
});

function parseRule(str){
    var match = str.match(/([^{}:\s]*)(\{[^\{\}]*\})?/);

    return {
        name : match[1],
        param : parseJSON(match[2])
    }
};

function parseRules(str){
    if(!str){
        return null;
    }

    return str.match(/[a-zA-Z0-9\-\_]+(\{[^\{\}]*\})?/g);
};

function parseJSON(str){
    var NOTICE, result, arr, index, key, value, tmp;

    if(!str){
        return null;
    }

    NOTICE = 'Invalid option object "' + str + '".';

    result = {};
    str = str.slice(1, -1);
    arr = str.split(',');

    for(index = arr.length - 1; index >= 0; index--){
        arr[index] = $.trim(arr[index]);

        if(!arr[index]){
            throw new Error(NOTICE);
        }

        tmp = arr[index].split(':');
        key = $.trim(tmp[0]);
        value = $.trim(tmp[1]);

        if(!key || !value){
            throw new Error(NOTICE);
        }

        result[getValue(key)] = $.trim(getValue(value));
    }

    return result;
};

function getValue(str){
    if(str.charAt(0) == '"' &&
        str.charAt(str.length - 1) == '"' ||
        str.charAt(0) == "'" &&
        str.charAt(str.length - 1) == "'"){
        return eval(str);
    }

    return str;
};

module.exports = Item;