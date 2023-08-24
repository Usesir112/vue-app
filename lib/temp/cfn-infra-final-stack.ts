import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export class CfnInfraFinalStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
      super(scope, id, props);

      // Here is checklist of what we need to do:
      // 01. Create VPC
      // 02. Create Internet Gateway
      // 03. Attach Internet Gateway to VPC
        
      // 04. Create Public-1A Subnet
      // 05. Create Public-1B Subnet
      // 06. Create Private-1A Subnet
      // 07. Create Private-1B Subnet
      // 08. Create Public Route Table
      // 09. Create EIP for NAT Gateway
      // 10. Create EIP for NAT Gateway
      // 11. Create NAT Gateway
      // 12. Create Public Route
      // 13. Create Private Route
      // 14. Associate Public Subnet 1A with Public Route Table
      // 15. Associate Public Subnet 1B with Public Route Table
      // 16. Associate Private Subnet 1A with Private Route Table
      // 17. Associate Private Subnet 1B with Private Route Table
      // 18. Create Public Security Group
      // 19. Create Private Security Group
      // 20. Create ACL for Public Subnet
      // 21. Create ACL for Private Subnet
      // 22. Create ACL Entry for Public Subnet
      // 23. Create ACL Entry for Private Subnet
      // 24. Associate Public Subnet 1A with Public ACL
      // 25. Associate Public Subnet 1B with Public ACL
      // 26. Associate Private Subnet 1A with Private ACL
      // 27. Associate Private Subnet 1B with Private ACL
      // 28. Create Public-1A Instance
      // 29. Create Private-1A Instance
        
      // You can change the values here
        
        // VPC CIDR
        const vpc_cidr = "10.0.0.0/16"

        // Subnet CIDR
        const public_1a_cidr = "10.0.0.0/18";
        const public_1b_cidr = "10.0.64.0/18";
        const private_1a_cidr = "10.0.128.0/18";
        const private_1b_cidr = "10.0.192.0/18";

        // Availability Zone
        const public_1a_az = "ap-southeast-1a";
        const public_1b_az = "ap-southeast-1b";
        const private_1a_az = "ap-southeast-1a";
        const private_1b_az = "ap-southeast-1b";
        



      // 01. Create VPC
      const vpc = new ec2.CfnVPC(this, "cdk-ts-vpc", {
        cidrBlock: vpc_cidr,
        tags: [{ key: "Name", value: "cdk-ts-vpc" }],
      });

      // 02. Create Internet Gateway
      const igw = new ec2.CfnInternetGateway(this, "cdk-ts-igw", {
        tags: [{ key: "Name", value: "cdk-ts-igw" }],
      });

      // 03. Attach Internet Gateway to VPC
      const vpcigw = new ec2.CfnVPCGatewayAttachment(this, "cdk-ts-vpcigw", {
        vpcId: vpc.ref,
        internetGatewayId: igw.ref,
      });

      // 04. Create Public-1A Subnet
      const public_1a = new ec2.CfnSubnet(this, "Public-1A", {
        cidrBlock: public_1a_cidr,
        vpcId: vpc.ref,
        availabilityZone: public_1a_az,
        mapPublicIpOnLaunch: true,
        tags: [
          { key: "Type", value: "Public" },
          { key: "Name", value: "Public-1A" },
        ],
      });

      // 05. Create Public-1B Subnet
      const public_1b = new ec2.CfnSubnet(this, "Public-1B", {
        cidrBlock: public_1b_cidr,
        vpcId: vpc.ref,
        availabilityZone: public_1b_az,
        mapPublicIpOnLaunch: true,
        tags: [
          { key: "Type", value: "Public" },
          { key: "Name", value: "Public-1B" },
        ],
      });

      // 06. Create Private-1A Subnet
      const private_1a = new ec2.CfnSubnet(this, "Private-1A", {
        cidrBlock: private_1a_cidr,
        vpcId: vpc.ref,
        availabilityZone: private_1a_az,
        mapPublicIpOnLaunch: false,
        tags: [
          { key: "Type", value: "Private" },
          { key: "Name", value: "Private-1A" },
        ],
      });

      // 07. Create Private-1B Subnet
      const private_1b = new ec2.CfnSubnet(this, "Private-1B", {
        cidrBlock: private_1b_cidr,
        vpcId: vpc.ref,
        availabilityZone: private_1b_az,
        mapPublicIpOnLaunch: false,
        tags: [
          { key: "Type", value: "Private" },
          { key: "Name", value: "Private-1B" },
        ],
      });

      // 08. Create Public Route Table
      const public_rt = new ec2.CfnRouteTable(this, "Public-RT", {
        vpcId: vpc.ref,
        tags: [{ key: "Name", value: "Public-RT" }],
      });

      // 09. Create EIP for NAT Gateway
      const private_rt = new ec2.CfnRouteTable(this, "Private-RT", {
        vpcId: vpc.ref,
        tags: [{ key: "Name", value: "Private-RT" }],
      });

      // 10. Create EIP for NAT Gateway
      const eip = new ec2.CfnEIP(this, "cdk-ts-eip", {
        domain: "vpc",
      });

      // 11. Create NAT Gateway
      const natgw = new ec2.CfnNatGateway(this, "cdk-ts-natgw", {
        allocationId: eip.attrAllocationId,
        subnetId: public_1a.ref,
      });

      // 12. Create Public Route
      const public_route = new ec2.CfnRoute(this, "Public-Route", {
        routeTableId: public_rt.ref,
        destinationCidrBlock: "0.0.0.0/0",
        gatewayId: igw.ref,
      });

      // 13. Create Private Route
      const private_route = new ec2.CfnRoute(this, "Private-Route", {
        routeTableId: private_rt.ref,
        destinationCidrBlock: "0.0.0.0/0",
        natGatewayId: natgw.ref,
      });

      // 14. Associate Public Subnet 1A with Public Route Table
      const public_1a_rt_assoc = new ec2.CfnSubnetRouteTableAssociation(
        this,
        "Public-1A-RT-Assoc",
        {
          subnetId: public_1a.ref,
          routeTableId: public_rt.ref,
        }
      );

      // 15. Associate Public Subnet 1B with Public Route Table
      const public_1b_rt_assoc = new ec2.CfnSubnetRouteTableAssociation(
        this,
        "Public-1B-RT-Assoc",
        {
          subnetId: public_1b.ref,
          routeTableId: public_rt.ref,
        }
      );

      // 16. Associate Private Subnet 1A with Private Route Table
      const private_1a_rt_assoc = new ec2.CfnSubnetRouteTableAssociation(
        this,
        "Private-1A-RT-Assoc",
        {
          subnetId: private_1a.ref,
          routeTableId: private_rt.ref,
        }
      );

      // 17. Associate Private Subnet 1B with Private Route Table
      const private_1b_rt_assoc = new ec2.CfnSubnetRouteTableAssociation(
        this,
        "Private-1B-RT-Assoc",
        {
          subnetId: private_1b.ref,
          routeTableId: private_rt.ref,
        }
      );

      // 18. Create Public Security Group
      const public_sg = new ec2.CfnSecurityGroup(this, "Public-SG", {
        vpcId: vpc.ref,
        groupDescription: "Public Security Group",
        securityGroupIngress: [
          {
            cidrIp: "0.0.0.0/0",
            ipProtocol: "tcp",
            fromPort: 22,
            toPort: 22,
          },
          {
            cidrIp: "0.0.0.0/0",
            ipProtocol: "tcp",
            fromPort: 80,
            toPort: 80,
          },
        ],
        tags: [{ key: "Name", value: "Public-SG" }],
      });

      // 19. Create Private Security Group
      const private_sg = new ec2.CfnSecurityGroup(this, "Private-SG", {
        vpcId: vpc.ref,
        groupDescription: "Private Security Group",
        securityGroupIngress: [
          {
            cidrIp: "0.0.0.0/0",
            ipProtocol: "tcp",
            fromPort: 22,
            toPort: 22,
          },
        ],
        tags: [{ key: "Name", value: "Private-SG" }],
      });

      // 20. Create ACL for Public Subnet
      const public_acl = new ec2.CfnNetworkAcl(this, "Public-ACL", {
        vpcId: vpc.ref,
        tags: [{ key: "Name", value: "Public-ACL" }],
      });

      // 21. Create ACL for Private Subnet
      const private_acl = new ec2.CfnNetworkAcl(this, "Private-ACL", {
        vpcId: vpc.ref,
        tags: [{ key: "Name", value: "Private-ACL" }],
      });

      // 22. Create ACL Entry for Public Subnet
      const public_acl_entry = new ec2.CfnNetworkAclEntry(
        this,
        "Public-ACL-Entry",
        {
          networkAclId: public_acl.ref,
          ruleNumber: 100,
          protocol: 6,
          ruleAction: "allow",
          egress: false,
          cidrBlock: "0.0.0.0/0",
          portRange: {
            from: 80,
            to: 80,
          },
        }
      );

      // 23. Create ACL Entry for Private Subnet
      const private_acl_entry = new ec2.CfnNetworkAclEntry(
        this,
        "Private-ACL-Entry",
        {
          networkAclId: private_acl.ref,
          ruleNumber: 100,
          protocol: 6,
          ruleAction: "allow",
          egress: false,
          cidrBlock: "0.0.0.0./0",
          portRange: {
            from: 22,
            to: 22,
          },
        }
      );

      // 24. Associate Public Subnet 1A with Public ACL
      const public_1a_acl_assoc = new ec2.CfnSubnetNetworkAclAssociation(
        this,
        "Public-1A-ACL-Assoc",
        {
          subnetId: public_1a.ref,
          networkAclId: public_acl.ref,
        }
      );

      // 25. Associate Public Subnet 1B with Public ACL
      const public_1b_acl_assoc = new ec2.CfnSubnetNetworkAclAssociation(
        this,
        "Public-1B-ACL-Assoc",
        {
          subnetId: public_1b.ref,
          networkAclId: public_acl.ref,
        }
      );

      // 26. Associate Private Subnet 1A with Private ACL
      const private_1a_acl_assoc = new ec2.CfnSubnetNetworkAclAssociation(
        this,
        "Private-1A-ACL-Assoc",
        {
          subnetId: private_1a.ref,
          networkAclId: private_acl.ref,
        }
      );

      // 27. Associate Private Subnet 1B with Private ACL
      const private_1b_acl_assoc = new ec2.CfnSubnetNetworkAclAssociation(
        this,
        "Private-1B-ACL-Assoc",
        {
          subnetId: private_1b.ref,
          networkAclId: private_acl.ref,
        }
      );

      // 28. Create Public-1A Instance
      const public_1a_instance = new ec2.CfnInstance(
        this,
        "Public-1A-Instance",
        {
          imageId: new ec2.AmazonLinuxImage().getImage(this).imageId,
          instanceType: ec2.InstanceType.of(
            ec2.InstanceClass.T3A,
            ec2.InstanceSize.MICRO
          ).toString(),
          subnetId: public_1a.ref,
          securityGroupIds: [public_sg.ref],
          tags: [{ key: "Name", value: "Public-1A-Instance" }],
        }
      );

      // 29. Create Private-1A Instance
      const private_1a_instance = new ec2.CfnInstance(
        this,
        "Private-1A-Instance",
        {
          imageId: new ec2.AmazonLinuxImage().getImage(this).imageId,
          instanceType: ec2.InstanceType.of(
            ec2.InstanceClass.T3A,
            ec2.InstanceSize.MICRO
          ).toString(),
          subnetId: private_1a.ref,
          securityGroupIds: [private_sg.ref],
          tags: [{ key: "Name", value: "Private-1A-Instance" }],
        }
      );
    }
}






