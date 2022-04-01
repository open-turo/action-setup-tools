# action-setup-tools

<!-- TODO: Add back badges here when they're not all broken -->

Provisions supported tools for workflow steps in self-hosted runners. This
relies on the agent having supported tooling installed. This action works with
the following tooling:

-   [goenv](https://github.com/syndbg/goenv)
-   [nodenv](https://github.com/nodenv/nodenv)
-   [pyenv](https://github.com/pyenv/pyenv)
-   [sdkman](https://sdkman.io/)
-   [tfenv](https://github.com/tfutils/tfenv)

Attempts to use configuration provided in the directory structure for each tool,
but this can be overridden with additional configuration in the action.

## Usage

This section describes usage of the action.

### Basic

The action in its basic usage relies on the checked out repository or workspace
to have existing configuration files for each tool.

It takes no inputs and reads these files, such as `.node-version`, to configure
the tooling correctly for the workflow.

```yaml
name: CI
on:
    push:
        branches:
            - "main"
    pull_request:
        branches:
            - "main"
jobs:
    my-job:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout
              uses: actions/checkout@v2
            - name: Setup tools
              uses: open-turo/action-setup-tools@v1
            - name: Output current environment
              run: env | sort
```

### Supported Tools

The following tool platforms are supported for configuration but not
installation. If you are using a self-hosted runner you must pre-install these,
or if you're using a hosted runner they must be installed separately.

#### golang

By default the action will look for a `.go-version` file in the current
directory. If present it will setup the Golang environment to use that version
of `go`, installing the specified version if necessary.

#### java

By default the action will look for a `.sdkmanrc` file in the current directory.
If present and if specifies a java version it will setup the sdkman environment
to use that version of java, installing it if necessary. More information about
`sdkman` can be found [here](https://sdkman.io/). Note that the java version
identifier is an sdkman version identifier that includes a vendor identifier
after a dash to indicate which vendor supplies the identified version.

#### node

By default the action will look for a `.node-version` file in the current
directory. If present it will setup the node environment to use that version of
node, installing the specified version if necessary.

#### python

By default the action will look for a `.python-version` file in the current
directory. If present it will setup the Python environment to use that version
of python, installing the specified version if necessary.

#### terraform

By default the action will look for a `.terraform-version` file in the current
directory. If present it will setup the environment to use that version of
`terraform`, installing the specified version if necessary.

### Advanced usage

This repository exports a sub-action, `open-turo/action-setup-tools/versions@v1`
which allows you to specify the exact version of the tools that you wish to use,
even if they do not have configuration files present in the repository root or
workspace.

This is not the recommended usage of this action since it can produce
differentiated results in CI or in your local environment.

```yaml
name: CI
on:
    push:
        branches:
            - "main"
    pull_request:
        branches:
            - "main"
jobs:
    my-job:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout
              uses: actions/checkout@v2
            - name: Setup tools
              uses: open-turo/action-setup-tools/versions@v1
              with:
                  go: 1.17.6
                  java: 17.0.2-tem
                  node: 16.13.2
                  python: 3.10.2
                  terraform: 1.1.5
            - name: Output current environment
              run: env | sort
```

#### Inputs

<!-- AUTO-DOC-INPUT:START - Do not remove or modify this section -->

| INPUT     | TYPE   | REQUIRED | DEFAULT | DESCRIPTION                      |
| --------- | ------ | -------- | ------- | -------------------------------- |
| go        | string | false    |         | The Go version to use<br>        |
| java      | string | false    |         | The Java version to use<br>      |
| kotlin    | string | false    |         | The Kotlin version to use<br>    |
| node      | string | false    |         | The Node.js version to use<br>   |
| python    | string | false    |         | The Python version to use<br>    |
| terraform | string | false    |         | The Terraform version to use<br> |

<!-- AUTO-DOC-INPUT:END -->

#### Outputs

<!-- AUTO-DOC-OUTPUT:START - Do not remove or modify this section -->

| OUTPUT    | TYPE   | DESCRIPTION                |
| --------- | ------ | -------------------------- |
| go        | string | The Go version used        |
| java      | string | The Java version used      |
| kotlin    | string | The Kotlin version used    |
| node      | string | The Node.js version used   |
| python    | string | The Python version used    |
| terraform | string | The Terraform version used |

<!-- AUTO-DOC-OUTPUT:END -->
