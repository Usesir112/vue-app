import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as cdk from "aws-cdk-lib";

export class CfnSubnetStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Create Subnet using CfnSubnet
    const public_1a = new ec2.CfnSubnet(this, "Public-1A", {
      cidrBlock: "10.0.0.0/18",
      vpcId: cdk.Fn.importValue("VPCID"),
      availabilityZone: "ap-southeast-1a",
      mapPublicIpOnLaunch: true,
      tags: [{ key: "Type", value: "Public" }],
    });

    //create subnet using Publicsubnet
    const public_1b = new ec2.PublicSubnet(this, "Public-1B", {
      cidrBlock: "10.0.64.0/18",
      vpcId: cdk.Fn.importValue("VPCID"),
      availabilityZone: "ap-southeast-1b",
      mapPublicIpOnLaunch: true,
    });
  }
}
