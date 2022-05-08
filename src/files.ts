export const editorConfig = `root = true

[*]
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[**.ts]
indent_style = tab
indent_size = 4
insert_final_newline = true
max_line_length = 200

[configure]
indent_style = space
indent_size = 2
`;

export const eslintignore = `.idea/
.vscode/
.history/
target/
node_modules/
app/templates/assets/js/qrcode.js
`;

export const eslintrc = JSON.stringify(
	{
		env: {
			es6: true,
			node: true,
		},
		extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
		globals: {
			Atomics: 'readonly',
			SharedArrayBuffer: 'readonly',
		},
		parser: '@typescript-eslint/parser',
		parserOptions: {
			ecmaVersion: 2018,
			sourceType: 'module',
		},
		plugins: ['@typescript-eslint', 'prettier'],
		rules: {
			'no-template-curly-in-string': 'off',
			'no-bitwise': 'off',
			'@typescript-eslint/no-shadow': 'off',
			'no-constant-condition': 'off',
			'import/prefer-default-export': 'off',
			'no-restricted-syntax': 'off',
			'no-return-assign': 'off',
			'no-param-reassign': 'off',
			'no-new': 'off',
			'no-console': 'off',
			'no-continue': 'off',
			camelcase: 'off',
			'prettier/prettier': 'error',
			'new-cap': 'off',
			'no-await-in-loop': 'off',
			'no-plusplus': 'off',
			'no-shadow': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'consistent-return': 'off',
			'import/extensions': [
				'error',
				'ignorePackages',
				{
					ts: 'never',
				},
			],
		},
		settings: {
			'import/resolver': {
				typescript: {},
			},
		},
	},
	null,
	'\t',
);

export const gitignore = `node_modules
dist
`;

export const prettier = `export const singleQuote: boolean;
export export const trailingComma: string;
export export const arrowParens: string;
export export const printWidth: number;
export export const useTabs: boolean;
export export const tabWidth: number;
`;

export const tsconfig = JSON.stringify(
	{
		'ts-node': {
			files: true,
			typeRoots: ['./node_modules/@types', './types'],
		},
		compilerOptions: {
			target: 'ES2018',
			module: 'commonjs',
			lib: ['es2020', 'dom'],
			declaration: true,
			strict: true,
			noImplicitAny: true,
			strictNullChecks: true,
			noImplicitThis: true,
			alwaysStrict: true,
			noUnusedLocals: false,
			noUnusedParameters: false,
			noImplicitReturns: true,
			noFallthroughCasesInSwitch: false,
			inlineSourceMap: true,
			inlineSources: true,
			experimentalDecorators: true,
			strictPropertyInitialization: false,
			typeRoots: ['./node_modules/@types', './types'],
			esModuleInterop: true,
			allowJs: true,
			checkJs: false,
			skipLibCheck: true,
			resolveJsonModule: true,
			baseUrl: '.',
			outDir: 'dist',
			paths: {},
		},
		exclude: ['cdk.out', 'views', './node_modules/*'],
	},
	null,
	'\t',
);

export const indexHtml = `<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Project</title>
</head>

<body>
    <script type="module" src="index.ts"></script>
</body>

</html>
`;
