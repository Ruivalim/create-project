import { safe, camelCase, capitalize } from './functions';

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
.DS_Store
.cdk.staging
cdk.out
`;

export const prettier = `module.exports = {
    singleQuote: true,
    trailingComma: 'all',
    arrowParens: 'avoid',
    printWidth: 160
}
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

export const indexHtml = (projectName: string) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
</head>
<body>
	<script type="module" src="index.ts"></script>
</body>
</html>
`;

export const cdkJson = (projectName: string) => `{
    "app": "npx ts-node --prefer-ts-exts bin/${safe(projectName)}.ts",
    "context": {
        "@aws-cdk/aws-apigateway:usagePlanKeyOrderInsensitiveId": false,
        "@aws-cdk/aws-cloudfront:defaultSecurityPolicyTLSv1.2_2021": true,
        "@aws-cdk/aws-rds:lowercaseDbIdentifier": false,
        "@aws-cdk/core:stackRelativeExports": false
    }
}
`;

export const cdkBin = (projectName: string) => `#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import ${capitalize(camelCase(projectName))} from '../lib/main';

const app = new App();

new ${capitalize(camelCase(projectName))}(app, '${capitalize(camelCase(projectName))}', {
	env: {
		region: process.env.CDK_DEFAULT_REGION,
		account: process.env.CDK_DEFAULT_ACCOUNT,
	},
});
`;

export const cdkLib = (projectName: string) => `import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export default class ${capitalize(camelCase(projectName))} extends Stack {
	constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props);

	}
}
`;
