#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CfnVpcStack } from "../lib/infra/cfn-vpc-stack";
import { CfnSubnetStack } from "../lib/infra/cfn-subnet-stack";
import { CfnPubRtStack } from "../lib/infra/cfn-pub-rt-stack";
import { CfnNatStack } from "../lib/infra/cfn-nat-stack";
import ClusterConstruct from "../lib/clusters/eks-blueprints-stack";



const app = new cdk.App();
const account = process.env.CDK_DEFAULT_ACCOUNT!;
const region = process.env.CDK_DEFAULT_REGION;
const env = { account, region };

const vpcStack = new CfnVpcStack(app, "CfnVpcStack");
const subnetStack = new CfnSubnetStack(app, "CfnSubnetStack");
const pubRtStack = new CfnPubRtStack(app, "CfnPubRtStack");
const natStack = new CfnNatStack(app, "CfnNatStack");
new ClusterConstruct(app, "cluster", { env });


