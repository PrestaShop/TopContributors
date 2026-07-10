<script setup lang="ts">
import type { Contributor, Company, RankingEntry } from '@/types'

defineProps<{
  topContributors: Contributor[]
  topCompanies: Company[]
  topReviewers: RankingEntry[]
  topIssues: RankingEntry[]
  topPullRequests: RankingEntry[]
  topSecurity: RankingEntry[]
  updatedYear: number
}>()
</script>

<template>
  <section class="wof-section wof-top-section">
    <h2 class="wof-top-section__title puik-h1">
      PrestaShop Project’s top contributors
    </h2>
    <div class="wof-top-section__cards">
      <TopCompaniesView
        :top-companies="topCompanies"
        :updated-year="updatedYear"
      />
      <TopContributorsView
        :top-contributors="topContributors"
        :updated-year="updatedYear"
      />
      <TopRankingView
        v-if="topReviewers.length"
        title="👀 Top reviewers"
        description="They review pull requests to keep PrestaShop's quality high."
        count-label="Reviews"
        :items="topReviewers"
        :updated-year="updatedYear"
      />
      <TopRankingView
        v-if="topIssues.length"
        title="🐛 Top issue reporters"
        description="They report issues that help us improve PrestaShop."
        count-label="Issues"
        :items="topIssues"
        :updated-year="updatedYear"
      />
      <TopRankingView
        v-if="topPullRequests.length"
        title="🔀 Top PR authors"
        description="They open pull requests to move PrestaShop forward."
        count-label="Pull requests"
        :items="topPullRequests"
        :updated-year="updatedYear"
      />
      <TopRankingView
        v-if="topSecurity.length"
        title="🛡️ Top security contributors"
        description="They are credited on published security advisories — reporting the vulnerability or shipping the fix."
        count-label="Advisories"
        :items="topSecurity"
        :updated-year="updatedYear"
        :extra-columns="[
          { label: 'Research', value: 'research' },
          { label: 'Fixes', value: 'remediation' },
        ]"
      />
    </div>
  </section>
</template>

<style>
:root {
  --wof-top-section-padding: 2.5rem 1rem;
  --wof-top-section-padding-lg: 4rem;
  --wof-top-section-rank-first: #ffd999;
  --wof-top-section-rank-second: #eeeeee;
  --wof-top-section-rank-third: #e7bd94;
}

.wof-section.wof-top-section {
  padding: var(--wof-top-section-padding);
}
@media (min-width: 768px) {
  .wof-section.wof-top-section {
    padding: var(--wof-top-section-padding-lg);
  }
}
.wof-top-section__title {
  margin-bottom: 0;
}

.wof-top-section__cards {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}
.wof-top-section__rank {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.wof-top-section__rank span {
  line-height: 0;
}
.wof-top-section__rank--first {
  background-color: var(--wof-top-section-rank-first);
}
.wof-top-section__rank--second {
  background-color: var(--wof-top-section-rank-second);
}
.wof-top-section__rank--third {
  background-color: var(--wof-top-section-rank-third);
}
</style>
