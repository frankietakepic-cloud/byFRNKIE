import { API_URL } from "../lib/api";
import { Photo, JournalEntry, Project, DailyEntry, PageLayout, HeroConfig } from "../types";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {})
    }
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson.error) errorMsg = errJson.error;
    } catch {}
    throw new ApiError(response.status, errorMsg);
  }

  return response.json();
}

export const apiService = {
  // System Health API
  async getHealth(): Promise<{ status: string; system: string; environment: string; counts: { photos: number; journals: number; projects: number } }> {
    return request("/api/health");
  },

  async getVersion(): Promise<{ version: string; name: string; environment: string; commit: string }> {
    return request("/api/version");
  },

  async getReady(): Promise<{ ready: boolean; status: string }> {
    return request("/api/ready");
  },

  // Photos REST API
  async getPhotos(): Promise<Photo[]> {
    return request<Photo[]>("/api/photos");
  },

  async updatePhoto(id: string, updates: Partial<Photo>, authToken?: string): Promise<Photo> {
    return request<Photo>(`/api/photos/${id}`, {
      method: "PATCH",
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      body: JSON.stringify(updates)
    });
  },

  async deletePhoto(id: string, authToken?: string): Promise<{ success: boolean; id: string }> {
    return request<{ success: boolean; id: string }>(`/api/photos/${id}`, {
      method: "DELETE",
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
    });
  },

  async togglePublishPhoto(id: string, authToken?: string): Promise<Photo> {
    return request<Photo>(`/api/photos/${id}/publish`, {
      method: "POST",
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
    });
  },

  // Journals REST API
  async getJournals(): Promise<JournalEntry[]> {
    return request<JournalEntry[]>("/api/journals");
  },

  async saveJournal(journal: Partial<JournalEntry>, authToken?: string): Promise<JournalEntry> {
    return request<JournalEntry>("/api/journals", {
      method: "POST",
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      body: JSON.stringify(journal)
    });
  },

  async deleteJournal(id: string, authToken?: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/journals/${id}`, {
      method: "DELETE",
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
    });
  },

  // Projects REST API
  async getProjects(): Promise<Project[]> {
    return request<Project[]>("/api/projects");
  },

  async saveProject(project: Partial<Project>, authToken?: string): Promise<Project> {
    return request<Project>("/api/projects", {
      method: "POST",
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      body: JSON.stringify(project)
    });
  },

  async deleteProject(id: string, authToken?: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/projects/${id}`, {
      method: "DELETE",
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
    });
  },

  // Daily Log REST API
  async getDailyEntries(): Promise<DailyEntry[]> {
    return request<DailyEntry[]>("/api/daily");
  },

  async saveDailyEntry(entry: Partial<DailyEntry>, authToken?: string): Promise<DailyEntry> {
    return request<DailyEntry>("/api/daily", {
      method: "POST",
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      body: JSON.stringify(entry)
    });
  },

  async deleteDailyEntry(id: string, authToken?: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/daily/${id}`, {
      method: "DELETE",
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
    });
  },

  // Site Builder Pages REST API
  async getPages(): Promise<PageLayout[]> {
    return request<PageLayout[]>("/api/pages");
  },

  async savePage(page: PageLayout, authToken?: string): Promise<PageLayout> {
    return request<PageLayout>("/api/pages", {
      method: "POST",
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      body: JSON.stringify(page)
    });
  },

  // Hero Manager REST API
  async getHeroConfig(): Promise<HeroConfig> {
    return request<HeroConfig>("/api/hero-config");
  },

  async updateHeroConfig(config: HeroConfig, authToken?: string): Promise<HeroConfig> {
    return request<HeroConfig>("/api/hero-config", {
      method: "POST",
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      body: JSON.stringify(config)
    });
  },

  // L'Officina Passkey Authentication
  async authenticatePasscode(passcode: string): Promise<{ success: boolean; token: string }> {
    return request<{ success: boolean; token: string }>("/api/officina/auth", {
      method: "POST",
      body: JSON.stringify({ passcode })
    });
  }
};
