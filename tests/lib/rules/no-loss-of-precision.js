/**
 *@fileoverview Tests for no-loss-of-precision rule.
 *@author Jacob Moore
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-loss-of-precision"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 5,
		sourceType: "script",
	},
});

ruleTester.run("no-loss-of-precision", rule, {
	valid: [
		"var x = 12345",
		"var x = 123.456",
		"var x = -123.456",
		"var x = -123456",
		"var x = 123e34",
		"var x = 123.0e34",
		"var x = 123e-34",
		"var x = -123e34",
		"var x = -123e-34",
		"var x = 12.3e34",
		"var x = 12.3e-34",
		"var x = -12.3e34",
		"var x = -12.3e-34",
		"var x = 12300000000000000000000000",
		"var x = -12300000000000000000000000",
		"var x = 0.00000000000000000000000123",
		"var x = -0.00000000000000000000000123",
		"var x = 9007199254740991",
		"var x = 0",
		"var x = 0.0",
		"var x = 0.000000000000000000000000000000000000000000000000000000000000000000000000000000",
		"var x = -0",
		"var x = 123.0000000000000000000000",
		"var x = 019.5",
		"var x = 0195",
		"var x = 0e5",

		{ code: "var x = 12_34_56", languageOptions: { ecmaVersion: 2021 } },
		{ code: "var x = 12_3.4_56", languageOptions: { ecmaVersion: 2021 } },
		{ code: "var x = -12_3.4_56", languageOptions: { ecmaVersion: 2021 } },
		{ code: "var x = -12_34_56", languageOptions: { ecmaVersion: 2021 } },
		{ code: "var x = 12_3e3_4", languageOptions: { ecmaVersion: 2021 } },
		{ code: "var x = 123.0e3_4", languageOptions: { ecmaVersion: 2021 } },
		{ code: "var x = 12_3e-3_4", languageOptions: { ecmaVersion: 2021 } },
		{ code: "var x = 12_3.0e-3_4", languageOptions: { ecmaVersion: 2021 } },
		{ code: "var x = -1_23e-3_4", languageOptions: { ecmaVersion: 2021 } },
		{
			code: "var x = -1_23.8e-3_4",
			languageOptions: { ecmaVersion: 2021 },
		},
		{
			code: "var x = 1_230000000_00000000_00000_000",
			languageOptions: { ecmaVersion: 2021 },
		},
		{
			code: "var x = -1_230000000_00000000_00000_000",
			languageOptions: { ecmaVersion: 2021 },
		},
		{
			code: "var x = 0.0_00_000000000_000000000_00123",
			languageOptions: { ecmaVersion: 2021 },
		},
		{
			code: "var x = -0.0_00_000000000_000000000_00123",
			languageOptions: { ecmaVersion: 2021 },
		},
		{ code: "var x = 0e5_3", languageOptions: { ecmaVersion: 2021 } },

		{
			code: "var x = 0b11111111111111111111111111111111111111111111111111111",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 0b111_111_111_111_1111_11111_111_11111_1111111111_11111111_111_111",
			languageOptions: { ecmaVersion: 2021 },
		},

		{
			code: "var x = 0B11111111111111111111111111111111111111111111111111111",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 0B111_111_111_111_1111_11111_111_11111_1111111111_11111111_111_111",
			languageOptions: { ecmaVersion: 2021 },
		},

		{
			code: "var x = 0o377777777777777777",
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var x = 0o3_77_777_777_777_777_777",
			languageOptions: { ecmaVersion: 2021 },
		},
		{
			code: "var x = 0O377777777777777777",
			languageOptions: { ecmaVersion: 6 },
		},

		"var x = 0377777777777777777",
		"var x = 0x1FFFFFFFFFFFFF",
		"var x = 0X1FFFFFFFFFFFFF",
		"var x = true",
		"var x = 'abc'",
		"var x = ''",
		"var x = null",
		"var x = undefined",
		"var x = {}",
		"var x = ['a', 'b']",
		"var x = new Date()",
		"var x = '9007199254740993'",

		{
			code: "var x = 0x1FFF_FFFF_FFF_FFF",
			languageOptions: { ecmaVersion: 2021 },
		},
		{
			code: "var x = 0X1_FFF_FFFF_FFF_FFF",
			languageOptions: { ecmaVersion: 2021 },
		},
	],
	invalid: [
		{
			code: "var x = 9007199254740993",
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 9007199254740.993e3",
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 9.007199254740993e15",
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = -9007199254740993",
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 900719.9254740994",
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = -900719.9254740994",
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 900719925474099_3",
			languageOptions: { ecmaVersion: 2021 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 90_0719925_4740.9_93e3",
			languageOptions: { ecmaVersion: 2021 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 9.0_0719925_474099_3e15",
			languageOptions: { ecmaVersion: 2021 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = -9_00719_9254_740993",
			languageOptions: { ecmaVersion: 2021 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 900_719.92_54740_994",
			languageOptions: { ecmaVersion: 2021 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = -900_719.92_5474_0994",
			languageOptions: { ecmaVersion: 2021 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 5123000000000000000000000000001",
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = -5123000000000000000000000000001",
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 1230000000000000000000000.0",
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 1.0000000000000000000000123",
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 17498005798264095394980017816940970922825355447145699491406164851279623993595007385788105416184430592",
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 2e999",
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = .1230000000000000000000000",
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 0b100000000000000000000000000000000000000000000000000001",
			languageOptions: { ecmaVersion: 6 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 0B100000000000000000000000000000000000000000000000000001",
			languageOptions: { ecmaVersion: 6 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 0o400000000000000001",
			languageOptions: { ecmaVersion: 6 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 0O400000000000000001",
			languageOptions: { ecmaVersion: 6 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 0400000000000000001",
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 0x20000000000001",
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 0X20000000000001",
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 5123_00000000000000000000000000_1",
			languageOptions: { ecmaVersion: 2021 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = -5_12300000000000000000000_0000001",
			languageOptions: { ecmaVersion: 2021 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 123_00000000000000000000_00.0_0",
			languageOptions: { ecmaVersion: 2021 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 1.0_00000000000000000_0000123",
			languageOptions: { ecmaVersion: 2021 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 174_980057982_640953949800178169_409709228253554471456994_914061648512796239935950073857881054_1618443059_2",
			languageOptions: { ecmaVersion: 2021 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 2e9_99",
			languageOptions: { ecmaVersion: 2021 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = .1_23000000000000_00000_0000_0",
			languageOptions: { ecmaVersion: 2021 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 0b1_0000000000000000000000000000000000000000000000000000_1",
			languageOptions: { ecmaVersion: 2021 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 0B10000000000_0000000000000000000000000000_000000000000001",
			languageOptions: { ecmaVersion: 2021 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 0o4_00000000000000_001",
			languageOptions: { ecmaVersion: 2021 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 0O4_0000000000000000_1",
			languageOptions: { ecmaVersion: 2021 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 0x2_0000000000001",
			languageOptions: { ecmaVersion: 2021 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "var x = 0X200000_0000000_1",
			languageOptions: { ecmaVersion: 2021 },
			errors: [{ messageId: "noLossOfPrecision" }],
		},
	],
});

const ruleTesterTypeScript = new RuleTester({
	languageOptions: {
		parser: require("@typescript-eslint/parser"),
	},
});

ruleTesterTypeScript.run("no-loss-of-precision", rule, {
	valid: [
		"const x = 12345;",
		"const x = 123.456;",
		"const x = -123.456;",
		"const x = 123_456;",
		"const x = 123_00_000_000_000_000_000_000_000;",
		"const x = 123.000_000_000_000_000_000_000_0;",
	],
	invalid: [
		{
			code: "const x = 9007199254740993;",
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "const x = 9_007_199_254_740_993;",
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "const x = 9_007_199_254_740.993e3;",
			errors: [{ messageId: "noLossOfPrecision" }],
		},
		{
			code: "const x = 0b100_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_000_001;",
			errors: [{ messageId: "noLossOfPrecision" }],
		},
	],
});
