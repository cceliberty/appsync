import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { DatabaseClusterEngine, DatabaseSecret, ServerlessCluster } from 'aws-cdk-lib/aws-rds';
// import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export class RDSCluster extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // const vpc = new Vpc(this, `${id}-vpc`);

    const dbName = `${id}-db`;
    const username = 'postgres';
    const secretName = `${id}-secret`;

    // Create username and password secret for DB Cluster
    new DatabaseSecret(this, 'AuroraSecret', {
      username: 'clusteradmin',
    });

    // The VPC to place the cluster in

    // Create the serverless cluster, provide all values needed to customise the database.
    new ServerlessCluster(this, 'AuroraCluster', {
      engine: DatabaseClusterEngine.AURORA_MYSQL,
      // vpc,
      credentials: { username: 'clusteradmin' },
      clusterIdentifier: 'db-endpoint-test',
      defaultDatabaseName: 'demos',
    });

    // new DatabaseInstance(this, dbName, {
    //   vpc,
    //   engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_14 }),
    //   credentials: Credentials.fromGeneratedSecret(username, { secretName }),
    //   // credentials: { username, password },
    //   multiAz: false,
    //   storageType: StorageType.GP2,
    //   allocatedStorage: 20,
    //   maxAllocatedStorage: 20,
    //   port: 5432,
    //   monitoringInterval: Duration.days(1),
    //   databaseName: dbName,

    //   // ip bureau 146.247.95.186
    //   // open sortie
    //   securityGroups: [],
    // });

    new CfnOutput(this, `${id}-db-user`, { value: username, description: 'database username' });
    // new CfnOutput(this, `${id}-db-pass`, { value: password.toString(), description: 'database password' });
    new CfnOutput(this, `${id}-db-pass`, { value: secretName, description: 'database password' });
    new CfnOutput(this, `${id}-db-name`, { value: dbName, description: 'database name' });
  }
}
