<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# mask-action

Github Action to automatically run (or just help you to install) [mask][] task runner.

[mask]: https://github.com/jakedeichert/mask

## Example Usage

1. Given this `maskfile.md`
~~~md
# Tasks

## run
> Run all projects

```sh
make run
```

### run examples
> Run all examples

```sh
cargo run --examples
```

### run executables
> Run all executables code in the project

```sh
cargo run --bins
```
~~~

2. To run task `run examples`, you can declare the action like:
```yml
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: ./
      with: { commands: run examples }
```

- It's also possible to run multiple tasks:
```yml
    - uses: ./
      with:
        commands: |-
          run executables
          run examples
```

- There is also an option to run them in parallel:
```yml
    - uses: ./
      with:
        parallel: true
        commands: |-
          run executables
          run examples
```
