// lib/kyverno_addon.ts
import { Construct } from "constructs";
import * as blueprints from "@aws-quickstart/eks-blueprints";

/**
 * User provided options for the Helm Chart
 */
export interface KyvernoAddOnProps extends blueprints.HelmAddOnUserProps {
  version?: string;
  name: string;
  createNamespace?: boolean;
  namespace: string;
}

/**
 * Default props to be used when creating the Helm chart
 */
const defaultProps: blueprints.HelmAddOnProps & KyvernoAddOnProps = {
  name: "blueprints-kyverno-addon",
  namespace: "kyverno",
  chart: "kyverno",
  version: "2.5.3",
  release: "kyverno",
  repository: "https://kyverno.github.io/kyverno/",
  values: {},
};

/**
 * Main class to instantiate the Helm chart
 */
export class KyvernoAddOn extends blueprints.HelmAddOn {
  readonly options: KyvernoAddOnProps;

  constructor(props?: KyvernoAddOnProps) {
    super({ ...defaultProps, ...props });
    this.options = this.props as KyvernoAddOnProps;
  }

  deploy(clusterInfo: blueprints.ClusterInfo): Promise<Construct> {
    let values: blueprints.Values = populateValues(this.options);
    const chart = this.addHelmChart(clusterInfo, values);

    return Promise.resolve(chart);
  }
}

/**
 * populateValues populates the appropriate values used to customize the Helm chart
 * @param helmOptions User provided values to customize the chart
 */
function populateValues(helmOptions: KyvernoAddOnProps): blueprints.Values {
  const values = helmOptions.values ?? {};
  return values;
}
