#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import capitalizecamelCaseprojectName from '../lib/main';

const app = new App();

new capitalizecamelCaseprojectName(app, 'capitalizecamelCaseprojectName', {
	env: {
		region: process.env.CDK_DEFAULT_REGION,
		account: process.env.CDK_DEFAULT_ACCOUNT,
	},
});
