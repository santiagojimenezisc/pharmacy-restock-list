<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Button, ConfirmDialog, Drawer, Toast } from 'primevue'

const showMenu = ref(false)
const route = useRoute()

watch(() => route.fullPath, () => {
  showMenu.value = false
})
</script>
<template>
  <Toast />
  <ConfirmDialog />
  <div class="min-h-screen lg:flex">
    <aside class="max-lg:hidden w-60 shrink-0 p-4 border-r border-surface lg:sticky lg:top-0 lg:h-screen">
      <div class="mb-4 text-xl font-semibold">Resurtido</div>
      <RouterLink to="/" class="flex items-center gap-2 p-2 rounded hover:bg-emphasis">
        <i class="pi pi-th-large"></i>
        Anaqueles
      </RouterLink>
    </aside>

    <header class="lg:hidden flex items-center gap-2 p-2 border-b border-surface">
      <Button icon="pi pi-bars" text rounded severity="secondary" aria-label="Abrir menú" @click="showMenu = true" />
      <span class="text-xl font-semibold">Resurtido</span>
    </header>

    <Drawer v-model:visible="showMenu" header="Resurtido">
      <RouterLink to="/" class="flex items-center gap-2 p-2 rounded hover:bg-emphasis">
        <i class="pi pi-th-large"></i>
        Anaqueles
      </RouterLink>
    </Drawer>

    <main class="flex-1 min-w-0 p-4 lg:p-6">
      <RouterView />
    </main>
  </div>
</template>
