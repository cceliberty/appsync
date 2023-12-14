# AppSync Project

![Statements](https://img.shields.io/badge/statements-10.41%25-red.svg?style=flat&logo=jest)
![Branches](https://img.shields.io/badge/branches-0%25-red.svg?style=flat&logo=jest)
![Functions](https://img.shields.io/badge/functions-12.5%25-red.svg?style=flat&logo=jest)
![Lines](https://img.shields.io/badge/lines-10.41%25-red.svg?style=flat&logo=jest)

# TODO:

- [x] Connect with `addHttpDataSource`
- [x] Connect with `addDynamoDbDataSource`
- [] Connect with `addRdsDataSource`
- [ ] Create a configuration file to deploy AppSync resources
- [ ] How implement authentication
- [ ] How to chain multiple resolvers

# Known Issues:

## Bundling

Error when synthesizing (`cdk synth`):

```bash
Bundling asset get-pets/get-pets-api/get-pets-getPetById/Code/Stage...
npm ERR! code ENOENT
npm ERR! syscall mkdir
npm ERR! path /tmp/.npm-cache
npm ERR! errno -2
npm ERR! enoent ENOENT: no such file or directory, mkdir '/tmp/.npm-cache'
npm ERR! enoent This is related to npm not being able to find a file.
npm ERR! enoent

npm ERR! Log files were not written due to an error writing to the directory: /tmp/.npm-cache/_logs
npm ERR! You can rerun the command with `--loglevel=verbose` to see the logs in your terminal
```

[SOLUTION]: Remove unused Docker space `docker system prune --help`
