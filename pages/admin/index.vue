<template>
  <div>
    <Header 
      title="Admin Dashboard" 
      subtitle="Manage users and cards"
    />
    
    <div class="mt-8">
      <div v-if="loading" class="text-center py-10">
        <p>Loading users...</p>
      </div>
      
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
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
                <th class="py-2 px-4 border-b text-left">Role</th>
                <th class="py-2 px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td class="py-2 px-4 border-b">{{ user.firstName }} {{ user.lastName }}</td>
                <td class="py-2 px-4 border-b">{{ user.email }}</td>
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
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '~/stores/user';
import Header from '~/components/Layout/Header.vue';
import { onMounted } from 'vue';

definePageMeta({
  middleware: ['admin']
});

const userStore = useUserStore();
const { users, loading, error } = storeToRefs(userStore);

onMounted(async () => {
  await userStore.fetchAllUsers();
  console.log('Users loaded:', users.value);
});
</script>