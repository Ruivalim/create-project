import { Signale } from 'signale';
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { dependenciesList, devDependenciesList } from './dependencies';

const getDevelopmentSetting = (packageManger: packageManager): string => {
	if (packageManger === 'bun') {
		return '-d';
	}

	return '-D';
};

const install = (packageManager: packageManager, type: projectType, dev: boolean) => {
	const command = ['yarn', 'bun'].includes(packageManager) ? 'add' : 'install';
	const developmentSetting = dev ? getDevelopmentSetting(packageManager) : '';
	const libs = dev ? devDependenciesList[type] : dependenciesList[type];

	if (libs) {
		return `${packageManager} ${command} ${developmentSetting} ${libs}`;
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

const samplesWalker = (dir: string, projectName: string) => {
	const folder = fs.readdirSync(dir);
	folder.forEach(item => {
		const itemPath = path.join(dir, item);
		const stat = fs.statSync(itemPath);
		if (stat.isDirectory()) {
			samplesWalker(itemPath, projectName);
		} else {
			const fileData = fs
				.readFileSync(itemPath, 'utf-8')
				.replace(/nosafeprojectName/g, projectName)
				.replace(/safeprojectName/g, safe(projectName))
				.replace(/capitalizecamelCaseprojectName/g, capitalize(camelCase(projectName)));

			const copyTo = path.join(process.cwd(), projectName, itemPath.replace(path.join(__dirname, '..'), '').split('/').splice(3).join('/'));

			const fullDirPath = copyTo
				.split('/')
				.splice(0, copyTo.split('/').length - 1)
				.join('/');

			if (!fs.existsSync(fullDirPath)) {
				fs.mkdirSync(fullDirPath, { recursive: true });
			}

			fs.writeFileSync(copyTo.replace('projectName', safe(projectName)), fileData);
		}
	});
};

export const moveSamples = (projectName: string, projectType: projectType) => {
	const filesSignale = new Signale({ interactive: true });
	filesSignale.pending('Creating files');

	const samplesPath = path.join(__dirname, '..', `./samples/${projectType}`);
	samplesWalker(path.join(__dirname, '..', './samples/common'), projectName);
	if (fs.existsSync(samplesPath)) {
		samplesWalker(samplesPath, projectName);
	}

	filesSignale.success('Creating files \n');
};

export const postInstall = (projectName: string) => {
	execSync('git add .', { cwd: safe(projectName) });
	execSync('git commit -m "First commit"', { cwd: safe(projectName) });
};
