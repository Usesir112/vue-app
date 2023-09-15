import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as cdk from "aws-cdk-lib";

export class CfnVpcStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    /**
     * VPC CIDR Block
     */
    const vpcCidr = "10.0.0.0/16";
    /**
     * Create VPC
     */
    const vpc = new ec2.CfnVPC(this, "Creating VPC from CfnVPC", {
      cidrBlock: vpcCidr,
      tags: [{ key: "Name", value: "rancher-experimental" }],
    });
    /**
     * Export VPC ID
     */
    new cdk.CfnOutput(this, "VPCID", {
      value: vpc.ref,
      exportName: "VPCID",
    });
    /**
     * Create Internet Gateway
     */
    const igw = new ec2.CfnInternetGateway(this, "Creating Interet Gateway", {
      tags: [{ key: "Name", value: "cdk-ts-igw" }],
    });
    /**
     * Export Internet Gateway ID
     */
    new cdk.CfnOutput(this, "IGWID", {
      value: igw.ref,
      exportName: "IGWID",
    });
    /**
     * Attaching Internet Gateway to VPC
     */
    const vpcigw = new ec2.CfnVPCGatewayAttachment(
      this,
      "Attaching Internet Gateway to VPC",
      {
        vpcId: vpc.ref,
        internetGatewayId: igw.ref,
      }
    );
  }
}
