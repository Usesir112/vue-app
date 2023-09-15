import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as blueprints from "@aws-quickstart/eks-blueprints";
import * as eks from "aws-cdk-lib/aws-eks";

/**
 * Use to inport configurations
 */
import { readYamlToJson } from "../utils";
const env: string = process.env.ENV_NAME || "dev";
const config = readYamlToJson(`configs/${env}/config.yaml`);
/**
 * The Variables
 */
const kubernetesVersion = eks.KubernetesVersion.V1_25;
const managedNodeGroupsId = config.genericClusterProvider.managedNodeGroupsId;
const amiType = config.genericClusterProvider.amiType;
const instanceType = config.genericClusterProvider.instanceType;
const desiredSize = config.genericClusterProvider.desiredSize;
const maxSize = config.genericClusterProvider.maxSize;

export const genericClusterProvider = new blueprints.GenericClusterProvider({
  version: kubernetesVersion,
  tags: {
    Name: "blueprints-example-cluster",
    Type: "generic-cluster",
  },
  managedNodeGroups: [
    {
      id: managedNodeGroupsId,
      /**
       * ami type MUST be matched with the Instance Type.
       */
      amiType: eks.NodegroupAmiType.AL2_X86_64,
      /**
       * The Version of Blueprint and aws-cdk MUST be matched.
       * (You can see the version in github release page)
       * https://github.com/aws-quickstart/cdk-eks-blueprints/tree/blueprints-1.10.1
       * and see it in package.json
       * t3a.nano is too small - Memory Pressure
       * Suggetion: t3a.medium
       */
      instanceTypes: [new ec2.InstanceType(instanceType)],

      desiredSize: desiredSize,
      maxSize: maxSize,
      nodeGroupSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      launchTemplate: {
        // You can pass Custom Tags to Launch Templates which gets propagated to worker nodes.
        tags: {
          Name: "Mng1",
          Type: "Managed-Node-Group",
          LaunchTemplate: "Custom",
          Instance: "ONDEMAND",
        },
      },
    },
  ],
});
