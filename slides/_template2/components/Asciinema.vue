<template>
  <div
    ref="playerContainer"
    class="asciinema-wrapper"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps(['src', 'rows'])
const playerContainer = ref(null)

const loadAsset = (tag, attributes) => {
  return new Promise(resolve => {
    const el = document.createElement(tag)
    Object.assign(el, attributes)
    el.onload = resolve
    document.head.appendChild(el)
  })
}

onMounted(async () => {
  // Manually inject if they aren't there
  if (!document.querySelector('link[href="/asciinema-player.css"]')) {
    await loadAsset('link', {
      rel: 'stylesheet',
      href: '/asciinema-player.css',
    })
  }
  if (!window.AsciinemaPlayer) {
    await loadAsset('script', { src: '/asciinema-player.min.js' })
  }

  // Initialize once loaded
  if (window.AsciinemaPlayer) {
    window.AsciinemaPlayer.create(props.src, playerContainer.value, {
      rows: props.rows || 20,
      autoPlay: true,
      preload: true,
    })
  }
})
</script>

<style scoped>
.asciinema-wrapper {
  min-height: 300px;
  width: 100%;
  background: black;
}
</style>
