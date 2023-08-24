import * as cdk from "aws-cdk-lib";
import { Stack, StackProps, Construct } from "aws-cdk-lib";
import {
  Vpc,
  SubnetType,
  GatewayVpcEndpointAwsService,
  Port,
  SecurityGroup,
  Peer,
} from "aws-cdk-lib/aws-ec2";

class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create VPC
    const vpc = new Vpc(this, "MyVPC", {
      cidr: "10.0.0.0/16",
      maxAzs: 2,
      subnetConfiguration: [
        { subnetType: SubnetType.PUBLIC, name: "Public1A", cidrMask: 24 },
        { subnetType: SubnetType.PRIVATE, name: "Private1A", cidrMask: 24 },
        { subnetType: SubnetType.PUBLIC, name: "Public1B", cidrMask: 24 },
        { subnetType: SubnetType.PRIVATE, name: "Private1B", cidrMask: 24 },
      ],
    });

    // Create Internet Gateway and attach it to VPC
    const internetGateway = vpc.addGatewayEndpoint("InternetGateway", {
      service: GatewayVpcEndpointAwsService.S3,
    });

    // Create NAT Gateway in the public subnets
    vpc.addNatGateway({
      subnetSelection: { subnetType: SubnetType.PUBLIC },
    });

    // Create security groups
    const publicSecurityGroup = new SecurityGroup(this, "PublicSecurityGroup", {
      vpc,
    });

    const privateSecurityGroup = new SecurityGroup(
      this,
      "PrivateSecurityGroup",
      {
        vpc,
      }
    );

    // Define inbound/outbound rules for security groups
    privateSecurityGroup.addIngressRule(
      publicSecurityGroup,
      Port.allTcp(),
      "Allow from Public Subnet"
    );
    privateSecurityGroup.addEgressRule(
      publicSecurityGroup,
      Port.allTcp(),
      "Allow to Public Subnet"
    );

    // Deploy EC2 instances
    const instanceCount = 4;

    // Public subnet instances
    for (let i = 1; i <= instanceCount; i++) {
      new ec2.Instance(this, `PublicInstance${i}`, {
        vpc,
        vpcSubnets: { subnetType: SubnetType.PUBLIC },
        securityGroup: publicSecurityGroup,
        instanceType: new ec2.InstanceType("t2.micro"),
        machineImage: new ec2.AmazonLinuxImage(),
        keyName: "my-key-pair", // Replace with your own key pair
      });
    }

    // Private subnet instances
    for (let i = 1; i <= instanceCount; i++) {
      new ec2.Instance(this, `PrivateInstance${i}`, {
        vpc,
        vpcSubnets: { subnetType: SubnetType.PRIVATE },
        securityGroup: privateSecurityGroup,
        instanceType: new ec2.InstanceType("t2.micro"),
        machineImage: new ec2.AmazonLinuxImage(),
        keyName: "my-key-pair", // Replace with your own key pair
      });
    }
  }
}

const app = new cdk.App();
new MyStack(app, "MyStack");
app.synth();
