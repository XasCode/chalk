# Steps for merging upstream changes

## Setup

1. git remote -v
1. git remote add upstream <https://github.com/chalk/chalk.git>
1. git remote -v

## Fetch from upstream and merge

1. git checkout main
1. git fetch upstream
1. git merge upstream/main
