import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as cdk from "aws-cdk-lib";

export class CfnVpcStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create VPC
    const vpc = new ec2.CfnVPC(this, "MyVPC", {
      cidrBlock: "10.0.0.0/16",
      enableDnsSupport: true,
      enableDnsHostnames: true,
      instanceTenancy: "default",
      tags: [{ key: "Name", value: "MyVPC" }],
    });

    //Export VPC ID
    new cdk.CfnOutput(this, "VPCID", {
      value: vpc.ref,
      exportName: "VPCID",
    });
    
  }
}
