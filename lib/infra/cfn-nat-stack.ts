import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export class CfnNatStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // This library is used to create NAT Gateway

    // Create EIP for NAT Gateway
    const eip = new ec2.CfnEIP(this, "Creating EIP for NAT GW", {
      domain: "vpc",
    });

    // Create NAT Gateway
    const natgw = new ec2.CfnNatGateway(this, "Creating NAT Gateway", {
      allocationId: eip.attrAllocationId,
      subnetId: cdk.Fn.importValue("Public-1A-ID"),
    });

    // Create Private Route Table
    const private_rt = new ec2.CfnRouteTable(this, "Creating Private-RT", {
      vpcId: cdk.Fn.importValue("VPCID"),
      tags: [{ key: "Name", value: "Private-RT" }],
    });

    // Create Private Route
    const private_route = new ec2.CfnRoute(this, "Creating Private-Route", {
      routeTableId: private_rt.ref,
      destinationCidrBlock: "0.0.0.0/0",
      natGatewayId: natgw.ref,
    });

    // Associate Private Subnet 1A with Private Route Table
    const private_1a_rt_assoc = new ec2.CfnSubnetRouteTableAssociation(
      this,
      "Private-1A-RT-Assoc",
      {
        subnetId: cdk.Fn.importValue("Private-1A-ID"),
        routeTableId: private_rt.ref,
      }
    );

    // Associate Private Subnet 1B with Private Route Table
    const private_1b_rt_assoc = new ec2.CfnSubnetRouteTableAssociation(
      this,
      "Private-1B-RT-Assoc",
      {
        subnetId: cdk.Fn.importValue("Private-1B-ID"),
        routeTableId: private_rt.ref,
      }
    );
  }
}
