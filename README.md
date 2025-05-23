# `open-turo/action-setup-tools`

<!-- prettier-ignore-start -->
<!-- action-docs-description -->
## Description

GitHub Action that installs and provisions supported tools for workflow steps in self-hosted runners. This relies on the agent having supported tooling installed.
<!-- action-docs-description -->
<!-- prettier-ignore-end -->

[![Release](https://img.shields.io/github/v/release/open-turo/action-setup-tools)](https://github.com/open-turo/action-setup-tools/releases/)
[![Tests pass/fail](https://img.shields.io/github/workflow/status/open-turo/action-setup-tools/CI)](https://github.com/open-turo/action-setup-tools/actions/)
[![License](https://img.shields.io/github/license/open-turo/action-setup-tools)](./LICENSE)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://github.com/dwyl/esta/issues)
![CI](https://github.com/open-turo/action-setup-tools/actions/workflows/release.yaml/badge.svg)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Conventional commits](https://img.shields.io/badge/conventional%20commits-1.0.2-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)
[![Join us!](https://img.shields.io/badge/Turo-Join%20us%21-593CFB.svg)](https://turo.com/jobs)

This action works with the following tooling and repository files (in order of
priority):

-   [goenv](https://github.com/syndbg/goenv) - `.go-version`
-   [nodenv](https://github.com/nodenv/nodenv) - `.node-version`, `.nvmrc`
-   [pyenv](https://github.com/pyenv/pyenv) - `.python-version`
-   [sdkman](https://sdkman.io/) - `.sdkmanrc`
-   [tfenv](https://github.com/tfutils/tfenv) - `.terraform-version`

Attempts to use configuration provided in the directory structure for each tool,
but this can be overridden with additional configuration in the action.

When used with self-hosted runners it's possible to pre-install the tooling you
desire and allow `action-setup-tools` to function as a version check in CI for
much faster workflows.

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

<!-- prettier-ignore-start -->
<!-- action-docs-inputs -->

<!-- action-docs-inputs -->

<!-- action-docs-outputs -->
## Outputs

| parameter | description |
| --- | --- |
| go | The version of golang that has been installed and is ready for use. |
| node | The verison of Node.js that has been installed and is ready for use. |
| java | The version of Java that has been installed and is ready for use. |
| python | The version of Python that has been installed and is ready for use. |
| terraform | The version of Terraform that has been installed and is ready for use. |
<!-- action-docs-outputs -->

<!-- action-docs-runs -->
## Runs

This action is a `node20` action.
<!-- action-docs-runs -->
<!-- prettier-ignore-end -->

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
future steps in the workflow. If a yarn version is not provided, right now we
only support installing yarn classic (i.e. v1.x) by default.

The Node.js tools are made available via
[nodenv](https://github.com/nodenv/nodenv).

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

This is not the recommended usage of this action since it can produce different
results in CI or in your local environment and is more difficult to maintain
than using `.*-version` files.

**Do not use this sub-action except in test workflows with fixed specific
version requirements.**

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
              uses: actions/checkout@v4
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

## Get Help

Please review Issues, post new Issues against this repository as needed.

## Local development

Ensure that you have installed locally the following tools:

-   [goenv](https://github.com/syndbg/goenv)
-   [nodenv](https://github.com/nodenv/nodenv)
-   [pyenv](https://github.com/pyenv/pyenv)
-   [sdkman](https://sdkman.io/)
-   [tfenv](https://github.com/tfutils/tfenv)

## Contributions

Please see [here](https://github.com/open-turo/contributions) for guidelines on
how to contribute to this project.
