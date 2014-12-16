define(function(require, exports, module){
    'use strict'
    
    var Base, Item, Rule;
    
    Base = require('base');
    Rule = require('./rule');
    
    Item = Base.extend({
        attrs : {
            name : '',
            rule : '',
            element : '',
            showMessage : noop,
            hideMessage : noop,
            skipHidden : false,
            triggerType : 'submit'
        },
        init : function(){
            var ctx, rules, element;
    
            ctx = this;
            this.tasks = [];
            element = this.get('element');
            rules = parseRules(this.get('rule'));
    
            if(rules){
                if(!$.isArray(rules)){
                    throw new Error('No validation rule specified or not specified as an array.');
                }
    
                $.each(rules, function(index, rule){
                    var ruleOperator;
    
                    rule = parseRule(rule);
                    ruleOperator = Rule.getOperator(rule.name);
    
                    if(!ruleOperator){
                        throw new Error('Validation rule with name "' + rule.name + '" cannot be found.');
                    }
    
                    ctx.tasks.push({
                        name : rule.name,
                        ruleOperator : ruleOperator,
                        param : $.extend({}, rule.param, {
                            element : element
                        })
                    });
                });
            }
    
            this.behavior();
        },
        behavior : function(){
            var ctx = this;
    
            if(this.get('triggerType') === 'blur'){
                this.get('element').parent('form').on('blur.validator', '[name=' + this.get('name') + ']', function(e){
                    e.preventDefault();
                    ctx.execute();
                });
            }
        },
        execute : function(){
            var pass, ruleName, element;
    
            pass = true;
            element = this.get('element');
    
            $.each(this.tasks, function(index, task){
                ruleName = task.name;
    
                if(!(pass = task.ruleOperator(task.param))){
                    return false;
                }
            });
            
            if(this.get('skipHidden') && !element.is(':visible')){
                pass = true;
            }
    
            this.get(pass ? 'hideMessage' : 'showMessage')(element, ruleName);
    
            return pass;
        },
        destroy : function(){
            this.get('hideMessage')(this.get('element'), null);
    
            if(this.get('triggerType') === 'blur'){
                this.get('element').parent('form').off('blur.validator', '[name=' + this.get('name') + ']');
            }
    
            Item.superclass.destroy.call(this);
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
        arr = str.slice(1, -1).split(',');
    
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
        if(str.charAt(0) == '"' && str.charAt(str.length - 1) == '"' ||
            str.charAt(0) == "'" && str.charAt(str.length - 1) == "'"){
            return eval(str);
        }
    
        return str;
    };
    
    function noop(){};
    
    module.exports = Item;
});
