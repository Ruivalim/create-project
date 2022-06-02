import { RemovalPolicy } from 'aws-cdk-lib';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { CfnClientVpnEndpoint, CfnClientVpnTargetNetworkAssociation, CfnClientVpnAuthorizationRule, CfnClientVpnRoute, Vpc, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct, IDependable } from 'constructs';

interface VPNProps {
	vpc?: Vpc;
	clientCertArn: string;
	serverCertArn: string;
	vpnName: string;
}

export default class Vpn extends Construct {
	constructor(scope: Construct, id: string, props: VPNProps) {
		super(scope, id);

		const vpc =
			props.vpc ??
			new Vpc(this, 'ClientVpnVPC', {
				vpcName: `${props.vpnName}-VPC`,
				maxAzs: 3,
				subnetConfiguration: [
					{
						subnetType: SubnetType.PUBLIC,
						name: 'Public',
					},
					{
						subnetType: SubnetType.PRIVATE_WITH_NAT,
						name: 'Private',
					},
				],
			});

		const clientCert = Certificate.fromCertificateArn(this, 'ClientCertificate', props.clientCertArn);
		const serverCert = Certificate.fromCertificateArn(this, 'ServerCertificate', props.serverCertArn);

		const logGroup = new LogGroup(this, 'ClientVpnLogGroup', {
			retention: RetentionDays.ONE_MONTH,
			removalPolicy: RemovalPolicy.DESTROY,
		});

		const logStream = logGroup.addStream('ClientVpnLogStream');

		const endpoint = new CfnClientVpnEndpoint(this, 'ClientVpnEndpoint', {
			description: 'VPN',
			authenticationOptions: [
				{
					type: 'certificate-authentication',
					mutualAuthentication: {
						clientRootCertificateChainArn: clientCert.certificateArn,
					},
				},
			],
			tagSpecifications: [
				{
					resourceType: 'client-vpn-endpoint',
					tags: [
						{
							key: 'Name',
							value: props.vpnName,
						},
					],
				},
			],
			clientCidrBlock: '10.1.132.0/22',
			connectionLogOptions: {
				enabled: true,
				cloudwatchLogGroup: logGroup.logGroupName,
				cloudwatchLogStream: logStream.logStreamName,
			},
			serverCertificateArn: serverCert.certificateArn,
			splitTunnel: false,
			dnsServers: ['8.8.8.8', '8.8.4.4'],
		});

		const dependencies: IDependable[] = [];
		vpc.privateSubnets.forEach((subnet, index) => {
			const networkAsc = new CfnClientVpnTargetNetworkAssociation(this, `ClientVpnNetworkAssociation-${index}`, {
				clientVpnEndpointId: endpoint.ref,
				subnetId: subnet.subnetId,
			});
			dependencies.push(networkAsc);
		});

		new CfnClientVpnAuthorizationRule(this, 'ClientVpnAuthRule', {
			clientVpnEndpointId: endpoint.ref,
			targetNetworkCidr: '0.0.0.0/0',
			authorizeAllGroups: true,
			description: 'Allow all',
		});

		vpc.privateSubnets.forEach((subnet, index) => {
			new CfnClientVpnRoute(this, `CfnClientVpnRoute-${index}`, {
				clientVpnEndpointId: endpoint.ref,
				destinationCidrBlock: '0.0.0.0/0',
				description: 'Route to all',
				targetVpcSubnetId: vpc.privateSubnets[index].subnetId,
			}).node.addDependency(...dependencies);
		});
	}
}
