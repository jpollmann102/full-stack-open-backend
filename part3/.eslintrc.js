module.exports = {
	'env': {
		'node': true,
		'commonjs': true,
		'es2021': true
	},
	'ignorePatterns': ['/build'],
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 12
	},
	'rules': {
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		]
	}
};
