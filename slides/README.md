# Slides

This folder stores Slidev decks. Each branch gets its own deck folder named after the branch.

## Convention

- `slides/<branch-name>/` holds a deck for that branch.
- `slides/_template/` contains a reusable starter deck.

## Create a new deck

1. Create the folder for your current branch name:
   ```sh
   mkdir -p "slides/$(git branch --show-current)"
   ```
2. Copy the template into the new folder:
   ```sh
   cp slides/_template/slides.md "slides/$(git branch --show-current)/slides.md"
   ```
3. Customize the title and agenda.

## Example

```sh
git branch --show-current
# feature-x
mkdir -p "slides/$(git branch --show-current)"
cp slides/_template/slides.md "slides/$(git branch --show-current)/slides.md"
```
