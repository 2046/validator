define(function(require, exports, module){
    'use strict'
    
    var Base, Validator, Rule, Item, validators;
    
    validators = [];
    Base = require('base');
    Rule = require('./rule');
    Item = require('./item');
    
    Validator = Base.extend({
        attrs : {
            checkOnSubmit : true
        },
        element : null,
        specialProps : ['element'],
        init : function(){
            var ctx = this;
    
            this.items = [];
    
            if(this.element.is('form')){
                this._novalidate_old = this.element.attr('novalidate');
    
                try{
                    this.element.attr('novalidate', 'novalidate');
                }catch(e){}
    
                if(this.get('checkOnSubmit')){
                    this.element.on('submit.validator', function(e){
                        e.preventDefault();
                        ctx.execute();
                    });
                }
            }
    
            validators.push(this);
        },
        addItem : function(options){
            options.element = this.$('[name=' + options.name + ']');
    
            if(!options.element.length){
                throw new Error('element does not exist');
            }
    
            this.items.push(new Item(options));
    
            return this;
        },
        removeItem : function(selector){
            var index, target;
    
            if(typeof selector === 'string'){
                for(index = this.items.length - 1; index >=0; index--){
                    if(name === this.items[index].get('name')){
                        target = this.items[index];
                        break;
                    }
                }
            }else if(selector instanceof Item){
                target = selector;
            }
    
            if(target){
                erase(target, this.items);
                target.destroy();
            }
    
            return this;
        },
        execute : function(){
            $.each(this.items, function(i, item){
                item.execute();
            });
    
            return this;
        },
        $ : function(selector){
            return this.element.find(selector);
        },
        destroy : function(){
            var index;
    
            if(this.element.is('form')){
                try{
                    if(this._novalidate_old){
                        this.element.attr('novalidate', this._novalidate_old);
                    }else{
                        this.element.removeAttr('novalidate');
                    }
                }catch(e){}
    
                this.element.off('submit.validator');
            }
    
            for(index = this.items.length - 1; index >= 0; index--){
                this.removeItem(this.items[index]);
            }
    
            erase(this, validators);
            Validator.superclass.destroy.call(this);
        }
    });
    
    function erase(target, array){
        var index, len;
    
        for(index = 0, len = array.length; index < len; index++){
            if(target === array[index]){
                array.splice(index, 1);
                return array;
            }
        }
    };
    
    new Validator({
        element : $('#form')
    }).addItem({
        name : 'username',
        required : true,
        rule : 'email minlength{min:1}'
    });
    
    Validator.getRule = Rule.getRule;
    Validator.addRule = Rule.addRule;
    
    module.exports = Validator;
});