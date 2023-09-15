import { Construct } from "constructs";
import * as blueprints from "@aws-quickstart/eks-blueprints";

/**
 * User provided options for the Helm Chart
 */
export interface RancherAddOnProps extends blueprints.HelmAddOnUserProps {
  version?: string;
  name: string;
  createNamespace?: boolean;
  namespace: string;
}
/**
 * Default props to be used when creating the Helm chart
 */
export const defaultProps: blueprints.HelmAddOnProps & RancherAddOnProps = {
  /**
   * Internal identifyer for our add-on
   */
  name: "rancher-addon",
  /**
   * Namespace used to deploy the chart
   */
  namespace: "cattle-system",
  /**
   * Name of the Chart to be deployed
   */
  chart: "rancher",
  /**
   * version of the chart
   */
  version: "2.7.0",
  /**
   * Name for our chart in Kubernetes
   */
  release: "rancher",
  /**
   * HTTPS address of the chart repository
   */
  repository: "https://releases.rancher.com/server-charts/stable",
  /**
   * Additional chart values
   */
  values: {
    hostname: "rancher-arm.devsecops.wisesight.dev",
    replicas: 1,
    bootstrapPassword: "admin",
    ingress: {
      ingressClassName: "nginx",
    },
    tls: "external",
    global: {
      cattle: {
        psp: {
          enabled: false,
        },
      },
    },
  },
};
/**
 * Main class to instantiate the Helm chart
 */
export class RancherAddOn extends blueprints.HelmAddOn {
  readonly options: RancherAddOnProps;

  constructor(props?: RancherAddOnProps) {
    super({ ...defaultProps, ...props });
    this.options = this.props as RancherAddOnProps;
  }

  deploy(clusterInfo: blueprints.ClusterInfo): Promise<Construct> {
    let values: blueprints.Values = populateValues(this.options);
    // blueprints.utils.setPath(values, "auditLog.maxSize", 100);
    const chart = this.addHelmChart(clusterInfo, values);

    return Promise.resolve(chart);
  }
}

/**
 * populateValues populates the appropriate values used to customize the Helm chart
 * @param helmOptions User provided values to customize the chart
 */
function populateValues(helmOptions: RancherAddOnProps): blueprints.Values {
  const values = helmOptions.values ?? {};
  return values;
}
