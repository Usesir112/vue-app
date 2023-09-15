import * as blueprints from "@aws-quickstart/eks-blueprints";

import { readYamlToJson } from "../utils";

const env: string = process.env.ENV_NAME || "dev";
const config = readYamlToJson(`configs/${env}/config.yaml`);

const externalDnsHostname = config.addOns.nginx.externalDnsHostname;
/**
 * Nginx Add-on is require AWS Load Balancer Controller Add-on in order to enable NLB support.
 * See the documentation for more details:
 * AWS Load Balancer: https://aws-quickstart.github.io/cdk-eks-blueprints/addons/aws-load-balancer-controller/
 * Nginx add-on: https://aws-quickstart.github.io/cdk-eks-blueprints/addons/nginx/
 */
export const AwsLoadBalancerControllerAddOn =
  new blueprints.AwsLoadBalancerControllerAddOn();

export const nginxAddOn = new blueprints.addons.NginxAddOn({
  certificateResourceName: blueprints.GlobalResources.Certificate,
  externalDnsHostname,
  
});
