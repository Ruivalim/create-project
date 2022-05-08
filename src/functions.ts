import { Signale } from 'signale';
import fs from 'fs';
import { execSync } from 'child_process';
import { dependenciesList, devDependenciesList } from './dependencies';
import { editorConfig, eslintignore, eslintrc, gitignore, prettier, tsconfig, indexHtml } from './files';

const install = (packageManager: packageManager, type: projectType, dev: boolean) => {
	const command = packageManager === 'yarn' ? 'add' : 'install';
	const libs = dev ? devDependenciesList[type] : dependenciesList[type];

	if (libs) {
		return `${packageManager} ${command}${dev ? ' -D ' : ' '}${libs}`;
	}

	return null;
};

export const createDir = (dirName: string) => {
	const folderSignale = new Signale({ interactive: true });
	folderSignale.pending('Creating folder');

	fs.mkdirSync(dirName);

	folderSignale.success('Creating folder \n');
};

export const initProject = (projectName: string, packageManager: packageManager) => {
	const projectSignale = new Signale({ interactive: true });
	projectSignale.pending('Starting project');

	execSync('git init', { cwd: projectName });
	execSync(`${packageManager} init ${packageManager !== 'pnpm' ? '-y' : ''}`, { cwd: projectName });

	projectSignale.success('Starting project \n');
};

export const installDependencies = (projectName: string, projectType: projectType, packageManager: packageManager) => {
	const dependenciesSignale = new Signale({ interactive: true });
	dependenciesSignale.pending('Installing dependencies');

	const devDependencies = install(packageManager, projectType, true);
	const dependencies = install(packageManager, projectType, false);

	if (devDependencies) execSync(devDependencies, { cwd: projectName });
	if (dependencies) execSync(dependencies, { cwd: projectName });

	dependenciesSignale.success('Dependencies installed successfully \n');
};

export const createFiles = (projectName: string, projectType: projectType) => {
	const filesSignale = new Signale({ interactive: true });
	filesSignale.pending('Creating files');

	fs.writeFileSync(`${projectName}/.editorconfig`, editorConfig, { encoding: 'utf-8' });
	fs.writeFileSync(`${projectName}/.eslintignore`, eslintignore, { encoding: 'utf-8' });
	fs.writeFileSync(`${projectName}/.eslintrc`, eslintrc, { encoding: 'utf-8' });
	fs.writeFileSync(`${projectName}/.gitignore`, gitignore, { encoding: 'utf-8' });
	fs.writeFileSync(`${projectName}/prettier.config.js`, prettier, { encoding: 'utf-8' });
	fs.writeFileSync(`${projectName}/tsconfig.json`, tsconfig, { encoding: 'utf-8' });

	fs.mkdirSync(`${projectName}/src`);
	fs.writeFileSync(`${projectName}/src/index.ts`, '', { encoding: 'utf-8' });

	if (projectType === 'web') {
		fs.writeFileSync(`${projectName}/src/index.html`, indexHtml, { encoding: 'utf-8' });
	}

	fs.mkdirSync(`${projectName}/@types`);
	fs.writeFileSync(`${projectName}/@types/index.d.ts`, '', { encoding: 'utf-8' });

	filesSignale.success('Creating files \n');
};
