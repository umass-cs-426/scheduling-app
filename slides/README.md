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

## Interactive Code (Monaco)

The template includes Monaco editor examples:

- `{monaco}` creates an editable code block.
- `{monaco-run}` lets you execute code in the slide.

These features are provided by Slidev; no extra setup is needed beyond running Slidev.

## Terminal Demos (Asciinema)

Asciinema lets you record a real terminal session and embed it in slides.

### Install (macOS)

```sh
brew install asciinema
```

### Install (pipx)

```sh
pipx install asciinema
```

### Record and Play

```sh
asciinema rec demo.cast
asciinema play demo.cast
```

### Upload (optional)

```sh
asciinema upload demo.cast
```

### Local Hosting (Slidev)

1. Add a `public/` folder inside the deck:
   ```sh
   mkdir -p "slides/$(git branch --show-current)/public"
   ```
2. Copy the cast file:
   ```sh
   cp demo.cast "slides/$(git branch --show-current)/public/demo.cast"
   ```
3. Embed it in a slide using the asciinema player and `/demo.cast`.

## Example

```sh
git branch --show-current
# feature-x
mkdir -p "slides/$(git branch --show-current)"
cp slides/_template/slides.md "slides/$(git branch --show-current)/slides.md"
```
