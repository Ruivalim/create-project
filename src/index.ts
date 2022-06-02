#!/usr/bin/env node

import prompts from 'prompts';
import fs from 'fs';
import { createDir, initProject, installDependencies, moveSamples, postInstall } from './functions';

(async () => {
	const response = await prompts([
		{
			type: 'text',
			name: 'projectName',
			message: 'What is the name of the project?',
			validate: value => (fs.existsSync(value) ? 'This folder is already been used' : true),
		},
		{
			type: 'select',
			name: 'projectType',
			message: 'Type of project:',
			choices: [
				{ title: 'Basic', description: 'Only basic typescript configuration', value: 'basic' },
				{ title: 'WebProject', description: 'Basic typescript configuration with extra libs for web development', value: 'web' },
				{ title: 'CLI', description: 'Basic typescript configuration with extra libs for CLI application', value: 'cli' },
				{ title: 'CDK', description: 'Basic typescript configuration with extra libs for CDK', value: 'cdk' },
			],
		},
		{
			type: 'select',
			name: 'packageManager',
			message: 'Package Manager:',
			choices: [
				{ title: 'pnpm', value: 'pnpm' },
				{ title: 'npm', value: 'npm' },
				{ title: 'yarn', value: 'yarn' },
			],
		},
	]);

	createDir(response.projectName);

	initProject(response.projectName, response.packageManager as packageManager);

	installDependencies(response.projectName, response.projectType, response.packageManager as packageManager);

	moveSamples(response.projectName, response.projectType);

	postInstall(response.projectName);
})();
