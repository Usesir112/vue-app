import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as cdk from "aws-cdk-lib";

export class CfnInstanceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // This library is used to create EC2 Instance

    // Variables
    const imageId =
      ec2.MachineImage.latestAmazonLinux2023().getImage(this).imageId;
    const instanceType = ec2.InstanceType.of(
      ec2.InstanceClass.T3A,
      ec2.InstanceSize.MICRO
    );

    // Create Key Pair
    const keypair = new ec2.CfnKeyPair(this, "Creating Key Pair", {
        keyName: "cdk-ts-keypair",
    });
      
      
      

    // Create Public Secruity Group for All trafic to EC2 Instance
    const public_sg = new ec2.CfnSecurityGroup(this, "Public-SG", {
      vpcId: cdk.Fn.importValue("VPCID"),
      groupDescription: "Allow all traffic to EC2 Instance",
      securityGroupIngress: [
        {
          cidrIp: "0.0.0.0/0",
          ipProtocol: "tcp",
          fromPort: 0,
          toPort: 65535,
        },
      ],
      tags: [{ key: "Name", value: "Public-SG" }],
    });

    // Create Private Secruity Group for EC2 Instance to access Internet
    const private_sg = new ec2.CfnSecurityGroup(this, "Private-SG", {
      vpcId: cdk.Fn.importValue("VPCID"),
      groupDescription: "Allow all traffic to EC2 Instance",
      securityGroupIngress: [
        {
          cidrIp: "0.0.0.0/0",
          ipProtocol: "tcp",
          fromPort: 0,
          toPort: 65535,
        },
      ],
      tags: [{ key: "Name", value: "Private-SG" }],
    });

    // Create EC2 Instance for Public Subnet 1A
    const public_1a_ec2 = new ec2.CfnInstance(this, "Public-1A-EC2", {
      imageId: imageId,
      instanceType: instanceType.toString(),
      subnetId: cdk.Fn.importValue("Public-1A-ID"),
      keyName: keypair.ref,
      securityGroupIds: [public_sg.ref],

      tags: [
        { key: "Name", value: "Public-1A-EC2" },
        { key: "Type", value: "Public" },
      ],
    });

    // Create EC2 Instance for Private Subnet 1A
    const private_1a_ec2 = new ec2.CfnInstance(this, "Private-1A-EC2", {
      imageId: imageId,
      instanceType: instanceType.toString(),
      subnetId: cdk.Fn.importValue("Private-1A-ID"),
      keyName: keypair.ref,
      securityGroupIds: [private_sg.ref],
      tags: [
        { key: "Name", value: "Private-1A-EC2" },
        { key: "Type", value: "Private" },
      ],
    });
  }
}
