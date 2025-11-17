<script setup lang="ts">
import { computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import type { BreadcrumbItem } from "@nuxt/ui";

const route = useRoute();

// Get breadcrumb items from route path segments
const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  // Get the path parameter from the route
  const pathParam = route.params.path;

  // If no path, return empty array or just home
  if (!pathParam || (Array.isArray(pathParam) && pathParam.length === 0)) {
    return [];
  }

  // Convert path param to array of segments
  const pathString = Array.isArray(pathParam) ? pathParam.join("/") : pathParam;
  const segments = pathString.split("/").filter(Boolean);

  // Build breadcrumb items from segments
  // Each item links to the accumulated path up to that segment
  return segments.map((segment, index) => {
    // Build the path up to this segment
    const pathToSegment = "/" + segments.slice(0, index + 1).join("/");

    return {
      label: segment,
      to: pathToSegment,
    };
  });
});
</script>

<template>
  <Suspense>
    <UApp>
      <UHeader>
        <template #left>
          <RouterLink to="/" class="flex items-center gap-2">
            <UIcon name="i-heroicons-folder" class="w-6 h-6" />
            <span class="font-semibold text-lg">Mallory Leaks</span>
          </RouterLink>
        </template>
      </UHeader>

      <UMain>
        <UContainer>
          <div class="py-4">
            <UBreadcrumb
              v-if="breadcrumbItems.length > 0"
              :items="breadcrumbItems"
            />
          </div>
          <RouterView />
        </UContainer>
      </UMain>
    </UApp>
  </Suspense>
</template>
