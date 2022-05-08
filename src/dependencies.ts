export const devDependenciesList: Record<projectType, string> = {
	basic: '@types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-airbnb-base eslint-config-prettier eslint-import-resolver-typescript eslint-plugin-import eslint-plugin-prettier prettier ts-node ts-node-dev tsconfig-paths tscpaths typescript',
	web: '@types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-airbnb-base eslint-config-prettier eslint-import-resolver-typescript eslint-plugin-import eslint-plugin-prettier prettier ts-node ts-node-dev tsconfig-paths tscpaths typescript parcel',
	cli: '@types/node @types/prompts @types/signale @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-airbnb-base eslint-config-prettier eslint-import-resolver-typescript eslint-plugin-import eslint-plugin-prettier prettier ts-node ts-node-dev tsconfig-paths tscpaths typescript',
	cdk: '@aws-cdk/assert @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-airbnb-base eslint-config-prettier eslint-import-resolver-typescript eslint-plugin-import eslint-plugin-prettier prettier ts-node ts-node-dev tsconfig-paths tscpaths typescript',
};

export const dependenciesList: Record<projectType, string | null> = {
	basic: null,
	web: null,
	cli: 'prompts',
	cdk: 'aws-cdk-lib constructs aws-sdk base-64 esbuild esbuild-runner source-map-support',
};
