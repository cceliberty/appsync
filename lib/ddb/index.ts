import { BundlingOutput, DockerImage, Stack, StackProps } from 'aws-cdk-lib';
import {
  AuthorizationType,
  Code,
  Definition,
  FieldLogLevel,
  FunctionRuntime,
  GraphqlApi,
} from 'aws-cdk-lib/aws-appsync';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import path from 'path';

import { DDBTable } from './table';

interface DDBProps extends StackProps {
  tableName: string;
}

export class DDB extends Stack {
  public table: Table;

  constructor(scope: Construct, id: string, props: DDBProps) {
    super(scope, id);

    const { tableName } = props;

    const { table } = new DDBTable(this, 'table', { tableName });
    this.table = table;

    const api = new GraphqlApi(this, `${id}-api`, {
      name: `${id}-api`,
      definition: Definition.fromFile(path.join(__dirname, 'ddb.graphql')),
      authorizationConfig: {
        defaultAuthorization: { authorizationType: AuthorizationType.IAM },
      },
      xrayEnabled: true,
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
        excludeVerboseContent: false,
        retention: RetentionDays.ONE_DAY,
      },
    });

    const dataSource = api.addDynamoDbDataSource(`${id}-ddb-ds`, this.table);

    api.createResolver(`${id}-resolver`, {
      typeName: 'Query',
      fieldName: 'getPetBreed',
      runtime: FunctionRuntime.JS_1_0_0,
      code: Code.fromAsset(path.join(__dirname, '..', '..', 'resolvers'), {
        bundling: {
          outputType: BundlingOutput.SINGLE_FILE,
          image: DockerImage.fromRegistry('public.ecr.aws/docker/library/node:18.18.0-slim'),
          environment: {
            NPM_CONFIG_PREFIX: '/tmp/.npm-global',
            NPM_CONFIG_CACHE: '/tmp/.npm-cache',
            NODE_OPTIONS: '--dns-result-order=ipv4first',
          },
          command: [
            'bash',
            '-c',
            ['npm ci', 'npm run dist', 'cp dist/appsync/ddb/getDDBDemo.js /asset-output'].join(' && '),
          ],
        },
      }),
      dataSource,
    });
  }
}
