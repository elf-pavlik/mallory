<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { RouterLink } from "vue-router";
import mockData from "../mock-data.json";
import mockContent from "../mock-content";
import Preview from "../components/Preview.vue";

interface FileNode {
  name: string;
}

const route = useRoute();
const selectedFile = ref<FileNode | null>(null);
const isModalOpen = ref(false);

// Get current path from route
const currentPath = computed(() => {
  const pathParam = route.params.path;
  if (!pathParam || (Array.isArray(pathParam) && pathParam.length === 0)) {
    return "";
  }
  const pathString = Array.isArray(pathParam) ? pathParam.join("/") : pathParam;
  return pathString;
});

// Get children for the current path from flat structure
const currentChildren = computed(() => {
  const path = currentPath.value;
  const pathPrefix = path ? path + "/" : "";

  // Filter items that are direct children of the current path
  return mockData
    .filter((item) => {
      // For root level (empty path), show items with exactly 1 segment
      if (!path) {
        const segments = item.name.split("/").filter(Boolean);
        return segments.length === 1;
      }

      // For nested paths, show items that start with the path prefix
      // and are direct children (only one more segment)
      if (!item.name.startsWith(pathPrefix)) {
        return false;
      }

      // Get the relative path after the current path
      const relativePath = item.name.slice(pathPrefix.length);
      const relativeSegments = relativePath.split("/").filter(Boolean);

      // Direct children have exactly one segment
      return relativeSegments.length === 1;
    })
    .sort((a) => {
      return a.name.includes(".") ? 1 : -1;
    });
});

// Function to get the route path for an item
function getItemPath(item: FileNode): string {
  // Extract path segments from item name (e.g., "src/components/Button.tsx" -> ["src", "components", "Button.tsx"])
  const segments = item.name.split("/").filter(Boolean);
  // Build the route path
  return "/" + segments.join("/");
}

// Function to get the display name (last segment of the path)
function getDisplayName(item: FileNode): string {
  const segments = item.name.split("/").filter(Boolean);
  return segments[segments.length - 1] || item.name;
}

// Function to check if item is a folder (ends with /)
function isFolder(item: FileNode): boolean {
  return item.name.endsWith("/");
}

// Function to get file extension
function getFileExtension(item: FileNode): string {
  const displayName = getDisplayName(item);
  const lastDot = displayName.lastIndexOf(".");
  return lastDot > 0 ? displayName.slice(lastDot + 1) : "";
}

// Function to get icon name based on file type
function getIconName(item: FileNode): string {
  if (isFolder(item)) {
    return "i-heroicons-folder";
  }
  return "i-heroicons-document";
}

// Function to handle file click
function handleFileClick(item: FileNode) {
  selectedFile.value = item;
  isModalOpen.value = true;
}

// Function to get file content from mock-content
function getFileContent(path: string): string {
  // Get content for file note 5: "src/pages/Home.tsx"
  return mockContent[path] || "";
}

// Function to map file extension to language for syntax highlighting
function getLanguageFromExtension(ext: string): string {
  return "turtle";
}
</script>

<template>
  <div>
    <UPageList v-if="currentChildren.length > 0">
      <template v-for="(item, index) in currentChildren" :key="index">
        <!-- Folders: Use RouterLink for navigation -->
        <RouterLink
          v-if="isFolder(item)"
          :to="getItemPath(item)"
          class="block mb-2"
        >
          <UCard
            variant="subtle"
            class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer border-0"
          >
            <div class="flex items-center gap-3">
              <UIcon
                :name="getIconName(item)"
                class="w-5 h-5 shrink-0"
                :class="isFolder(item) ? 'text-blue-500' : 'text-gray-500'"
              />
              <div class="flex-1 min-w-0">
                <h3
                  class="font-medium text-gray-900 dark:text-gray-100 truncate"
                >
                  {{ getDisplayName(item) }}
                </h3>
              </div>
              <UIcon
                name="i-heroicons-chevron-right"
                class="w-4 h-4 text-gray-400 shrink-0"
              />
            </div>
          </UCard>
        </RouterLink>

        <!-- Files: Use div with click handler, no navigation -->
        <div v-else class="block mb-2" @click="handleFileClick(item)">
          <UCard
            variant="subtle"
            class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer border-0"
          >
            <div class="flex items-center gap-3">
              <UIcon
                :name="getIconName(item)"
                class="w-5 h-5 shrink-0 text-gray-500"
              />
              <div class="flex-1 min-w-0">
                <h3
                  class="font-medium text-gray-900 dark:text-gray-100 truncate"
                >
                  {{ getDisplayName(item) }}
                </h3>
              </div>
              <UIcon
                name="i-heroicons-chevron-right"
                class="w-4 h-4 text-gray-400 shrink-0"
              />
            </div>
          </UCard>
        </div>
      </template>
    </UPageList>
    <UEmpty
      v-else
      icon="i-heroicons-folder-open"
      description="No items found in this directory"
    />

    <!-- File Modal -->
    <UModal
      v-model:open="isModalOpen"
      :title="selectedFile ? getDisplayName(selectedFile) : ''"
      :ui="{ content: 'w-full max-w-6xl' }"
    >
      <template #body>
        <Preview
          v-if="selectedFile"
          :code="getFileContent(selectedFile.name)"
          :lang="getLanguageFromExtension(getFileExtension(selectedFile))"
        />
      </template>
    </UModal>
  </div>
</template>
