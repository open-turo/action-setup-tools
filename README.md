# `open-turo/action-setup-tools`

## Description

GitHub Action that installs and provisions supported tools for workflow steps in
self-hosted runners. This relies on the agent having supported tooling
installed.

<!-- TODO: Add back badges here when they're not all broken -->

This action works with the following tooling and repository files:

- [goenv](https://github.com/syndbg/goenv) - `.go-version`
- [nodenv](https://github.com/nodenv/nodenv) - `.node-version`
- [pyenv](https://github.com/pyenv/pyenv) - `.python-version`
- [sdkman](https://sdkman.io/) - `.sdkmanrc`
- [tfenv](https://github.com/tfutils/tfenv) - `.terraform-version`

Attempts to use configuration provided in the directory structure for each tool,
but this can be overridden with additional configuration in the action.

## Usage

The Action relies on the checked out repository or workspace to have existing
configuration files, for each tool, present in the root level of the repository.
The Action takes no inputs and reads these configuration files, such as
`.node-version`, to configure the tooling correctly for the workflow.

```yaml
name: CI
on:
    pull_request:
        branches:
            - "main"
jobs:
    my-job:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout
              uses: actions/checkout@v3
            - name: Setup tools
              uses: open-turo/action-setup-tools@v1
            - name: Output current environment
              run: env | sort
```

## Outputs

| parameter | description                                                            |
| --------- | ---------------------------------------------------------------------- |
| go        | The version of golang that has been installed and is ready for use.    |
| node      | The verison of Node.js that has been installed and is ready for use.   |
| java      | The version of Java that has been installed and is ready for use.      |
| python    | The version of Python that has been installed and is ready for use.    |
| terraform | The version of Terraform that has been installed and is ready for use. |

## Supported Tools

The following tool platforms are supported for configuration but not
installation. If you are using a self-hosted runner you must pre-install these,
or if you're using a hosted runner they must be installed separately.

### Golang

By default the action will look for a `.go-version` file in the root level
directory. If present it will setup the Golang environment to use that version
of `go`, installing the specified version if necessary.

The Go tools are made available via [goenv](https://github.com/syndbg/goenv).

### Java and Kotlin

By default the action will look for a `.sdkmanrc` file in the root level
directory. If present and if specifies a `java` version it will setup the sdkman
environment to use that version of `java`, installing it if necessary. More
information about `sdkman` can be found [here](https://sdkman.io/). Note that
the java version identifier is an sdkman version identifier that includes a
vendor identifier after a dash to indicate which vendor supplies the identified
version.

Note that because [sdkman](https://sdkman.io/) supports other tools like Kotlin,
future support for additional tools via this Action is possible.

### Node.js

By default the action will look for a `.node-version` file in the root level
directory. If present it will setup the node environment to use that version of
node, installing the specified version if necessary.

This will also attempt to install the `yarn` command and make it available to
future steps in the workflow.

The Node.js tools are made available via [nodenv](https://github.com/nodenv/nodenv).

### Python

By default the action will look for a `.python-version` file in the root level
directory. If present it will setup the Python environment to use that version
of python, installing the specified version if necessary.

This will also make the `pip` available for future steps in the workflow.

The Python tools are made available via [pyenv](https://github.com/pyenv/pyenv).

### Terraform

By default the action will look for a `.terraform-version` file in the root
level directory. If present it will setup the environment to use that version of
`terraform`, installing the specified version if necessary.

Terraform is made available via [tfenv](https://github.com/tfutils/tfenv).

## Advanced sub-action usage

This repository exports a sub-action, `open-turo/action-setup-tools/versions@v1`
which allows you to specify the exact version of the tools that you wish to use,
even if they do not have configuration files present in the repository root or
workspace.

This is not the recommended usage of this action since it can produce
different results in CI or in your local environment and is more difficult to
maintain than using `.*-version` files.

**Do not use this sub-action except in test workflows with fixed specific version
*requirements.**

```yaml
name: CI
on:
    pull_request:
        branches:
            - "main"
jobs:
    my-job:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout
              uses: actions/checkout@v3
            - name: Configure fixed test versions
              uses: open-turo/action-setup-tools/versions@v1
              with:
                  go: 1.17.6
                  java: 17.0.2-tem
                  node: 16.14.2
                  python: 3.10.2
                  terraform: 1.1.5
            - name: Output current environment
              run: env | sort
```

### Inputs

| parameter | description                                  | required | default |
| --------- | -------------------------------------------- | -------- | ------- |
| go        | The desired version of golang to install.    | `false`  |         |
| node      | The desired version of Node.js to install.   | `false`  |         |
| java      | The desired version of Java to install.      | `false`  |         |
| python    | The desired version of Python to install.    | `false`  |         |
| terraform | The desired version of Terraform to install. | `false`  |         |

### Outputs

| parameter | description                                                            |
| --------- | ---------------------------------------------------------------------- |
| go        | The version of golang that has been installed and is ready for use.    |
| node      | The version of Node.js that has been installed and is ready for use.   |
| java      | The version of Java that has been installed and is ready for use.      |
| python    | The version of Python that has been installed and is ready for use.    |
| terraform | The version of Terraform that has been installed and is ready for use. |

## Runs

This Action is an `node16` action.

## Get Help

Please review Issues, post new Issues against this repository as needed.

## Contributions

Please see [here](https://github.com/open-turo/contributions) for guidelines on
how to contribute to this project.
