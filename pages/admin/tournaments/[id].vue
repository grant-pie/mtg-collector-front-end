<template>
  <div>
    <Header 
      :title="tournament ? `${tournament.name} - Results` : 'Tournament Management'"
      :subtitle="tournament ? `Manage wins and losses for ${formatDate(tournament.date)}` : 'Loading tournament...'"
    />

    <!-- Back Button -->
    <div class="mt-4">
      <NuxtLink
        to="/admin"
        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        ← Back to Admin Dashboard
      </NuxtLink>
    </div>
    
    <div v-if="loading" class="text-center py-10">
      <p>Loading tournament data...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
      {{ error }}
    </div>
    
    <div v-else-if="tournament" class="mt-6 space-y-6">
      <!-- Tournament Info -->
      <div class="bg-white p-6 rounded shadow-md">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ tournament.name }}</h2>
            <p v-if="tournament.description" class="text-gray-600 mt-1">{{ tournament.description }}</p>
            <p class="text-sm text-gray-500 mt-2">{{ formatDate(tournament.date) }}</p>
          </div>
          <span
            :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              tournament.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            ]"
          >
            {{ tournament.isActive ? 'Active' : 'Inactive' }}
          </span>
        </div>
      </div>

      <!-- Quick Add Result Form -->
      <div class="bg-white p-6 rounded shadow-md">
        <h3 class="text-lg font-semibold mb-4">Quick Add/Update Result</h3>
        
        <form @submit.prevent="updateSingleResult" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">User</label>
              <select
                v-model="quickResult.userId"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a user</option>
                <option v-for="user in availableUsers" :key="user.id" :value="user.id">
                  {{ user.firstName }} {{ user.lastName }} {{ user.username ? `(${user.username})` : '' }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Wins</label>
              <input
                v-model.number="quickResult.wins"
                type="number"
                min="0"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Losses</label>
              <input
                v-model.number="quickResult.losses"
                type="number"
                min="0"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div class="flex items-end">
              <button
                type="submit"
                :disabled="loading"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {{ loading ? 'Updating...' : 'Update Result' }}
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Current Standings -->
      <div class="bg-white p-6 rounded shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Current Standings</h3>
          <div class="flex gap-2">
            <button
              @click="debugStandings"
              class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-sm"
            >
              Debug Data
            </button>
            <button
              @click="refreshStandings"
              :disabled="loading"
              class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm disabled:opacity-50"
            >
              {{ loading ? 'Refreshing...' : 'Refresh' }}
            </button>
          </div>
        </div>
        
        <div v-if="currentStandings && currentStandings.length > 0" class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead>
              <tr class="border-b">
                <th class="py-3 px-4 text-left">Rank</th>
                <th class="py-3 px-4 text-left">Player</th>
                <th class="py-3 px-4 text-center">Wins</th>
                <th class="py-3 px-4 text-center">Losses</th>
                <th class="py-3 px-4 text-center">Total Games</th>
                <th class="py-3 px-4 text-center">Win Rate</th>
                <th class="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="standing in currentStandings" :key="standing.user.id" class="border-b hover:bg-gray-50">
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <span class="font-semibold text-lg">#{{ standing.rank }}</span>
                    <span v-if="standing.rank === 1" class="ml-2 text-yellow-500">🏆</span>
                    <span v-else-if="standing.rank === 2" class="ml-2 text-gray-400">🥈</span>
                    <span v-else-if="standing.rank === 3" class="ml-2 text-yellow-600">🥉</span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img
                      v-if="standing.user.picture"
                      :src="standing.user.picture"
                      :alt="standing.user.firstName"
                      class="h-8 w-8 rounded-full mr-3"
                    />
                    <div>
                      <div class="font-medium">{{ standing.user.firstName }} {{ standing.user.lastName }}</div>
                      <div v-if="standing.user.username" class="text-sm text-gray-500">@{{ standing.user.username }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4 text-center">
                  <span class="font-semibold text-green-600">{{ standing.wins }}</span>
                </td>
                <td class="py-3 px-4 text-center">
                  <span class="font-semibold text-red-600">{{ standing.losses }}</span>
                </td>
                <td class="py-3 px-4 text-center">
                  <span class="text-gray-600">{{ standing.totalGames }}</span>
                </td>
                <td class="py-3 px-4 text-center">
                  <div class="flex items-center justify-center">
                    <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        class="bg-blue-600 h-2 rounded-full" 
                        :style="{ width: (standing.winRate * 100) + '%' }"
                      ></div>
                    </div>
                    <span class="font-medium">{{ (standing.winRate * 100).toFixed(1) }}%</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-center">
                  <button
                    @click="editPlayerResult(standing)"
                    class="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-else class="text-center py-8">
          <p class="text-gray-500">No results recorded yet. Add some results using the form above!</p>
        </div>
      </div>

      <!-- Bulk Update Section -->
      <div class="bg-white p-6 rounded shadow-md">
        <h3 class="text-lg font-semibold mb-4">Bulk Update Results</h3>
        <p class="text-sm text-gray-600 mb-4">
          Update multiple players' results at once. Leave wins/losses as 0 if you don't want to change them.
        </p>
        
        <form @submit.prevent="bulkUpdateResults" class="space-y-4">
          <div class="space-y-3">
            <div v-for="(result, index) in bulkResults" :key="index" class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded">
              <div>
                <label class="block text-sm font-medium text-gray-700">User</label>
                <select
                  v-model="result.userId"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select a user</option>
                  <option v-for="user in availableUsers" :key="user.id" :value="user.id">
                    {{ user.firstName }} {{ user.lastName }} {{ user.username ? `(${user.username})` : '' }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Wins</label>
                <input
                  v-model.number="result.wins"
                  type="number"
                  min="0"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Losses</label>
                <input
                  v-model.number="result.losses"
                  type="number"
                  min="0"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div class="flex items-end">
                <button
                  type="button"
                  @click="removeBulkResult(index)"
                  class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
          
          <div class="flex justify-between">
            <button
              type="button"
              @click="addBulkResult"
              class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Another Player
            </button>
            
            <button
              type="submit"
              :disabled="loading || !canSubmitBulk"
              class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {{ loading ? 'Updating...' : 'Update All Results' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Player Result Modal -->
    <div v-if="editingPlayer" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          Edit Results for {{ editingPlayer.user.firstName }} {{ editingPlayer.user.lastName }}
        </h3>
        
        <form @submit.prevent="updatePlayerResult" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Wins</label>
            <input
              v-model.number="editingPlayer.wins"
              type="number"
              min="0"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Losses</label>
            <input
              v-model.number="editingPlayer.losses"
              type="number"
              min="0"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="editingPlayer = null"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {{ loading ? 'Updating...' : 'Update Result' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '~/stores/user';
import { useTournamentStore } from '~/stores/tournament';
import Header from '~/components/Layout/Header.vue';
import { onMounted, ref, reactive, computed } from 'vue';

definePageMeta({
  middleware: ['admin']
});

// Get tournament ID from route
const route = useRoute();
const tournamentId = route.params.id as string;

// Stores
const userStore = useUserStore();
const tournamentStore = useTournamentStore();

// Store refs
const { users } = storeToRefs(userStore);
const { 
  currentTournament: tournament, 
  standings, 
  loading, 
  error 
} = storeToRefs(tournamentStore);

// Add a computed property to get standings from the store
const currentStandings = computed(() => {
  return standings.value?.standings || [];
});

// Local state
const editingPlayer = ref(null);

// Form data
const quickResult = reactive({
  userId: '',
  wins: 0,
  losses: 0,
});

const bulkResults = ref([
  { userId: '', wins: 0, losses: 0 },
  { userId: '', wins: 0, losses: 0 },
  { userId: '', wins: 0, losses: 0 },
]);

// Computed
const availableUsers = computed(() => {
  return users.value.filter(user => user.username); // Only show users with usernames
});

const canSubmitBulk = computed(() => {
  return bulkResults.value.some(result => result.userId && (result.wins > 0 || result.losses > 0));
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

const refreshStandings = async () => {
  await tournamentStore.fetchTournamentStandings(tournamentId);
};

const updateSingleResult = async () => {
  console.log('Starting single result update...');
  console.log('quickResult data:', quickResult);
  console.log('tournamentId:', tournamentId);
  
  // Validate data before sending
  if (!quickResult.userId) {
    alert('Please select a user');
    return;
  }
  
  if (quickResult.wins < 0 || quickResult.losses < 0) {
    alert('Wins and losses must be non-negative');
    return;
  }
  
  const success = await tournamentStore.updateTournamentResult(tournamentId, {
    userId: quickResult.userId,
    wins: quickResult.wins,
    losses: quickResult.losses,
  });

  console.log('Update result success:', success);
  
  if (success) {
    // Reset form
    quickResult.userId = '';
    quickResult.wins = 0;
    quickResult.losses = 0;
    console.log('Form reset after successful update');
    
    // Force refresh standings
    await refreshStandings();
  }
};

const editPlayerResult = (standing: any) => {
  editingPlayer.value = {
    ...standing,
    originalWins: standing.wins,
    originalLosses: standing.losses,
  };
};

const updatePlayerResult = async () => {
  if (!editingPlayer.value) return;

  const success = await tournamentStore.updateTournamentResult(tournamentId, {
    userId: editingPlayer.value.user.id,
    wins: editingPlayer.value.wins,
    losses: editingPlayer.value.losses,
  });

  if (success) {
    editingPlayer.value = null;
    // Force refresh standings
    await refreshStandings();
  }
};

const addBulkResult = () => {
  bulkResults.value.push({ userId: '', wins: 0, losses: 0 });
};

const removeBulkResult = (index: number) => {
  if (bulkResults.value.length > 1) {
    bulkResults.value.splice(index, 1);
  }
};

const bulkUpdateResults = async () => {
  console.log('Starting bulk update...');
  console.log('bulkResults data:', bulkResults.value);
  
  const validResults = bulkResults.value.filter(
    result => result.userId && (result.wins > 0 || result.losses > 0)
  );

  console.log('Valid results:', validResults);

  if (validResults.length === 0) {
    alert('Please select at least one user and enter wins/losses.');
    return;
  }

  const success = await tournamentStore.bulkUpdateResults(tournamentId, validResults);

  console.log('Bulk update success:', success);

  if (success) {
    // Reset bulk form
    bulkResults.value = [
      { userId: '', wins: 0, losses: 0 },
      { userId: '', wins: 0, losses: 0 },
      { userId: '', wins: 0, losses: 0 },
    ];
    console.log('Bulk form reset after successful update');
    
    // Force refresh standings
    await refreshStandings();
  }
};

// Load data on mount
onMounted(async () => {
  await Promise.all([
    userStore.fetchAllUsers(),
    tournamentStore.fetchTournamentStandings(tournamentId),
  ]);
});

// Add this test function for debugging
const testDirectApiCall = async () => {
  console.log('Testing direct API call...');
  try {
    const { fetch: authFetch } = useAuth();
    
    // Test with a simple user and basic values
    const testData = {
      userId: users.value[0]?.id, // Use first available user
      wins: 1,
      losses: 0
    };
    
    console.log('Test data:', testData);
    console.log('Tournament ID:', tournamentId);
    
    const result = await authFetch(`/tournaments/${tournamentId}/results/user`, {
      method: 'PATCH',
      body: testData,
    });
    
    console.log('Direct API call successful:', result);
  } catch (error) {
    console.error('Direct API call failed:', error);
  }
};

// Expose testDirectApiCall to window for manual testing
if (process.client) {
  window.testDirectApiCall = testDirectApiCall;
}

// Debug function to check what's in the store
const debugStandings = () => {
  console.log('=== DEBUG STANDINGS ===');
  console.log('Tournament:', tournament.value);
  console.log('Raw standings from store:', standings.value);
  console.log('Current standings computed:', currentStandings.value);
  console.log('Users:', users.value);
  console.log('Loading:', loading.value);
  console.log('Error:', error.value);
  console.log('======================');
};

// Cleanup on unmount
onUnmounted(() => {
  tournamentStore.clearCurrentTournament();
});
</script>

<style scoped>
/* Custom styles */
.grid {
  align-items: end;
}
</style>