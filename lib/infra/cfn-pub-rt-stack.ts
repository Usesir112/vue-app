import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as cdk from "aws-cdk-lib";

export class CfnPubRtStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // This library is used to create Route Table

    // Create Public Route Table
    const public_rt = new ec2.CfnRouteTable(this, "Public-RT", {
      vpcId: cdk.Fn.importValue("VPCID"),
      tags: [{ key: "Name", value: "Public-RT" }],
    });

    // Create Public Route
    const public_route = new ec2.CfnRoute(this, "Public-Route", {
      routeTableId: public_rt.ref,
      destinationCidrBlock: "0.0.0.0/0",
      gatewayId: cdk.Fn.importValue("IGWID"),
    });

    // Associate Public Subnet 1A with Public Route Table
    const public_1a_rt_assoc = new ec2.CfnSubnetRouteTableAssociation(
      this,
      "Public-1A-RT-Assoc",
      {
        subnetId: cdk.Fn.importValue("Public-1A-ID"),
        routeTableId: public_rt.ref,
      }
    );

    // Associate Public Subnet 1B with Public Route Table
    const public_1b_rt_assoc = new ec2.CfnSubnetRouteTableAssociation(
      this,
      "Public-1B-RT-Assoc",
      {
        subnetId: cdk.Fn.importValue("Public-1B-ID"),
        routeTableId: public_rt.ref,
      }
    );
  }
}
