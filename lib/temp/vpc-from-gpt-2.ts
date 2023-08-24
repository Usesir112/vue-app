import * as cdk from "aws-cdk-lib";
import { Stack, StackProps, Construct } from "aws-cdk-lib";
import {
  Vpc,
  SubnetType,
  GatewayVpcEndpointAwsService,
  Port,
  SecurityGroup,
  Peer,
  NetworkAcl,
  Subnet,
  GatewayVpcEndpoint,
  CfnRouteTable,
  CfnSubnetNetworkAclAssociation,
  CfnSubnetRouteTableAssociation,
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

    // Create Network ACL
    const privateNetworkAcl = new NetworkAcl(this, "PrivateNetworkAcl", {
      vpc,
    });

    // Create inbound/outbound rules for the Network ACL
    privateNetworkAcl.addEntry("PrivateOutboundRule", {
      ruleNumber: 100,
      traffic: {
        direction: Peer.anyIpv4(),
        protocol: Port.allTraffic(),
      },
      ruleAction: "ALLOW",
      cidr: "0.0.0.0/0",
      ruleDescription: "Allow all outbound traffic",
    });

    privateNetworkAcl.addEntry("PrivateInboundRule", {
      ruleNumber: 100,
      traffic: {
        direction: Peer.ipv4("10.0.0.0/16"),
        protocol: Port.allTraffic(),
      },
      ruleAction: "ALLOW",
      cidr: "0.0.0.0/0",
      ruleDescription: "Allow inbound traffic from VPC",
    });

    // Associate Network ACL with Private subnets
    for (const subnet of vpc.privateSubnets) {
      new CfnSubnetNetworkAclAssociation(
        this,
        `PrivateSubnetAclAssociation${subnet.node.addr}`,
        {
          subnetId: subnet.subnetId,
          networkAclId: privateNetworkAcl.networkAclId,
        }
      );
    }

    // Create private route table
    const privateRouteTable = new CfnRouteTable(this, "PrivateRouteTable", {
      vpcId: vpc.vpcId,
    });

    // Create route in private route table for Internet Gateway
    new CfnRoute(this, "PrivateRoute", {
      routeTableId: privateRouteTable.ref,
      destinationCidrBlock: "0.0.0.0/0",
      gatewayId: internetGateway.gatewayId,
    });

    // Associate private route table with Private subnets
    for (const subnet of vpc.privateSubnets) {
      new CfnSubnetRouteTableAssociation(
        this,
        `PrivateSubnetRouteTableAssociation${subnet.node.addr}`,
        {
          subnetId: subnet.subnetId,
          routeTableId: privateRouteTable.ref,
        }
      );
    }
  }
}

const app = new cdk.App();
new MyStack(app, "MyStack");
app.synth();
