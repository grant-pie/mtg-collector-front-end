<template>
  <div>
    <Header 
      title="Admin Dashboard" 
      subtitle="Manage users, cards, and tournaments"
    />
    
    <!-- Navigation Tabs -->
    <div class="mt-8">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'users'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            User Management
          </button>
          <button
            @click="activeTab = 'tournaments'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'tournaments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Tournament Management
          </button>
        </nav>
      </div>
    </div>

    <!-- User Management Tab -->
    <div v-if="activeTab === 'users'" class="mt-6">
      <div v-if="userLoading" class="text-center py-10">
        <p>Loading users...</p>
      </div>
      
      <div v-else-if="userError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ userError }}
      </div>
      
      <div v-else class="bg-white p-6 rounded shadow-md">
        <h2 class="text-2xl font-bold mb-4">User Management</h2>
        
        <div v-if="users.length === 0" class="text-center py-6">
          <p>No users found.</p>
        </div>
        
        <div v-else>
          <table class="min-w-full bg-white">
            <thead>
              <tr>
                <th class="py-2 px-4 border-b text-left">Name</th>
                <th class="py-2 px-4 border-b text-left">Email</th>
                <th class="py-2 px-4 border-b text-left">Username</th>
                <th class="py-2 px-4 border-b text-left">Role</th>
                <th class="py-2 px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td class="py-2 px-4 border-b">{{ user.firstName }} {{ user.lastName }}</td>
                <td class="py-2 px-4 border-b">{{ user.email }}</td>
                <td class="py-2 px-4 border-b">{{ user.username || 'Not set' }}</td>
                <td class="py-2 px-4 border-b">{{ user.role }}</td>
                <td class="py-2 px-4 border-b text-center">
                  <NuxtLink 
                    :to="`/admin/users/${user.id}`" 
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    Manage Cards
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tournament Management Tab -->
    <div v-if="activeTab === 'tournaments'" class="mt-6">
      <div v-if="tournamentLoading" class="text-center py-10">
        <p>Loading tournaments...</p>
      </div>
      
      <div v-else-if="tournamentError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ tournamentError }}
        <button @click="tournamentStore.clearError()" class="ml-2 text-red-500 hover:text-red-700">×</button>
      </div>

      <!-- Create Tournament Section -->
      <div class="bg-white p-6 rounded shadow-md mb-6">
        <h2 class="text-2xl font-bold mb-4">Create New Tournament</h2>
        
        <form @submit.prevent="createTournament" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Tournament Name</label>
              <input
                id="name"
                v-model="newTournament.name"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter tournament name"
              />
            </div>
            
            <div>
              <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
              <input
                id="date"
                v-model="newTournament.date"
                type="date"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              v-model="newTournament.description"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter tournament description (optional)"
            ></textarea>
          </div>
          
          <div class="flex items-center">
            <input
              id="isActive"
              v-model="newTournament.isActive"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="isActive" class="ml-2 block text-sm text-gray-900">
              Active Tournament
            </label>
          </div>
          
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="tournamentLoading"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {{ tournamentLoading ? 'Creating...' : 'Create Tournament' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Tournaments List -->
      <div class="bg-white p-6 rounded shadow-md">
        <h2 class="text-2xl font-bold mb-4">Existing Tournaments</h2>
        
        <div v-if="tournaments.length === 0" class="text-center py-6">
          <p>No tournaments found. Create your first tournament above!</p>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="tournament in tournaments"
            :key="tournament.id"
            class="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-semibold">{{ tournament.name }}</h3>
                  <span
                    :class="[
                      'px-2 py-1 rounded-full text-xs font-medium',
                      tournament.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ tournament.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                
                <p v-if="tournament.description" class="text-gray-600 mb-2">
                  {{ tournament.description }}
                </p>
                
                <p class="text-sm text-gray-500">
                  Date: {{ formatDate(tournament.date) }}
                </p>
              </div>
              
              <div class="flex gap-2 ml-4">
                <NuxtLink
                  :to="`/admin/tournaments/${tournament.id}`"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded text-sm"
                >
                  Manage Results
                </NuxtLink>
                
                <button
                  @click="editTournament(tournament)"
                  class="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded text-sm"
                >
                  Edit
                </button>
                
                <button
                  @click="deleteTournament(tournament.id, tournament.name)"
                  class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Tournament Modal -->
    <div v-if="editingTournament" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Edit Tournament</h3>
        
        <form @submit.prevent="updateTournament" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Tournament Name</label>
            <input
              v-model="editingTournament.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Date</label>
            <input
              v-model="editingTournament.date"
              type="date"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              v-model="editingTournament.description"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <div class="flex items-center">
            <input
              v-model="editingTournament.isActive"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-900">
              Active Tournament
            </label>
          </div>
          
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="cancelEdit"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="tournamentLoading"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {{ tournamentLoading ? 'Updating...' : 'Update Tournament' }}
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
import { onMounted, ref, reactive } from 'vue';

definePageMeta({
  middleware: ['admin']
});

// Stores
const userStore = useUserStore();
const tournamentStore = useTournamentStore();

// User store refs
const { users, loading: userLoading, error: userError } = storeToRefs(userStore);

// Tournament store refs
const { tournaments, loading: tournamentLoading, error: tournamentError } = storeToRefs(tournamentStore);

// Local state
const activeTab = ref('users');
const editingTournament = ref(null);

// Form data
const newTournament = reactive({
  name: '',
  description: '',
  date: '',
  isActive: true,
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

const createTournament = async () => {
  const tournament = await tournamentStore.createTournament({
    name: newTournament.name,
    description: newTournament.description || undefined,
    date: newTournament.date,
    isActive: newTournament.isActive,
  });

  if (tournament) {
    // Reset form
    newTournament.name = '';
    newTournament.description = '';
    newTournament.date = '';
    newTournament.isActive = true;
  }
};

const editTournament = (tournament: any) => {
  editingTournament.value = {
    ...tournament,
    date: new Date(tournament.date).toISOString().split('T')[0] // Format for date input
  };
};

const updateTournament = async () => {
  if (!editingTournament.value) return;

  const success = await tournamentStore.updateTournament(editingTournament.value.id, {
    name: editingTournament.value.name,
    description: editingTournament.value.description,
    date: editingTournament.value.date,
    isActive: editingTournament.value.isActive,
  });

  if (success) {
    editingTournament.value = null;
  }
};

const cancelEdit = () => {
  editingTournament.value = null;
};

const deleteTournament = async (id: string, name: string) => {
  if (confirm(`Are you sure you want to delete the tournament "${name}"? This action cannot be undone.`)) {
    await tournamentStore.deleteTournament(id);
  }
};

// Load data on mount
onMounted(async () => {
  await Promise.all([
    userStore.fetchAllUsers(),
    tournamentStore.fetchTournaments(),
  ]);
  
  console.log('Users loaded:', users.value);
  console.log('Tournaments loaded:', tournaments.value);
});
</script>

<style scoped>
/* Add any custom styles here */
</style>