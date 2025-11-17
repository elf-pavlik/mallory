<template>
  <pre class="prose-pre">
    <code v-html="highlighted"></code>
  </pre>
</template>

<script setup>
import { codeToHtml } from "shiki";
import { ref, onMounted } from "vue";

const props = defineProps({
  code: String,
  lang: { type: String, default: "js" },
});

const highlighted = ref("");

onMounted(async () => {
  highlighted.value = await codeToHtml(props.code, {
    lang: props.lang,
    theme: "github-dark",
  });
});
</script>

<style>
/* Copy the classes from @nuxtjs/mdc */
.prose-pre {
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: hidden;
  overflow-y: auto;
  background: #1e1e1e;
  width: 100%;
  max-width: 100%;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.prose-pre code {
  display: block;
  width: 100%;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
