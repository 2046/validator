define(function(require, exports, module){
    'use strict'
    
    var Base, Validator, Rule, Item, validators;
    
    validators = [];
    Base = require('base');
    Rule = require('./rule');
    Item = require('./item');
    
    Validator = Base.extend({
        attrs : {
            showMessage : noop,
            hideMessage : noop,
            onFormValidate : noop,
            onFormValidated : noop,
            triggerType : 'submit'
        },
        element : null,
        specialProps : ['element'],
        init : function(){
            var ctx = this;
    
            this.items = [];
            this.element = $(this.element);
    
            if(this.element.is('form')){
                this._novalidate_old = this.element.attr('novalidate');
    
                try{
                    this.element.attr('novalidate', 'novalidate');
                }catch(e){}
    
                this.element.on('submit.validator', function(e){
                    e.preventDefault();
                    ctx.execute();
                });
            }
    
            validators.push(this);
        },
        addItem : function(options){
            options = $.extend({
                triggerType : this.get('triggerType'),
                hideMessage : this.get('hideMessage'),
                showMessage : this.get('showMessage'),
                element : this.$('[name=' + options.name + ']')
            }, options);
    
            if(!options.element.length){
                throw new Error('element does not exist');
            }
    
            this.items.push(new Item(options));
    
            return this;
        },
        removeItem : function(selector){
            var index, target;
    
            if(typeof selector === 'string'){
                target = findItem(this, selector);
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
            var pass = true;
    
            this.trigger('formValidate', this.element);
            $.each(this.items, function(i, item) {
		item.get('hideMessage')(item.get('element'), null);
	    });
    
            $.each(this.items, function(i, item){
                if(!(pass = item.execute())){
                    return false;
                }
            });
    
            this.trigger('formValidated', pass, this.element);
    
            return this;
        },
        $ : function(selector){
            return this.element.find(selector);
        },
        destroy : function(){
            var index = this.items.length - 1;
    
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
    
            for(;index >= 0; index--){
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
    
    function findItem(ctx, name){
        var index, target, items;
    
        items = ctx.items;
        index = items.length - 1;
    
        for(; index >= 0; index--){
            target = items[index];
            if(name === target.get('name')){
                break;
            }
        }
    
        return target;
    };
    
    function noop(){};
    
    Validator.getRule = Rule.getRule;
    Validator.addRule = Rule.addRule;
    
    module.exports = Validator;
});
