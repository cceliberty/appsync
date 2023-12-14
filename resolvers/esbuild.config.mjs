import * as esbuild from 'esbuild';

// eslint-disable-next-line @aws-appsync/no-await
await esbuild.build({
  // entryPoints: ['src/http/todo-resolver.ts'],
  entryPoints: [`src/apigw/getPetById.ts`, `src/apigw/getPets.ts`, 'src/ddb/getDDBDemo.ts'],
  bundle: true,
  sourcemap: 'inline',
  sourcesContent: false,
  target: 'esnext',
  platform: 'node',
  format: 'esm',
  external: ['@aws-appsync/utils'],
  outdir: 'dist/appsync',
});
