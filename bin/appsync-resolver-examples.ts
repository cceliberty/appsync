#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
// import { AppsyncResolverExamplesStack } from '../lib/exemple/appsync-resolver-examples-stack';
import { APIGW } from '../lib/apigw';
import { DDB } from '../lib/ddb';
import { RDSCluster } from '../lib/rds';

const app = new cdk.App();
// new AppsyncResolverExamplesStack(app, 'AppsyncResolverExamplesStack');
new RDSCluster(app, 'rds');
new DDB(app, 'ddb', { tableName: 'appsync-table' });
new APIGW(app, 'get-pets');
