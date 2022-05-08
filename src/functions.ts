import { Signale } from 'signale';
import fs from 'fs';
import { execSync } from 'child_process';
import { dependenciesList, devDependenciesList } from './dependencies';
import { editorConfig, eslintignore, eslintrc, gitignore, prettier, tsconfig, indexHtml, cdkJson, cdkBin, cdkLib } from './files';

const install = (packageManager: packageManager, type: projectType, dev: boolean) => {
	const command = packageManager === 'yarn' ? 'add' : 'install';
	const libs = dev ? devDependenciesList[type] : dependenciesList[type];

	if (libs) {
		return `${packageManager} ${command}${dev ? ' -D ' : ' '}${libs}`;
	}

	return null;
};

export const safe = (projectName: string) => {
	return projectName.toLowerCase().replace(/ /g, '-');
};

export const camelCase = (projectName: string) => {
	return projectName.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};

export const capitalize = (projectName: string) => {
	return projectName.charAt(0).toUpperCase() + projectName.slice(1);
};

export const createDir = (dirName: string) => {
	const folderSignale = new Signale({ interactive: true });
	folderSignale.pending('Creating folder');

	fs.mkdirSync(safe(dirName));

	folderSignale.success('Creating folder \n');
};

export const initProject = (projectName: string, packageManager: packageManager) => {
	const projectSignale = new Signale({ interactive: true });
	projectSignale.pending('Starting project');

	execSync('git init', { cwd: safe(projectName) });
	execSync(`${packageManager} init ${packageManager !== 'pnpm' ? '-y' : ''}`, { cwd: safe(projectName) });

	projectSignale.success('Starting project \n');
};

export const installDependencies = (projectName: string, projectType: projectType, packageManager: packageManager) => {
	const dependenciesSignale = new Signale({ interactive: true });
	dependenciesSignale.pending('Installing dependencies');

	const devDependencies = install(packageManager, projectType, true);
	const dependencies = install(packageManager, projectType, false);

	if (devDependencies) execSync(devDependencies, { cwd: safe(projectName) });
	if (dependencies) execSync(dependencies, { cwd: safe(projectName) });

	dependenciesSignale.success('Dependencies installed successfully \n');
};

export const createFiles = (projectName: string, projectType: projectType) => {
	const filesSignale = new Signale({ interactive: true });
	filesSignale.pending('Creating files');

	fs.writeFileSync(`${safe(projectName)}/.editorconfig`, editorConfig, { encoding: 'utf-8' });
	fs.writeFileSync(`${safe(projectName)}/.eslintignore`, eslintignore, { encoding: 'utf-8' });
	fs.writeFileSync(`${safe(projectName)}/.eslintrc`, eslintrc, { encoding: 'utf-8' });
	fs.writeFileSync(`${safe(projectName)}/.gitignore`, gitignore, { encoding: 'utf-8' });
	fs.writeFileSync(`${safe(projectName)}/prettier.config.js`, prettier, { encoding: 'utf-8' });
	fs.writeFileSync(`${safe(projectName)}/tsconfig.json`, tsconfig, { encoding: 'utf-8' });

	if (['basic', 'web', 'cli'].includes(projectType)) {
		fs.mkdirSync(`${safe(projectName)}/src`);
		fs.writeFileSync(`${safe(projectName)}/src/index.ts`, '', { encoding: 'utf-8' });
	}

	if (projectType === 'web') {
		fs.writeFileSync(`${safe(projectName)}/src/index.html`, indexHtml(projectName), { encoding: 'utf-8' });
	}

	if (projectType === 'cdk') {
		fs.mkdirSync(`${safe(projectName)}/bin`);
		fs.mkdirSync(`${safe(projectName)}/lib`);
		fs.writeFileSync(`${safe(projectName)}/cdk.json`, cdkJson(projectName), { encoding: 'utf-8' });
		fs.writeFileSync(`${safe(projectName)}/bin/${safe(projectName)}.ts`, cdkBin(projectName), { encoding: 'utf-8' });
		fs.writeFileSync(`${safe(projectName)}/lib/main.ts`, cdkLib(projectName), { encoding: 'utf-8' });
	}

	fs.mkdirSync(`${safe(projectName)}/@types`);
	fs.writeFileSync(`${safe(projectName)}/@types/index.d.ts`, '', { encoding: 'utf-8' });

	filesSignale.success('Creating files \n');
};

export const postInstall = (projectName: string) => {
	execSync('git add .', { cwd: safe(projectName) });
	execSync('git commit -m "First commit"', { cwd: safe(projectName) });
};
