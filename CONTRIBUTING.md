# Contributing to HoopGlow

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features

## We Develop with GitHub

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Branch Organisation

Here's an overview of our branch structure and the purpose each one serves in our development workflow:

- **main**: The primary branch containing the stable release of the project. All feature and bug fix branches are merged into `main` after thorough testing.

- **development**: Our active development branch. All features and fixes are merged here for integration testing. Once stable, changes are merged into the `main` branch.

- **feature/** branches: Specific branches created for developing new features or significant updates. Name these branches with the prefix `feature/`, followed by a short, descriptive name related to the update, like `feature/new-light-sequence` or `feature/3d-bracket-design`. Upon completion and review, feature branches are merged into the `development` branch.

- **docs**: Reserved for updates and maintenance of project documentation. Significant documentation changes are reviewed here before merging with the main content.

- **hotfix/** branches: Used for urgent fixes, these branches are based on `main` and are intended to address critical bugs in the stable release. After resolving the issue, they are merged back into both `main` and `development` to ensure consistency.

Please follow these guidelines for branch interactions and keep communications clear when preparing pull requests. This ensures a streamlined, efficient development process beneficial to all contributors.

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project.

## Submitting Changes

Please send a [GitHub Pull Request to HoopGlow](https://github.com/Makerspace-Ashoka/HoopGlow/pull/new/development) with a clear list of what you've done (read more about [pull requests](http://help.github.com/pull-requests/)). Please follow our coding conventions (below) and make sure all of your commits are atomic (one feature per commit).

Always write a clear log message for your commits. One-line messages are fine for small changes, but bigger changes should look like this:

```sh
git commit -m "Refactor subsystem X for readability" -m "\nThis simplifies the implementation of X and separates concerns for future enhancements. It primarily involves refactoring Y to improve modularity and prepare for the subsequent integration of feature Z."
```

The idea is for our commits to NOT end up [here](https://twitter.com/gitlost). Refer to our [commit guidelines](https://github.com/Makerspace-Ashoka/HoopGlow#git-commit-guidelines) for more information.

## Coding Conventions

Start reading our code and you'll get the hang of it. We optimise for readability:

- We indent using two spaces (soft tabs)
- We use ESLint to ensure consistency with everything JS
- This is open-source software. Consider the people who will read your code, and make it look nice for them.

Thank you for your contributions!
