<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Button, ConfirmDialog, Drawer, Toast } from 'primevue'

const showMenu = ref(false)
const isDark = ref(document.documentElement.classList.contains('app-dark'))
const route = useRoute()

watch(
  () => route.fullPath,
  () => {
    showMenu.value = false
  },
)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('app-dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}
</script>
<template>
  <Toast />
  <ConfirmDialog />
  <div class="min-h-screen bg-surface-50 dark:bg-surface-950 text-color lg:flex">
    <aside
      class="max-lg:hidden flex flex-col w-60 shrink-0 p-4 border-r border-surface bg-surface-0 dark:bg-surface-900 lg:sticky lg:top-0 lg:h-screen"
    >
      <div class="mb-4 text-xl font-semibold">Resurtido</div>
      <RouterLink to="/" class="flex items-center gap-2 p-2 rounded hover:bg-emphasis">
        <i class="pi pi-th-large"></i>
        Anaqueles
      </RouterLink>
      <Button
        :label="isDark ? 'Modo claro' : 'Modo oscuro'"
        :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
        text
        severity="secondary"
        class="mt-auto justify-start!"
        @click="toggleTheme"
      />
    </aside>

    <header class="lg:hidden flex items-center gap-2 p-2 border-b border-surface">
      <Button
        icon="pi pi-bars"
        text
        rounded
        severity="secondary"
        aria-label="Abrir menú"
        @click="showMenu = true"
      />
      <span class="text-xl font-semibold">Resurtido</span>
    </header>

    <Drawer v-model:visible="showMenu" header="Resurtido">
      <div class="flex flex-col h-full">
        <RouterLink to="/" class="flex items-center gap-2 p-2 rounded hover:bg-emphasis">
          <i class="pi pi-th-large"></i>
          Anaqueles
        </RouterLink>
        <Button
          :label="isDark ? 'Modo claro' : 'Modo oscuro'"
          :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
          text
          severity="secondary"
          class="mt-auto justify-start!"
          @click="toggleTheme"
        />
      </div>
    </Drawer>

    <main class="flex-1 min-w-0 p-4 lg:p-6">
      <RouterView />
    </main>
  </div>
</template>
