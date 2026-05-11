<template>
  <div class="animate-pulse space-y-5" aria-hidden="true">
    <section
      class="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-xl backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/90"
    >
      <div class="mb-5 h-9 w-24 rounded-xl bg-slate-200 dark:bg-slate-700" />

      <div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div class="flex gap-4">
          <div class="h-14 w-14 shrink-0 rounded-2xl bg-slate-200 dark:bg-slate-700" />

          <div class="space-y-2">
            <div class="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />

            <div class="h-7 w-48 rounded bg-slate-200 dark:bg-slate-700" />

            <div class="h-3 w-64 max-w-[70vw] rounded bg-slate-200 dark:bg-slate-700" />

            <div class="flex flex-wrap gap-2 pt-1">
              <div class="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />

              <div class="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />

              <div class="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        </div>

        <div class="sm:text-right">
          <div class="mt-3 space-y-2">
            <div class="ml-auto h-9 w-28 rounded bg-slate-200 dark:bg-slate-700" />

            <div class="ml-auto h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div
          v-for="index in 4"
          :key="index"
          class="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3 dark:border-slate-700/80 dark:bg-slate-800/40"
        >
          <div class="h-3 w-16 rounded bg-slate-200 dark:bg-slate-700" />

          <div class="mt-3 h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 gap-5 xl:grid-cols-4">
      <div
        class="xl:col-span-3 rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-xl backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/90"
      >
        <div class="mb-5 flex items-center justify-between">
          <div class="space-y-2">
            <div class="h-5 w-32 rounded bg-slate-200 dark:bg-slate-700" />

            <div class="h-9 w-36 rounded bg-slate-200 dark:bg-slate-700" />

            <div class="h-3 w-40 rounded bg-slate-200 dark:bg-slate-700" />
          </div>

          <div class="h-5 w-16 rounded bg-slate-200 dark:bg-slate-700" />
        </div>

        <div class="h-100 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60" />
      </div>

      <div
        class="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-xl backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/90"
      >
        <div class="space-y-3">
          <div class="h-6 w-24 rounded bg-slate-200 dark:bg-slate-700" />

          <div class="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
        </div>

        <div class="mt-5 space-y-4">
          <div class="h-10 w-full rounded-xl bg-slate-100 dark:bg-slate-800" />

          <div class="h-10 w-full rounded-xl bg-slate-100 dark:bg-slate-800" />

          <div class="h-10 w-full rounded-xl bg-slate-100 dark:bg-slate-800" />
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <div class="h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />

          <div class="h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </section>

    <section
      class="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-xl backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/90"
    >
      <div class="mb-4 space-y-2">
        <div class="h-5 w-28 rounded bg-slate-200 dark:bg-slate-700" />

        <div class="h-3 w-36 rounded bg-slate-200 dark:bg-slate-700" />
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div
          v-for="index in 4"
          :key="`news-${index}`"
          class="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-700/80 dark:bg-slate-800/40"
        >
          <div class="h-32 w-full rounded-xl bg-slate-200 dark:bg-slate-700" />

          <div class="mt-4 h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />

          <div class="mt-2 h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />

          <div class="mt-2 h-3 w-11/12 rounded bg-slate-200 dark:bg-slate-700" />

          <div class="mt-4 h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </section>
  </div>
</template>
