# COMPSCI 426 Scalable Web Systems

The web has become a large and complex area for application development. Access to an abundance of open source languages, libraries, and frameworks has led to the quick and easy construction of a variety of applications with several moving parts working in coordination to present to the user the illusion of a single program. In reality, web applications are extremely difficult to get right. They involve a large collection of coordinated services, multiple databases, complicated user interfaces, security and performance issues, and ever changing 3rd party services, spread across physical and virtual machines. These complications are further stressed by the large number of concurrent users that access these applications every second. This course will investigate several well known web-based applications and the technology and software architecture used to scale these applications. We will also study a specific topic related to scalability in software design in the context of web application architecture. This course counts as an Elective for the CS and INFORM Majors. Prerequisite: COMPSCI 320 or COMPSCI 326 with a grade of C or better. 3 credits.

**Instructor**: Tim Richards

## Repository Structure

- The `README.md` is this file.
- Each branch corresponds to one of the following:
  - `main`: Contains general information.
  - `lectures`: Contains lecture notes and materials.
  - `activities`: Contains in-class activities.
  - `exercises`: Contains coding exercises for the course.
  - `labs`: Contains lab assignments and instructions.
  - `homework`: Contains homework assignments and instructions.
  - `projects`: Contains project information and related materials.

## Prerequisite Software

Before you begin working with this repository, ensure that you have the following software installed on your machine:

- [Git](https://git-scm.com/downloads): Version control system to manage and track changes in your code.
- [A Code Editor](https://code.visualstudio.com/download): To edit and manage your code files.
- [Web Browser](https://www.google.com/chrome/): To test and view your web applications.
- [Node.js and npm](https://nodejs.org/en/download/): JavaScript runtime and package manager for managing dependencies.

## Git Assumptions

This repository assumes that you have a working knowledge of Git and GitHub. If you are unfamiliar with these tools, please refer to the following documentation:

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Documentation](https://docs.github.com/en)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [VS Code Git Documentation](https://code.visualstudio.com/docs/editor/versioncontrol)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Git Cheat Sheet by Atlassian](https://www.atlassian.com/git/tutorials/atlassian-git-cheatsheet)
- [Git Cheat Sheet by Git Tower](https://www.git-tower.com/blog/git-cheat-sheet/)

## Command Line Assumptions

We also assume you are capable of using a terminal/command line interface to run Git commands. If you are feeling unsure about this, please refer to the following resources for Linux/Mac or Windows command line tutorials:

- [Command Line Crash Course](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line)

## Cloning the Repository

To clone the repository, use the following command:

```bash
git clone https://github.com/umass-cs-426/scheduling-app.git
```

Make sure to do this inside of a folder where you want the repository to be located.

## Branching

This repository uses multiple branches to organize different types of content. You can switch between branches using the following command:

```bash
git checkout <branch-name>
```

Replace `<branch-name>` with the name of the branch you want to switch to (e.g., `activities`, `exercises`, `labs`, `homework`, `projects`).

## Keeping Your Local Repository Updated

To keep your local repository updated with the latest changes from the remote repository, use the following commands:

```bash
git checkout main
git pull origin main
```

Then, for each branch you want to update, switch to that branch and pull the latest changes:

```bash
git checkout <branch-name>
git pull origin <branch-name>
```

Replace `<branch-name>` with the name of the branch you want to update.

## Saving Your Work

If you make changes to any files in the repository and want to save your work (such as completing exercises), use the following commands:

```bash
git add .
git commit -m "Your commit message here"
```

Replace `<branch-name>` with the name of the branch you are working on. Make sure to provide a meaningful commit message that describes the changes you made.

You are not able to push changes to our remote repository. If you want to save your changes remotely, consider forking the repository on GitHub and pushing your changes to your fork.

We will not help you with how to set this up, but it is a useful skill to learn on your own.

## VS Code Git Integration

Naturally, you can run all of the above commands using VS Code's built-in Git integration. For more information on how to use Git within VS Code, refer to the [VS Code Git Documentation](https://code.visualstudio.com/docs/editor/versioncontrol).

One of the many useful feature of VS Code is the ability to open a specific branch directly. To do this, open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P on Mac) and type "Git: Checkout to..." and select the desired branch from the list.
