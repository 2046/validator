define(function(require, exports, module){
    'use strict'

    var Validator, expect;

    expect = require('expect');
    Validator = require('validator');

    describe('Validator', function(){
        if(!$('#test-form').length){
            $('<form id="test-form" style="display:none"><input name="email" id="email" /><input name="password" id="password" /></form>').appendTo(document.body);
        }

        var validator;

        beforeEach(function(){
          validator = new Validator({
            element : '#test-form'
          });
        });

        afterEach(function(){
          validator.destroy();
        });

        it('element', function(){
            expect(validator.element.is('#test-form')).to.be(true);
        });

        it('events', function(){
            validator.addItem({
                name : 'email',
                rule : 'required'
            });

            validator.on('formValidate', function(element){
                expect(element.get(0)).to.be($('#test-form').get(0));
            });

            validator.on('formValidated', function(pass, element){
                expect(pass).to.be(false);
                expect(element.get(0)).to.be($('#test-form').get(0));
            });

            validator.execute();
        });

        it('required', function(){
            var counter = 0;

            validator.addItem({
                name : 'email',
                rule : 'required'
            });

            validator.on('formValidated', function(pass, element){
                if(counter === 1){
                    expect(pass).to.be(false);
                }else if(counter === 2){
                    expect(pass).to.be(true);
                }
            });

            counter = 1;
            validator.execute();

            $('[name=email]').val('someValue');
            counter = 2;
            validator.execute();

            counter = 0;
            $('[name=email]').val('');
        });

        it('email', function(){
            validator.addItem({
                name : 'email',
                rule : 'email',
                showMessage : function(element, ruleName){
                    expect(ruleName).to.be('email');
                },
                hideMessage : function(element, ruleName){
                    if(ruleName){
                        expect(ruleName).to.be('email');
                    }
                }
            });

            $('[name=email]').val('someValue');
            validator.execute();
            $('[name=email]').val('a@abc.com');
            validator.execute();
            $('[name=email]').val('');
        });

        it('destroy', function(){
            validator.addItem({
                name : 'email',
                rule : 'email'
            });

            validator.destroy();
            expect(validator.items).to.be(undefined);
        });
    });

    describe('Validator-Core-2', function(){
        if(!$('#container').length){
            $('<div id="container" style="display:none"><input name="email" id="email" /><input name="password" id="password" /></div>')
                .appendTo(document.body);
        }

        var validator;

        beforeEach(function(){
            validator = new Validator({
                element : '#container'
            });
        });

        afterEach(function(){
            validator.destroy();
        });

        it('element', function(){
            expect(validator.element.is('#container')).to.be(true);
        });

        it('events', function(){
            validator.addItem({
                name : 'email',
                rule : 'required'
            });

            validator.on('formValidate', function(element){
                expect(element.get(0)).to.be($('#container').get(0));
            });

            validator.on('formValidated', function(pass, element){
                expect(pass).to.be(false);
                expect(element.get(0)).to.be($('#container').get(0));
            });

            validator.execute();
        });
    });

    describe('rules', function(){
        if(!$('#test-form').length){
            $('<form id="test-form" style="display:none"><input name="email" id="email" /><input name="password" id="password" /></form>')
                    .appendTo(document.body);
        }

        afterEach(function(){
            $('[name=email]').val('');
        });

        it('email', function(){
            var validator = new Validator({
                element : '#test-form'
            }).addItem({
                name : 'email',
                rule : 'email',
                showMessage : function(element, ruleName){
                    expect(ruleName).to.be('email');
                },
                hideMessage : function(element, ruleName){
                    if(ruleName){
                        expect(ruleName).to.be('email');
                    }
                }
            });

            $('[name=email]').val('someValue');
            validator.execute();
            $('[name=email]').val('a@abc.com');
            validator.execute();
            $('[name=email]').val('');
        });

        it('text password radio checkbox', function(){
            var validator = new Validator({
                element : '#test-form'
            });

            $.each(['', 'a', '#@#', '..'], function(j, value){
                $('[name=email]').val(value);

                $.each(['text', 'password', 'radio', 'checkbox'], function(i, type){
                    validator.addItem({
                        name : 'email',
                        rule : type,
                        hideMessage : function(element, ruleName){
                            expect(element.get(0)).to.be($('[name=email]').get(0));
                        }
                    });
                });

                validator.execute();
            });
        });

        it('url', function(){
            var validator = new Validator({
                element : '#test-form'
            });

            $.each(['ads', 'http', 'https://', 'https'], function(j, value){
                $('[name=email]').val(value);

                validator.addItem({
                    name : 'email',
                    rule : 'url',
                    showMessage : function(element, ruleName){
                        expect(element.get(0)).to.be($('[name=email]').get(0));
                    }
                });

                validator.execute();
            });

            validator.destroy();
            var validator = new Validator({
                element : '#test-form'
            });

            $.each(['http://shaoshuai', 'https://shaoshuai', 'http://shaoshuai.me', 'https://shaoshuai.me', 'http://www.shaoshuai.me', 'https://www.shaoshuai.me/asdg', 'https://shaoshuai.me/'], function(j, value){
                $('[name=email]').val(value);

                validator.addItem({
                    name : 'email',
                    rule : 'url',
                    hideMessage : function(element, ruleName){
                        expect(element.get(0)).to.be($('[name=email]').get(0));
                    }
                });

                validator.execute();
            });

            validator.destroy();
        });

        it('number', function(){
            var validator = new Validator({
                element : '#test-form'
            });

            $.each(['123', '1', '1e+1', '1e-2', '1e+2', '0.4', '0.3E+1', '0.22e-13', '.3', '.4E+3', '+1.3E-3'], function(j, value){
                $('[name=email]').val(value);

                validator.addItem({
                    name : 'email',
                    rule : 'number',
                    hideMessage : function(element, ruleName){
                        expect(element.get(0)).to.be($('[name=email]').get(0));
                    }
                });

                validator.execute();
            });

            validator.destroy();

            var validator = new Validator({
                element : '#test-form'
            });

            $.each(['a', '.', '1.3e', '1.23.1', '+33e', '.4E3'], function(j, value){
                $('[name=email]').val(value);

                validator.addItem({
                    name : 'email',
                    rule : 'number',
                    showMessage : function(element, ruleName){
                        expect(element.get(0)).to.be($('[name=email]').get(0));
                    }
                });

                validator.execute();
            });

            validator.destroy();
        });

        it('date', function(){
            var validator = new Validator({
                element : '#test-form'
            });

            $.each(['1912-03-22', '1912-3-22', '2222-02-02', '01/31/1999', '1989年1月2号', '1989年1月2日'], function(j, value){
                $('[name=email]').val(value);

                validator.addItem({
                    name : 'email',
                    rule : 'date',
                    hideMessage : function(element, ruleName){
                        expect(element.get(0)).to.be($('[name=email]').get(0));
                    }
                });

                validator.execute();
            });

            validator.destroy();

            var validator = new Validator({
                element : '#test-form'
            });

            $.each(['12-03-22', '2212-113-02', '1/31/1999', '89年1月2号'], function(j, value){
                $('[name=email]').val(value);

                validator.addItem({
                    name : 'email',
                    rule : 'date',
                    showMessage : function(element, ruleName){
                        expect(element.get(0)).to.be($('[name=email]').get(0));
                    }
                });

                validator.execute();
            });

            validator.destroy();
        });

        it('min', function(){
            var validator = new Validator({
                element : '#test-form'
            });

            $.each(['1', '2'], function(j, value){
                $('[name=email]').val(value);

                validator.addItem({
                    name : 'email',
                    rule : 'min{min:1}',
                    hideMessage : function(element, ruleName){
                        expect(element.get(0)).to.be($('[name=email]').get(0));
                    }
                });

                validator.execute();
            });

            validator.destroy();

            var validator = new Validator({
                element : '#test-form'
            });

            $.each(['0', '-1'], function(j, value){
                $('[name=email]').val(value);

                validator.addItem({
                    name : 'email',
                    rule : 'min{min:1}',
                    showMessage : function(element, ruleName){
                        expect(element.get(0)).to.be($('[name=email]').get(0));
                    }
                });

                validator.execute();
            });

            validator.destroy();
        });

        it('max', function(){
            var validator = new Validator({
                element : '#test-form'
            });

            $.each(['1', '0', '-1'], function(j, value){
                $('[name=email]').val(value);

                validator.addItem({
                    name : 'email',
                    rule : 'max{max:1}',
                    hideMessage : function(element, ruleName){
                        expect(element.get(0)).to.be($('[name=email]').get(0));
                    }
                });

                validator.execute();
            });

            validator.destroy();

            var validator = new Validator({
                element : '#test-form'
            });

            $.each(['2', '3'], function(j, value){
                $('[name=email]').val(value);

                validator.addItem({
                    name : 'email',
                    rule : 'max{max:1}',
                    showMessage : function(element, ruleName){
                        expect(element.get(0)).to.be($('[name=email]').get(0));
                    }
                });

                validator.execute();
            });

            validator.destroy();
        });

        it('minlength', function(){
            var validator = new Validator({
                element : '#test-form'
            });

            $.each(['aaaaa', 'aasdsa'], function(j, value){
                $('[name=email]').val(value);

                validator.addItem({
                    name : 'email',
                    rule : 'minlength{min:5}',
                    hideMessage : function(element, ruleName){
                        expect(element.get(0)).to.be($('[name=email]').get(0));
                    }
                });

                validator.execute();
            });

            validator.destroy();

            var validator = new Validator({
                element : '#test-form'
            });

            $.each(['s', 'ssds'], function(j, value){
                $('[name=email]').val(value);

                validator.addItem({
                    name : 'email',
                    rule : 'minlength{min:5}',
                    showMessage : function(element, ruleName){
                        expect(element.get(0)).to.be($('[name=email]').get(0));
                    }
                });

                validator.execute();
            });

            validator.destroy();
        });

        it('maxlength', function(){
            var validator = new Validator({
                element : '#test-form'
            });

            $.each(['asdsa', 'asds', '1'], function(j, value){
                $('[name=email]').val(value);

                validator.addItem({
                    name : 'email',
                    rule : 'maxlength{max:5}',
                    hideMessage : function(element, ruleName){
                        expect(element.get(0)).to.be($('[name=email]').get(0));
                    }
                });

                validator.execute();
            });

            validator.destroy();

            var validator = new Validator({
                element : '#test-form'
            });

            $.each(['asdfdss', 'sdasdf'], function(j, value){
                $('[name=email]').val(value);

                validator.addItem({
                    name : 'email',
                    rule : 'maxlength{max:5}',
                    showMessage : function(element, ruleName){
                        expect(element.get(0)).to.be($('[name=email]').get(0));
                    }
                });

                validator.execute();
            });

            validator.destroy();
        });

        it('mobile', function(){
            var validator = new Validator({
                element : '#test-form'
            });

            $.each(['18767382931', '13323232345', '12090983432'], function(j, value){
                $('[name=email]').val(value);

                validator.addItem({
                    name : 'email',
                    rule : 'mobile',
                    hideMessage : function(element, ruleName){
                        expect(element.get(0)).to.be($('[name=email]').get(0));
                    }
                });

                validator.execute();
            });

            validator.destroy();

            var validator = new Validator({
                element : '#test-form'
            });

            $.each(['2123212343', '123', '3223221232'], function(j, value){
                $('[name=email]').val(value);

                validator.addItem({
                    name : 'email',
                    rule : 'mobile',
                    showMessage : function(element, ruleName){
                        expect(element.get(0)).to.be($('[name=email]').get(0));
                    }
                });

                validator.execute();
            });

            validator.destroy();
        });

        it('costom rules', function(done){
            var counter = 0;

            Validator.addRule('myemail', function(options){
                var element = options.element;
                return element.val() === 'abc@abc.com';
            });

            var validator = new Validator({
                element : '#test-form'
            });

            $('[name=email]').val('abc@abc.com');

            validator.addItem({
                name : 'email',
                rule : 'myemail',
                showMessage : function(element, ruleName){
                    counter = 1;
                },
                hideMessage : function(element, ruleName){
                    expect(counter).to.be(0);
                    expect(element.get(0)).to.be($('[name=email]').get(0));
                    done();
                }
            });

            validator.execute();
            validator.destroy();
        });

        it('and', function(){
            Validator.addRule('account', Validator.getRule('required').and('email'));

            var validator = new Validator({
                element : '#test-form'
            }).addItem({
                name : 'email',
                rule : 'account',
                showMessage : function(element, ruleName){
                    expect(element.get(0)).to.be($('[name=email]').get(0));
                },
                hideMessage : function(element, ruleName){
                    expect(element.get(0)).to.be($('[name=email]').get(0));
                }
            });


            validator.execute();
            $('[name=email]').val('abc@abc.com');
            validator.execute();
            $('[name=email]').val('');
        });

        it('or', function(){
            Validator.addRule('account', Validator.getRule('email').or('mobile'));

            var validator = new Validator({
                element : '#test-form'
            }).addItem({
                name : 'email',
                rule : 'account',
                showMessage : function(element, ruleName){
                    expect(element.get(0)).to.be($('[name=email]').get(0));
                },
                hideMessage : function(element, ruleName){
                    expect(element.get(0)).to.be($('[name=email]').get(0));
                }
            });

            $('[name=email]').val('abc@abc.com');
            validator.execute();
            $('[name=email]').val('18767382931');
            validator.execute();
            $('[name=email]').val('');
        });

        it('not', function(){
            Validator.addRule('account', Validator.getRule('email').not());

            var validator = new Validator({
                element : '#test-form'
            }).addItem({
                name : 'email',
                rule : 'account',
                showMessage : function(element, ruleName){
                    expect(element.get(0)).to.be($('[name=email]').get(0));
                }
            });

            $('[name=email]').val('abc@abc.com');
            validator.execute();
            $('[name=email]').val('');
        });
    });
});