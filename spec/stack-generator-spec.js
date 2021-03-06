describe('StackGenerator', function () {
    describe('#backtrace', function () {
        it('should generate backtrace for function declarations', function () {
            var stackFrames = null;
            function foo() {
                bar('arg1', 42);
            }
            function bar() {
                stackFrames = StackGenerator.backtrace();
            }
            foo();

            expect(stackFrames).toBeTruthy();
            expect(stackFrames[0]).toMatchStackFrame(['StackGenerator$$backtrace', [], undefined, undefined, undefined]);
            expect(stackFrames[1]).toMatchStackFrame(['bar', ['arg1', 42], undefined, undefined, undefined]);
            expect(stackFrames[2]).toMatchStackFrame(['foo', [], undefined, undefined, undefined]);
        });

        it('should generate backtrace for named function expressions', function () {
            var stackFrames = null;
            var foo = function foo() {
                bar();
            };
            var bar = function bar() {
                stackFrames = StackGenerator.backtrace();
            };
            foo();

            expect(stackFrames).toBeTruthy();
            expect(stackFrames[0]).toMatchStackFrame(['StackGenerator$$backtrace', [], undefined, undefined, undefined]);
            expect(stackFrames[1]).toMatchStackFrame(['bar', [], undefined, undefined, undefined]);
            expect(stackFrames[2]).toMatchStackFrame(['foo', [], undefined, undefined, undefined]);
        });

        it('should limit stack size given a max stack size', function () {
            var stackFrames = null;
            var foo = function foo() {
                bar();
            };
            var bar = function () {
                stackFrames = StackGenerator.backtrace({maxStackSize: 2});
            };
            foo();

            expect(stackFrames).toBeTruthy();
            expect(stackFrames.length).toBe(2);
        });

        it('should stop and not throw error when encountering a call to eval', function() {
            var stackFrames = null;
            var foo = function foo() {
                eval("stackFrames = StackGenerator.backtrace({maxStackSize: 2});");
            };
            foo();

            expect(stackFrames).toBeTruthy();
            expect(stackFrames[0].functionName).toBe('StackGenerator$$backtrace');
        });

        it('should stop and not throw error when entering a strict-mode context', function() {
            'use strict';

            function _isStrictMode() {
                return (eval("var __temp = null"), (typeof __temp === "undefined"));
            }

            var stackFrames = null;
            var foo = function () {
                bar();
            };
            var bar = function bar() {
                stackFrames = StackGenerator.backtrace({maxStackSize: 25});
            };
            foo();

            expect(stackFrames).toBeTruthy();
            if (_isStrictMode()) {
                expect(stackFrames.length).toBe(1);
            }
            expect(stackFrames[0].functionName).toBe('StackGenerator$$backtrace');
        });
    });
});
