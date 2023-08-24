// lib/my-eks-blueprints-stack.ts
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as blueprints from "@aws-quickstart/eks-blueprints";
import "source-map-support/register";
import { genericClusterProvider } from "./cluster-providers/generic-cluster-provider";
import { bootstrapArgo } from "./addons/argocd";
import { AwsLoadBalancerControllerAddOn, nginxAddOn } from "./addons/nginx";
/**
 * Use to inport configurations
 */
import { readYamlToJson } from "./utils";
const env: string = process.env.ENV_NAME || "dev";
const config = readYamlToJson(`configs/${env}/config.yaml`);
/**
 * The Variables
 */
const vpcId = config.cluster.vpcID;
const myCertArn = config.cluster.myCertArn;

export default class ClusterConstruct extends Construct {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);
    /**
     * The cluster provider Congifuration
     *
     */
    const account = props?.env?.account!;
    const region = props?.env?.region!;
    /**
     * The cluster add-ons
     */
    const addOns: Array<blueprints.ClusterAddOn> = [
      AwsLoadBalancerControllerAddOn,
      nginxAddOn,
      bootstrapArgo,
    ];
    /**
     * Main Blueprint Configuration
     */
    blueprints.EksBlueprint.builder()
      /**
       * The cluster provider Congifuration
       * ./lib/cluster-providers/generic-cluster-provider.ts
       */
      .clusterProvider(genericClusterProvider)
      /**
       * The cluster provider Congifuration
       * Define the VPC ID the cluster will be deployed in.
       */
      .resourceProvider(
        blueprints.GlobalResources.Vpc,
        new blueprints.VpcProvider(vpcId)
      )
      /**
       * The cluster provider Congifuration
       * Certificate ARN for the cluster ingress.
       */
      .resourceProvider(
        blueprints.GlobalResources.Certificate,
        new blueprints.ImportCertificateProvider(myCertArn, "cert1-id")
      )
      .addOns(...addOns)
      .account(account)
      .region(region)
      .teams()

      .build(scope, id + "-stack");
  }
}
