export interface Module {
  name: string;
  npm: string;
  description: string;
  icon?: string;
  github?: string;
  website?: string;
  category?: string;
  maintainers?: {
    name: string;
    github: string;
  }[];
  compatibility?: {
    nuxt: string;
  };
}

export interface ApiResponse {
  modules: Module[];
}
