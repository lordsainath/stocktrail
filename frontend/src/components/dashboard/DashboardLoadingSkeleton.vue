<template>
  <div class="space-y-5 animate-pulse" aria-hidden="true">
    <div class="space-y-2">
      <div class="h-3 w-28 rounded bg-slate-200 dark:bg-slate-700" />
      <div class="h-7 w-64 rounded bg-slate-200 dark:bg-slate-700" />
    </div>

    <section>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="index in 8"
          :key="index"
          class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 space-y-2">
              <div class="h-5 w-16 rounded bg-slate-200 dark:bg-slate-700" />
              <div class="h-3 w-28 rounded bg-slate-200 dark:bg-slate-700" />
            </div>

            <div class="h-6 w-14 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>

          <div class="mt-4 flex items-end justify-between">
            <div class="space-y-2">
              <div class="h-3 w-10 rounded bg-slate-200 dark:bg-slate-700" />
              <div class="h-7 w-20 rounded bg-slate-200 dark:bg-slate-700" />
            </div>

            <div class="h-4 w-12 rounded bg-slate-200 dark:bg-slate-700" />
          </div>

          <div class="mt-4 h-20 rounded-xl bg-slate-100 dark:bg-slate-800/60" />

          <div class="mt-4 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
        </article>
      </div>
    </section>

    <section
      class="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
    >
      <div class="mb-3 flex items-center justify-between">
        <div class="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
        <div class="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
      </div>

      <div class="space-y-3">
        <div v-for="index in 5" :key="`news-${index}`" class="flex gap-3">
          <div class="h-12 w-12 rounded-md bg-slate-200 dark:bg-slate-700" />

          <div class="flex-1 space-y-2">
            <div class="flex items-start justify-between gap-2">
              <div class="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
              <div class="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
            </div>

            <div class="h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />
            <div class="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
