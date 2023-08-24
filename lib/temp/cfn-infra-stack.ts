import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";


export class CfnInfraStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);


        // Create VPC
        const vpc = new ec2.CfnVPC(this, "cdk-ts-vpc", {
            cidrBlock: "10.0.0.0/16",
        });

        // Internet Gateway
        const igw = new ec2.CfnInternetGateway(this, "cdk-ts-igw");

        // Attach Internet Gateway to VPC
        const vpcigw = new ec2.CfnVPCGatewayAttachment(this, "cdk-ts-vpcigw", {
            vpcId: vpc.ref,
            internetGatewayId: igw.ref,
        });

        // Create Public Subnet
        const publicsubnet = new ec2.CfnSubnet(this, "cdk-ts-publicsubnet", {
            cidrBlock: "10.0.0.0/18",
            vpcId: vpc.ref,
            availabilityZone: "ap-southeast-1a",
            mapPublicIpOnLaunch: true,
            tags: [{ key: "Type", value: "Public" }],
        });

        // Create Private Subnet
        const privatesubnet = new ec2.CfnSubnet(this, "cdk-ts-privatesubnet", {
            cidrBlock: "10.0.64.0/18",
            vpcId: vpc.ref,
            availabilityZone: "ap-southeast-1a",
            mapPublicIpOnLaunch: false,
            tags: [{ key: "Type", value: "Private" }],
        });

        // Create Public Route Table
        const publicroutetable = new ec2.CfnRouteTable(this, "cdk-ts-publicroutetable", {
            vpcId: vpc.ref,
            tags: [{ key: "Type", value: "Public" }],
        });

        // Create Private Route Table
        const privateroutetable = new ec2.CfnRouteTable(this, "cdk-ts-privateroutetable", {
            vpcId: vpc.ref,
            tags: [{ key: "Type", value: "Private" }],
        });

        // Create Public Route
        const publicroute = new ec2.CfnRoute(this, "cdk-ts-publicroute", {
            routeTableId: publicroutetable.ref,
            destinationCidrBlock: "0.0.0.0/0",
            gatewayId: igw.ref,
        });

        // Associate Public Subnet with Public Route Table
        const publicsubnetroutetableassociation = new ec2.CfnSubnetRouteTableAssociation(this, "cdk-ts-publicsubnetroutetableassociation", {
            subnetId: publicsubnet.ref,
            routeTableId: publicroutetable.ref,
        });

        // Associate Private Subnet with Private Route Table
        const privatesubnetroutetableassociation = new ec2.CfnSubnetRouteTableAssociation(this, "cdk-ts-privatesubnetroutetableassociation", {
            subnetId: privatesubnet.ref,
            routeTableId: privateroutetable.ref,
        });

        // Create Security Group
        const securitygroup = new ec2.CfnSecurityGroup(this, "cdk-ts-securitygroup", {
            vpcId: vpc.ref,
            groupDescription: "Allow all traffic",
            securityGroupIngress: [
                {
                    cidrIp: "0.0.0.0/0",
                    ipProtocol: "tcp",
                    fromPort: 0,
                    toPort: 65535,
                },
            ],
            securityGroupEgress: [
                {
                    cidrIp: "0.0.0.0/0",
                    ipProtocol: "tcp",
                    fromPort: 0,
                    toPort: 65535,
                },
            ],
        });

        // Create EC2 Instance
        const ec2instance = new ec2.CfnInstance(this, "cdk-ts-ec2instance", {
            imageId: new ec2.AmazonLinuxImage().getImage(this).imageId,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.MICRO).toString(),
            subnetId: publicsubnet.ref,
            securityGroupIds: [securitygroup.ref],
            tags: [{ key: "Name", value: "cdk-ts-ec2instance" }],
        });

        // Create EIP
        const eip = new ec2.CfnEIP(this, "cdk-ts-eip", {
            domain: "vpc",
        });

        // Create NAT Gateway
        const natgateway = new ec2.CfnNatGateway(this, "cdk-ts-natgateway", {
            allocationId: eip.attrAllocationId,
            subnetId: publicsubnet.ref,
        });

        // Create Private Route
        const privateroute = new ec2.CfnRoute(this, "cdk-ts-privateroute", {
            routeTableId: privateroutetable.ref,
            destinationCidrBlock: "0.0.0.0/0",
            natGatewayId: natgateway.ref,
        });

        // Create ACL
        const acl = new ec2.CfnNetworkAcl(this, "cdk-ts-acl", {
            vpcId: vpc.ref,
            tags: [{ key: "Name", value: "cdk-ts-acl" }],
        });

        // Create ACL Entry
        const aclentry = new ec2.CfnNetworkAclEntry(this, "cdk-ts-aclentry", {
            networkAclId: acl.ref,
            ruleNumber: 100,
            protocol: -1,
            ruleAction: "allow",
            egress: true,
            cidrBlock: "0.0.0.0/0",
        });

        // Associate ACL with Public Subnet
        const publicsubnetnetworkaclassociation = new ec2.CfnSubnetNetworkAclAssociation(this, "cdk-ts-publicsubnetnetworkaclassociation", {
            subnetId: publicsubnet.ref,
            networkAclId: acl.ref,
        });

        // Associate ACL with Private Subnet
        const privatesubnetnetworkaclassociation = new ec2.CfnSubnetNetworkAclAssociation(this, "cdk-ts-privatesubnetnetworkaclassociation", {
            subnetId: privatesubnet.ref,
            networkAclId: acl.ref,
        });




        

    }
}

