# TrueMark Application Development Kit

## Building

The following commands will build the project.

```bash
rush install
rush build
```

The following commands will run tests.

```bash
rush test
```

## Publishing
The following commands will increment and publish a new version to
AWS CodeArtifact.

```bash
export NPM_AUTH_TOKEN="<<SECRET>>"
rush build
rush version --bump -b main
rush publish --include-all --apply --publish
```

## Add a Package

1. Create project inside packages folder
2. Add project to the bottom of rush.json in the root of this repository.
3. Execute ```rush update``` in the root of the repository
