/**
 * @fileoverview Tests for no-lone-blocks rule.
 * @author Brandon Mills
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-lone-blocks"),
	RuleTester = require("../../../lib/rule-tester/rule-tester"),
	parser = require("../../fixtures/fixture-parser");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 5,
		sourceType: "script",
	},
});

ruleTester.run("no-lone-blocks", rule, {
	valid: [
		"if (foo) { if (bar) { baz(); } }",
		"do { bar(); } while (foo)",
		"function foo() { while (bar) { baz() } }",

		// Block-level bindings
		{ code: "{ let x = 1; }", languageOptions: { ecmaVersion: 6 } },
		{ code: "{ const x = 1; }", languageOptions: { ecmaVersion: 6 } },
		{
			code: "'use strict'; { function bar() {} }",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "{ function bar() {} }",
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { impliedStrict: true } },
			},
		},
		{ code: "{ class Bar {} }", languageOptions: { ecmaVersion: 6 } },

		{
			code: "{ {let y = 1;} let x = 1; }",
			languageOptions: { ecmaVersion: 6 },
		},
		`
          switch (foo) {
            case bar: {
              baz;
            }
          }
        `,
		`
          switch (foo) {
            case bar: {
              baz;
            }
            case qux: {
              boop;
            }
          }
        `,
		`
          switch (foo) {
            case bar:
            {
              baz;
            }
          }
        `,
		{
			code: "function foo() { { const x = 4 } const x = 3 }",
			languageOptions: { ecmaVersion: 6 },
		},

		{
			code: "class C { static {} }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { foo; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { if (foo) { block; } } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { lbl: { block; } } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { { let block; } something; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { something; { const block = 1; } } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { { function block(){} } something; } }",
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { static { something; { class block {}  } } }",
			languageOptions: { ecmaVersion: 2022 },
		},

		/*
		 * Test case to support `using` declarations in advance of explicit resource management
		 * reaching stage 4.
		 * See https://github.com/eslint/eslint/issues/18204
		 */
		{
			code: `
{
  using x = makeDisposable();
}`,
			languageOptions: {
				parser: require(
					parser("typescript-parsers/no-lone-blocks/using"),
				),
				ecmaVersion: 2022,
			},
		},

		/*
		 * Test case to support `await using` declarations in advance of explicit resource management
		 * reaching stage 4.
		 * See https://github.com/eslint/eslint/issues/18204
		 */
		{
			code: `
{
  await using x = makeDisposable();
}`,
			languageOptions: {
				parser: require(
					parser("typescript-parsers/no-lone-blocks/await-using"),
				),
				ecmaVersion: 2022,
			},
		},
	],
	invalid: [
		{
			code: "{}",
			errors: [
				{
					messageId: "redundantBlock",
					type: "BlockStatement",
				},
			],
		},
		{
			code: "{var x = 1;}",
			errors: [
				{
					messageId: "redundantBlock",
					type: "BlockStatement",
				},
			],
		},
		{
			code: "foo(); {} bar();",
			errors: [
				{
					messageId: "redundantBlock",
					type: "BlockStatement",
				},
			],
		},
		{
			code: "if (foo) { bar(); {} baz(); }",
			errors: [
				{
					messageId: "redundantNestedBlock",
					type: "BlockStatement",
				},
			],
		},
		{
			code: "{ \n{ } }",
			errors: [
				{
					messageId: "redundantBlock",
					type: "BlockStatement",
					line: 1,
				},
				{
					messageId: "redundantNestedBlock",
					type: "BlockStatement",
					line: 2,
				},
			],
		},
		{
			code: "function foo() { bar(); {} baz(); }",
			errors: [
				{
					messageId: "redundantNestedBlock",
					type: "BlockStatement",
				},
			],
		},
		{
			code: "while (foo) { {} }",
			errors: [
				{
					messageId: "redundantNestedBlock",
					type: "BlockStatement",
				},
			],
		},

		// Non-block-level bindings, even in ES6
		{
			code: "{ function bar() {} }",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "redundantBlock",
					type: "BlockStatement",
				},
			],
		},
		{
			code: "{var x = 1;}",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "redundantBlock",
					type: "BlockStatement",
				},
			],
		},

		{
			code: "{ \n{var x = 1;}\n let y = 2; } {let z = 1;}",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "redundantNestedBlock",
					type: "BlockStatement",
					line: 2,
				},
			],
		},
		{
			code: "{ \n{let x = 1;}\n var y = 2; } {let z = 1;}",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "redundantBlock",
					type: "BlockStatement",
					line: 1,
				},
			],
		},
		{
			code: "{ \n{var x = 1;}\n var y = 2; }\n {var z = 1;}",
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "redundantBlock",
					type: "BlockStatement",
					line: 1,
				},
				{
					messageId: "redundantNestedBlock",
					type: "BlockStatement",
					line: 2,
				},
				{
					messageId: "redundantBlock",
					type: "BlockStatement",
					line: 4,
				},
			],
		},
		{
			code: `
              switch (foo) {
                case 1:
                    foo();
                    {
                        bar;
                    }
              }
            `,
			errors: [
				{
					messageId: "redundantBlock",
					type: "BlockStatement",
					line: 5,
				},
			],
		},
		{
			code: `
              switch (foo) {
                case 1:
                {
                    bar;
                }
                foo();
              }
            `,
			errors: [
				{
					messageId: "redundantBlock",
					type: "BlockStatement",
					line: 4,
				},
			],
		},
		{
			code: `
              function foo () {
                {
                  const x = 4;
                }
              }
            `,
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "redundantNestedBlock",
					type: "BlockStatement",
					line: 3,
				},
			],
		},
		{
			code: `
              function foo () {
                {
                  var x = 4;
                }
              }
            `,
			errors: [
				{
					messageId: "redundantNestedBlock",
					type: "BlockStatement",
					line: 3,
				},
			],
		},
		{
			code: `
              class C {
                static {
                  if (foo) {
                    {
                        let block;
                    }
                  }
                }
              }
            `,
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "redundantNestedBlock",
					type: "BlockStatement",
					line: 5,
				},
			],
		},
		{
			code: `
              class C {
                static {
                  if (foo) {
                    {
                        block;
                    }
                    something;
                  }
                }
              }
            `,
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "redundantNestedBlock",
					type: "BlockStatement",
					line: 5,
				},
			],
		},
		{
			code: `
              class C {
                static {
                  {
                    block;
                  }
                }
              }
            `,
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "redundantNestedBlock",
					type: "BlockStatement",
					line: 4,
				},
			],
		},
		{
			code: `
              class C {
                static {
                  {
                    let block;
                  }
                }
              }
            `,
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "redundantNestedBlock",
					type: "BlockStatement",
					line: 4,
				},
			],
		},
		{
			code: `
              class C {
                static {
                  {
                    const block = 1;
                  }
                }
              }
            `,
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "redundantNestedBlock",
					type: "BlockStatement",
					line: 4,
				},
			],
		},
		{
			code: `
              class C {
                static {
                  {
                    function block() {}
                  }
                }
              }
            `,
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "redundantNestedBlock",
					type: "BlockStatement",
					line: 4,
				},
			],
		},
		{
			code: `
              class C {
                static {
                  {
                    class block {}
                  }
                }
              }
            `,
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "redundantNestedBlock",
					type: "BlockStatement",
					line: 4,
				},
			],
		},
		{
			code: `
              class C {
                static {
                  {
                    var block;
                  }
                  something;
                }
              }
            `,
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "redundantNestedBlock",
					type: "BlockStatement",
					line: 4,
				},
			],
		},
		{
			code: `
              class C {
                static {
                  something;
                  {
                    var block;
                  }
                }
              }
            `,
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "redundantNestedBlock",
					type: "BlockStatement",
					line: 5,
				},
			],
		},
		{
			code: `
              class C {
                static {
                  {
                    block;
                  }
                  something;
                }
              }
            `,
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "redundantNestedBlock",
					type: "BlockStatement",
					line: 4,
				},
			],
		},
		{
			code: `
              class C {
                static {
                  something;
                  {
                    block;
                  }
                }
              }
            `,
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "redundantNestedBlock",
					type: "BlockStatement",
					line: 5,
				},
			],
		},
	],
});
