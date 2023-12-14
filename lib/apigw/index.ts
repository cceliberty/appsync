import { BundlingOutput, DockerImage, Duration, Stack, StackProps } from 'aws-cdk-lib';
import {
  AuthorizationType,
  Code,
  Definition,
  FieldLogLevel,
  FunctionRuntime,
  GraphqlApi,
} from 'aws-cdk-lib/aws-appsync';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import path from 'path';

export class APIGW extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new GraphqlApi(this, `${id}-api`, {
      name: `${id}-api`,
      definition: Definition.fromFile(path.join(__dirname, 'apigw.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.IAM,
        },
      },
      xrayEnabled: true,
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
        excludeVerboseContent: false,
        retention: RetentionDays.ONE_DAY,
      },
    });

    const dataSource = api.addHttpDataSource(`${id}-http-ds`, 'https://7809kj8bzj.execute-api.eu-west-1.amazonaws.com');

    api.createResolver(`${id}-getPetById`, {
      typeName: 'Query',
      fieldName: 'getPetById',
      runtime: FunctionRuntime.JS_1_0_0,
      cachingConfig: { ttl: Duration.seconds(10) },
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
            ['npm ci', 'npm run dist', 'cp dist/appsync/apigw/getPetById.js /asset-output'].join(' && '),
          ],
        },
      }),
      dataSource,
    });

    api.createResolver(`${id}-getPets`, {
      typeName: 'Query',
      fieldName: 'getPets',
      runtime: FunctionRuntime.JS_1_0_0,
      cachingConfig: { ttl: Duration.seconds(10) },
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
            ['npm ci', 'npm run dist', 'cp dist/appsync/apigw/getPets.js /asset-output'].join(' && '),
          ],
        },
      }),
      dataSource,
    });
  }
}
