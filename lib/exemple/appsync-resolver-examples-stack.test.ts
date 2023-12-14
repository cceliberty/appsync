import { App } from 'aws-cdk-lib';
import { AppsyncResolverExamplesStack } from './appsync-resolver-examples-stack';
import { Template } from 'aws-cdk-lib/assertions';

let template: Template;

beforeAll(() => {
  const app = new App();
  const stack = new AppsyncResolverExamplesStack(app, 'exStack');
  template = Template.fromStack(stack);
});

describe('resolvers', () => {
  test('should create resolvers name', () => {
    template.hasResourceProperties('AWS::AppSync::GraphQLApi', {
      Name: 'Typescript-Resolver',
    });
  });

  test('should create resolvers type', () => {
    template.hasResourceProperties('AWS::AppSync::Resolver', {
      DataSourceName: 'NoneDS',
      FieldName: 'getTodoWithUnitResolver',
      TypeName: 'Query',
    });
  });
});
