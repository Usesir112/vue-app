#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkVpcStack } from '../lib/cdk-vpc-stack';

const app = new cdk.App();
new CdkVpcStack(app, 'CdkVpcStack');
