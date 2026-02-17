# Repository Guide for Students

This document explains what you need installed, how to clone the repo, and how
we use branches for lectures and exercises.

## What You Need Installed

Required:

- **Git**: to clone and switch branches
- **Node.js (LTS)** + **npm**: to install dependencies and run the app
- **Docker Desktop** (or Docker Engine): for the Docker lecture and exercises

Recommended:

- **VS Code** (or your preferred editor)

## Clone the Repository

From your terminal:

```bash
git clone https://github.com/umass-cs-426/scheduling-app.git
cd scheduling-app
```

If you already cloned it and need updates, see the **Fetch Updates** section.

## Branches in This Repository

Git branches let us keep multiple versions of the same codebase at once.
That means we can keep:

- **Lecture snapshots** (what the class should see)
- **Exercise starter states**
- **Exercise solutions**

### Why Branches Are Great (and Why We Use Them)

Branches let you switch between different states of the code instantly without
copying folders or losing work. In this course, that means you can:

- jump to a lecture state
- move to a later lecture without re‑cloning
- compare solutions vs. starter code

### Examples from This Repo

Your local branch list (examples on this machine):

- `main`
- `1.1-the-system-exists`
- `2.2-the-monolith-system-runs`
- `2.3-boundaries-create-freedom`
- `3.4-modular-monoliths`
- `4.5-docker-and-the-monolith`

Lecture branches generally match the numbering in the course materials.

## Switching Branches

Modern command:

```bash
git switch 4.5-docker-and-the-monolith
```

Older but still common:

```bash
git checkout 4.5-docker-and-the-monolith
```

To see what branches you have locally:

```bash
git branch
```

To see remote branches:

```bash
git branch -a
```

## Fetch Updates (Important)

New branches and updates do **not** appear on your machine automatically.
You must fetch them.

```bash
git fetch --all
```

If you skip `git fetch`, you will **not** see new lecture branches.

## Git Commands You Will Use (List + Examples)

- **Clone a repo**
  - `git clone <REPO_URL>`
- **Check current branch**
  - `git branch`
- **List all branches (local + remote)**
  - `git branch -a`
- **Switch branches (modern)**
  - `git switch <branch-name>`
- **Switch branches (legacy)**
  - `git checkout <branch-name>`
- **Fetch updates from remote**
  - `git fetch --all`
- **Pull latest commits for your current branch**
  - `git pull`

## Reference Links

Git command docs:

- [git clone](https://git-scm.com/docs/git-clone)
- [git branch](https://git-scm.com/docs/git-branch)
- [git switch](https://git-scm.com/docs/git-switch)
- [git checkout](https://git-scm.com/docs/git-checkout)
- [git fetch](https://git-scm.com/docs/git-fetch)
- [git pull](https://git-scm.com/docs/git-pull)

Learning Git:

- [Git Book (free)](https://git-scm.com/book/en/v2)
- [GitHub Git Guides](https://github.com/git-guides)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)
