// stores/tournament.ts
import { defineStore } from 'pinia';
import { useRuntimeConfig } from '#app';

interface User {
  id: string;
  username?: string;
  firstName: string;
  lastName: string;
  picture?: string;
}

interface Tournament {
  id: string;
  name: string;
  description?: string;
  date: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TournamentResult {
  rank: number;
  user: User;
  wins: number;
  losses: number;
  winRate: number;
  totalGames: number;
}

interface TournamentStanding {
  tournament: Tournament;
  standings: TournamentResult[];
}

interface CreateTournamentData {
  name: string;
  description?: string;
  date: string;
  isActive?: boolean;
}

interface UpdateResultData {
  userId: string;
  wins: number;
  losses: number;
}

interface TournamentState {
  tournaments: Tournament[];
  currentTournament: Tournament | null;
  standings: TournamentStanding | null;
  allStandings: TournamentStanding[];
  loading: boolean;
  error: string | null;
}

export const useTournamentStore = defineStore('tournament', {
  state: (): TournamentState => ({
    tournaments: [],
    currentTournament: null,
    standings: null,
    allStandings: [],
    loading: false,
    error: null,
  }),

  getters: {
    activeTournaments(): Tournament[] {
      return this.tournaments.filter(t => t.isActive);
    },

    upcomingTournaments(): Tournament[] {
      const now = new Date();
      return this.tournaments.filter(t => new Date(t.date) > now);
    },

    pastTournaments(): Tournament[] {
      const now = new Date();
      return this.tournaments.filter(t => new Date(t.date) <= now);
    },
  },

  actions: {
    setError(error: string | null): void {
      this.error = error;
    },

    setLoading(loading: boolean): void {
      this.loading = loading;
    },

    async fetchTournaments(): Promise<void> {
      this.setLoading(true);
      this.setError(null);

      try {
        const config = useRuntimeConfig();
        const { fetch: authFetch } = useAuth();
        
        const data = await authFetch('/tournaments');
        this.tournaments = data;
      } catch (err: any) {
        console.error('Error fetching tournaments:', err);
        this.setError(err.message || 'Failed to load tournaments');
      } finally {
        this.setLoading(false);
      }
    },

    async createTournament(tournamentData: CreateTournamentData): Promise<Tournament | null> {
      this.setLoading(true);
      this.setError(null);

      try {
        const config = useRuntimeConfig();
        const { fetch: authFetch } = useAuth();
        
        const tournament = await authFetch('/tournaments', {
          method: 'POST',
          body: tournamentData,
        });

        this.tournaments.unshift(tournament);
        return tournament;
      } catch (err: any) {
        console.error('Error creating tournament:', err);
        this.setError(err.message || 'Failed to create tournament');
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    async updateTournament(id: string, updateData: Partial<CreateTournamentData>): Promise<Tournament | null> {
      this.setLoading(true);
      this.setError(null);

      try {
        const config = useRuntimeConfig();
        const { fetch: authFetch } = useAuth();
        
        const tournament = await authFetch(`/tournaments/${id}`, {
          method: 'PATCH',
          body: updateData,
        });

        const index = this.tournaments.findIndex(t => t.id === id);
        if (index !== -1) {
          this.tournaments[index] = tournament;
        }

        return tournament;
      } catch (err: any) {
        console.error('Error updating tournament:', err);
        this.setError(err.message || 'Failed to update tournament');
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    async deleteTournament(id: string): Promise<boolean> {
      this.setLoading(true);
      this.setError(null);

      try {
        const config = useRuntimeConfig();
        const { fetch: authFetch } = useAuth();
        
        await authFetch(`/tournaments/${id}`, {
          method: 'DELETE',
        });

        this.tournaments = this.tournaments.filter(t => t.id !== id);
        return true;
      } catch (err: any) {
        console.error('Error deleting tournament:', err);
        this.setError(err.message || 'Failed to delete tournament');
        return false;
      } finally {
        this.setLoading(false);
      }
    },

    async fetchTournamentStandings(id: string): Promise<void> {
      this.setLoading(true);
      this.setError(null);

      try {
        console.log('Fetching tournament standings for ID:', id);
        const { fetch: authFetch } = useAuth();
        
        const data = await authFetch(`/tournaments/${id}/standings`);
        console.log('Tournament standings response:', data);
        
        this.standings = data;
        this.currentTournament = data.tournament;
      } catch (err: any) {
        console.error('Error fetching tournament standings:', err);
        this.setError(err.message || 'Failed to load tournament standings');
      } finally {
        this.setLoading(false);
      }
    },

    async fetchAllStandings(): Promise<void> {
      this.setLoading(true);
      this.setError(null);

      try {
        const config = useRuntimeConfig();
        const { fetch: authFetch } = useAuth();
        
        const data = await authFetch('/tournaments/standings');
        this.allStandings = data;
      } catch (err: any) {
        console.error('Error fetching all standings:', err);
        this.setError(err.message || 'Failed to load tournament standings');
      } finally {
        this.setLoading(false);
      }
    },

    async updateTournamentResult(tournamentId: string, resultData: UpdateResultData): Promise<boolean> {
      this.setLoading(true);
      this.setError(null);

      try {
        console.log('Updating tournament result:', { tournamentId, resultData });
        const { fetch: authFetch } = useAuth();
        
        const response = await authFetch(`/tournaments/${tournamentId}/results/user`, {
          method: 'PATCH',
          body: resultData,
        });

        console.log('Update tournament result response:', response);

        // Don't automatically refresh here - let the component handle it
        return true;
      } catch (err: any) {
        console.error('Error updating tournament result:', err);
        
        // Handle different error types
        let errorMessage = 'Failed to update tournament result';
        
        if (err.response?.status === 400) {
          errorMessage = err.data?.message || 'Invalid data provided';
        } else if (err.response?.status === 401) {
          errorMessage = 'Authentication failed';
        } else if (err.response?.status === 403) {
          errorMessage = 'You do not have permission to update tournament results';
        } else if (err.response?.status === 404) {
          errorMessage = 'Tournament or user not found';
        } else if (err.data?.message) {
          errorMessage = err.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        this.setError(errorMessage);
        return false;
      } finally {
        this.setLoading(false);
      }
    },

    async bulkUpdateResults(tournamentId: string, results: UpdateResultData[]): Promise<boolean> {
      this.setLoading(true);
      this.setError(null);

      try {
        console.log('Bulk updating tournament results:', { tournamentId, results });
        const { fetch: authFetch } = useAuth();
        
        const response = await authFetch(`/tournaments/${tournamentId}/results/bulk`, {
          method: 'PATCH',
          body: { results },
        });

        console.log('Bulk update tournament results response:', response);

        // Don't automatically refresh here - let the component handle it
        return true;
      } catch (err: any) {
        console.error('Error bulk updating tournament results:', err);
        
        // Handle different error types
        let errorMessage = 'Failed to update tournament results';
        
        if (err.response?.status === 400) {
          errorMessage = err.data?.message || 'Invalid data provided';
        } else if (err.response?.status === 401) {
          errorMessage = 'Authentication failed';
        } else if (err.response?.status === 403) {
          errorMessage = 'You do not have permission to update tournament results';
        } else if (err.response?.status === 404) {
          errorMessage = 'Tournament not found';
        } else if (err.data?.message) {
          errorMessage = err.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        this.setError(errorMessage);
        return false;
      } finally {
        this.setLoading(false);
      }
    },

    clearCurrentTournament(): void {
      this.currentTournament = null;
      this.standings = null;
    },

    clearError(): void {
      this.error = null;
    },
  },
});