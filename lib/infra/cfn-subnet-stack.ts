import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as cdk from "aws-cdk-lib";

export class CfnSubnetStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    /**
     * Cidr Blocks
     */
    const public_1a_cidr = "10.0.0.0/18";
    const public_1b_cidr = "10.0.64.0/18";
    const private_1a_cidr = "10.0.128.0/18";
    const private_1b_cidr = "10.0.192.0/18";
    /**
     * Availability Zones
     */
    const availabilityZones = ["ap-southeast-1a", "ap-southeast-1b"];
    new cdk.CfnOutput(this, "Availability Zones", {
      value: availabilityZones.toString(),
      exportName: "AvailabilityZones",
    });
    /**
     * Subnets are created in the following order:
     * Note: To use for EKS Blueprint you MUST!
     *       1. In Public Subnet, add tag: { key: "kubernetes.io/role/elb", value: "1"}
     *       2. In Private Subnet, add tag: { key: "kubernetes.io/role/internal-elb", value: "1"}
     */
    // ====================================================================================================
    /**
     * Public-1A Configuration
     * mapPublicIpOnLaunch: true <- This is required to assign public IP to EC2 instance
     */
    const public_1a = new ec2.CfnSubnet(this, "Creating Public-1A", {
      cidrBlock: public_1a_cidr,
      vpcId: cdk.Fn.importValue("VPCID"),
      availabilityZone: availabilityZones[0],
      mapPublicIpOnLaunch: true,
      tags: [
        { key: "Type", value: "Public" },
        { key: "Name", value: "Public-1A" },
        { key: "kubernetes.io/role/elb", value: "1" },
      ],
    });
    new cdk.CfnOutput(this, "Public-1A-ID", {
      value: public_1a.ref,
      exportName: "Public-1A-ID",
    });
    // ====================================================================================================
    /**
     * Public-1B Configuration
     * mapPublicIpOnLaunch: true <- This is required to assign public IP to EC2 instance
     */
    const public_1b = new ec2.CfnSubnet(this, "Creating Public-1B", {
      cidrBlock: public_1b_cidr,
      vpcId: cdk.Fn.importValue("VPCID"),
      availabilityZone: availabilityZones[1],
      mapPublicIpOnLaunch: true,
      tags: [
        { key: "Type", value: "Public" },
        { key: "Name", value: "Public-1B" },
        { key: "kubernetes.io/role/elb", value: "1" },
      ],
    });
    new cdk.CfnOutput(this, "Public-1B-ID", {
      value: public_1b.ref,
      exportName: "Public-1B-ID",
    });
    // ====================================================================================================
    /**
     * Private-1A Configuration
     */
    const private_1a = new ec2.CfnSubnet(this, "Creating Private-1A", {
      cidrBlock: private_1a_cidr,
      vpcId: cdk.Fn.importValue("VPCID"),
      availabilityZone: availabilityZones[0],
      mapPublicIpOnLaunch: false,
      tags: [
        { key: "Type", value: "Private" },
        { key: "Name", value: "Private-1A" },
        { key: "kubernetes.io/role/internal-elb", value: "1" },
      ],
    });
    new cdk.CfnOutput(this, "Private-1A-ID", {
      value: private_1a.ref,
      exportName: "Private-1A-ID",
    });
    // ====================================================================================================
    /**
     * Private-1B Configuration
     */
    const private_1b = new ec2.CfnSubnet(this, "Creating Private-1B", {
      cidrBlock: private_1b_cidr,
      vpcId: cdk.Fn.importValue("VPCID"),
      availabilityZone: availabilityZones[1],
      mapPublicIpOnLaunch: false,
      tags: [
        { key: "Type", value: "Private" },
        { key: "Name", value: "Private-1B" },
        { key: "kubernetes.io/role/internal-elb", value: "1" },
      ],
    });
    new cdk.CfnOutput(this, "Private-1B-ID", {
      value: private_1b.ref,
      exportName: "Private-1B-ID",
    });
    // ====================================================================================================
  }
}
