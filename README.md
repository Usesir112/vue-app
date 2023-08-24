# EKS Blueprint

**Last Updated**: 23rd August 2023

Welcome to the EKS Blueprint! This guide will walk you through the steps to effectively set up and manage your cloud environment using this blueprint. We've provided clear instructions for each stage, ensuring a smooth experience from start to finish.

## Getting Started

Follow these steps to get started with the EKS Blueprint:

### Creating Cloud Environment

1. Run the following command to create your cloud environment:

   ```sh
     make infra
   ```

2. After the environment is created, locate the vpcID (e.g., vpc-xxxxxxxxxxxxxxx) and copy it.

3. Open the `config/dev/config.yaml` file and paste the copied `vpcID` in the appropriate field.

### Creating EKS Cluster

1. Run the following command to create your EKS cluster:

   ```sh
     make cluster
   ```

2. Next, you'll need to update the LoadBalancer in the Route 53 service to point to the new cluster. Update the following DNS records:

   - `argocd.devsecops.wisesight.dev`
   - `nginx.devsecops.wisesight.dev`
   - `uncle.devsecops.wisesight.dev`

## Cleaning Up

After you're done using the EKS cluster, follow these steps to clean up:

1. Delete the ArgoCD bootstrap application to ensure a smooth cluster deletion process.

2. Run the following command to destroy the cluster and associated resources:

   ```sh
     make destroy
   ```

## Tips and Best Practices

- `Subnet Tagging:` When creating subnets, remember to include the appropriate tags:
  - For `public` subnets:
    ```js
    { key: "kubernetes.io/role/elb", value: "1" }
    ```
  - For `private` subnets:
    ```js
    { key: "kubernetes.io/role/internal-elb", value: "1" }
    ```
- `Ingress Configuration:` Ensure that your ingress configurations reference the correct `SERVICE NAME`. For example, use `vue-app-service` instead of `vue-app`

- `ArgoCD Credentials:` You can find the ArgoCD credentials in the `secret`.

- About the service `image` for those who create from arm64 architecture, you need to add ` --platform=linux/amd64`