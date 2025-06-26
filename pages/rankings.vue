<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-6">Tournament Rankings</h1>
    
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{{ error }}</p>
      <button @click="refreshRankings" class="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded">
        Try Again
      </button>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="allStandings.length === 0" class="text-center my-8">
      <div class="text-gray-400 text-6xl mb-4">🏆</div>
      <p class="text-gray-600 text-lg">No tournaments found.</p>
      <p class="text-gray-500 mt-2">Check back later for tournament rankings!</p>
    </div>
    
    <!-- Tournament filter tabs -->
    <div v-else class="mb-6">
      <div class="flex flex-wrap gap-2 mb-6">
        <button
          @click="selectedTournamentId = null"
          :class="[
            'py-1 px-3 rounded transition-colors',
            selectedTournamentId === null
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          ]"
        >
          All Tournaments
        </button>
        <button
          v-for="standing in allStandings"
          :key="standing.tournament.id"
          @click="selectedTournamentId = standing.tournament.id"
          :class="[
            'py-1 px-3 rounded transition-colors',
            selectedTournamentId === standing.tournament.id
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          ]"
        >
          {{ standing.tournament.name }}
        </button>
      </div>

      <!-- Tournament standings -->
      <div class="space-y-6">
        <div
          v-for="standing in filteredStandings"
          :key="standing.tournament.id"
          class="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden"
        >
          <!-- Tournament header -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
            <div class="flex justify-between items-center">
              <div>
                <h2 class="text-2xl font-bold">{{ standing.tournament.name }}</h2>
                <p v-if="standing.tournament.description" class="text-blue-100 mt-1">
                  {{ standing.tournament.description }}
                </p>
                <p class="text-blue-100 text-sm mt-1">
                  {{ formatDate(standing.tournament.date) }}
                </p>
              </div>
              <div class="text-right">
                <span
                  :class="[
                    'py-1 px-3 rounded',
                    standing.tournament.isActive
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-200 text-gray-700'
                  ]"
                >
                  {{ standing.tournament.isActive ? 'Active' : 'Completed' }}
                </span>
                <p class="text-blue-100 text-sm mt-2">
                  {{ standing.standings.length }} {{ standing.standings.length === 1 ? 'player' : 'players' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Standings content -->
          <div class="p-6">
            <div v-if="standing.standings.length === 0" class="text-center my-8">
              <div class="text-gray-400 text-4xl mb-2">🎯</div>
              <p class="text-gray-600">No results recorded for this tournament yet.</p>
            </div>
            
            <div v-else class="space-y-4">
              <div
                v-for="result in standing.standings"
                :key="result.user.id"
                :class="[
                  'bg-white shadow-md rounded-lg p-4 border border-gray-200 flex justify-between items-center',
                  result.rank <= 3 ? 'bg-yellow-50 border-yellow-200' : ''
                ]"
              >
                <!-- Player info -->
                <div class="flex items-center space-x-4">
                  <!-- Rank -->
                  <div class="flex items-center">
                    <span 
                      :class="[
                        'text-xl font-bold mr-2',
                        result.rank === 1 ? 'text-yellow-600' :
                        result.rank === 2 ? 'text-gray-500' :
                        result.rank === 3 ? 'text-yellow-700' :
                        'text-gray-900'
                      ]"
                    >
                      #{{ result.rank }}
                    </span>
                    <span v-if="result.rank === 1" class="text-xl">🏆</span>
                    <span v-else-if="result.rank === 2" class="text-xl">🥈</span>
                    <span v-else-if="result.rank === 3" class="text-xl">🥉</span>
                  </div>

                  <!-- Player details -->
                  <div class="flex items-center">
                    <img
                      v-if="result.user.picture"
                      :src="result.user.picture"
                      :alt="result.user.firstName"
                      class="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <div class="font-semibold text-gray-900">
                        {{ result.user.firstName }} {{ result.user.lastName }}
                      </div>
                      <div v-if="result.user.username" class="text-sm text-gray-600">
                        @{{ result.user.username }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Stats -->
                <div class="flex items-center space-x-6">
                  <!-- Record -->
                  <div class="text-center">
                    <div class="flex items-center space-x-2">
                      <span class="bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded text-sm">
                        {{ result.wins }}W
                      </span>
                      <span class="text-gray-400">-</span>
                      <span class="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-sm">
                        {{ result.losses }}L
                      </span>
                    </div>
                    <div class="text-xs text-gray-500 mt-1">
                      {{ result.totalGames }} {{ result.totalGames === 1 ? 'game' : 'games' }}
                    </div>
                  </div>

                  <!-- Win rate -->
                  <div class="text-center min-w-[100px]">
                    <div class="flex items-center justify-center mb-1">
                      <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          :style="{ width: (result.winRate * 100) + '%' }"
                        ></div>
                      </div>
                      <span class="text-sm font-semibold text-gray-900">
                        {{ (result.winRate * 100).toFixed(1) }}%
                      </span>
                    </div>
                    <div class="text-xs text-gray-500">Win Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Overall statistics -->
      <div v-if="selectedTournamentId === null && allStandings.length > 1" class="bg-white shadow-md rounded-lg p-6 border border-gray-200 mt-6">
        <h2 class="text-2xl font-bold mb-4">Tournament Statistics</h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 mb-2">{{ allStandings.length }}</div>
            <div class="text-gray-600">Total Tournaments</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600 mb-2">{{ activeTournaments }}</div>
            <div class="text-gray-600">Active Tournaments</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600 mb-2">{{ totalPlayers }}</div>
            <div class="text-gray-600">Total Players</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-orange-600 mb-2">{{ totalGames }}</div>
            <div class="text-gray-600">Total Games</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTournamentStore } from '~/stores/tournament';
import { onMounted, ref, computed } from 'vue';

// Store
const tournamentStore = useTournamentStore();
const { allStandings, loading, error } = storeToRefs(tournamentStore);

// Local state
const selectedTournamentId = ref(null);

// Computed properties
const filteredStandings = computed(() => {
  if (selectedTournamentId.value === null) {
    return allStandings.value;
  }
  return allStandings.value.filter(
    standing => standing.tournament.id === selectedTournamentId.value
  );
});

const activeTournaments = computed(() => {
  return allStandings.value.filter(standing => standing.tournament.isActive).length;
});

const totalPlayers = computed(() => {
  const allPlayerIds = new Set();
  allStandings.value.forEach(standing => {
    standing.standings.forEach(result => {
      allPlayerIds.add(result.user.id);
    });
  });
  return allPlayerIds.size;
});

const totalGames = computed(() => {
  return allStandings.value.reduce((total, standing) => {
    return total + standing.standings.reduce((tournamentTotal, result) => {
      return tournamentTotal + result.totalGames;
    }, 0);
  }, 0);
});

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const refreshRankings = async () => {
  await tournamentStore.fetchAllStandings();
};

// Load data on mount
onMounted(async () => {
  await tournamentStore.fetchAllStandings();
});

// SEO Meta
useHead({
  title: 'Tournament Rankings',
  meta: [
    { name: 'description', content: 'View tournament standings and player rankings for MTG tournaments.' }
  ]
});
</script>