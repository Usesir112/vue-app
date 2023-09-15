import * as blueprints from "@aws-quickstart/eks-blueprints";

import { readYamlToJson } from "../utils";

const env: string = process.env.ENV_NAME || "dev";
const config = readYamlToJson(`configs/${env}/config.yaml`);

const repoUrl = config.addOns.argocd.repoUrl;
const targetRevision = config.addOns.argocd.targetRevision;
const path = config.addOns.argocd.path;
const hosts = config.addOns.argocd.hosts;
const ingressClassName = config.addOns.argocd.ingressClassName;
const url = config.addOns.argocd.url;

/**
 * Repo for bootstrap argoCD
 */
const bootstrapRepo: blueprints.ApplicationRepository = {
  repoUrl,
  targetRevision: targetRevision,
};
/**
 * ArgoCD Configurations
 */
export const bootstrapArgo = new blueprints.ArgoCDAddOn({
  bootstrapRepo: {
    ...bootstrapRepo,
    path: path,
  },
  /**
   * For make argoCD have Ingress and nginX can use it
   */
  values: {
    server: {
      ingress: {
        enabled: true,
        hosts: [hosts],
        ingressClassName: ingressClassName,
      },
      /**
       * For make app redirect to correctly url
       */
      configs: {
        url: url,
      },
      /**
       * This is required to mapping the port http > http not http > https
       */
      extraArgs: ["--insecure"],
    },
  },
});
