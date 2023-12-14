import { Construct } from 'constructs';
import { StackProps } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';

interface DDBTableProps extends StackProps {
  tableName: string;
}

export class DDBTable extends Construct {
  public table: Table;

  constructor(scope: Construct, id: string, props: DDBTableProps) {
    super(scope, id);

    const { tableName } = props;

    const table = new Table(this, `${id}-${tableName}`, {
      // Base
      tableName,
      partitionKey: { name: 'partitionKey', type: AttributeType.STRING },
      sortKey: { name: 'sortKey', type: AttributeType.STRING },

      // Billing
      billingMode: BillingMode.PROVISIONED,
      readCapacity: 2,
      writeCapacity: 2,
    });

    this.table = table;
  }
}
