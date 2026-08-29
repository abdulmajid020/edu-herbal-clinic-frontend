import { apiRequest, ApiResponse } from "./apiClient";

export interface HeroSlide {
  id: number;
  badge: string;
  eyebrow: string;
  title: string;
  description: string;
  panelTitle: string;
  panelSubtitle: string;
  panelAccent: string;
  background: string;
  image: string;
  overlayText?: string | null;
  subText?: string | null;
  smallText?: string | null;
  stats: [string, string, string][];
  displayOrder: number;
}

export interface BlogPost {
  id: number;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  content?: string | null;
  image: string;
  isPublished: boolean;
}

export class ContentService {
  public static async getHeroSlides(): Promise<{ success: boolean; data: HeroSlide[] }> {
    return apiRequest("/content/hero-slides");
  }

  public static async updateHeroSlides(slides: HeroSlide[]): Promise<{ success: boolean; data: HeroSlide[]; message: string }> {
    return apiRequest("/content/hero-slides", {
      method: "PUT",
      body: JSON.stringify({ slides }),
    });
  }

  public static async getBlogPosts(): Promise<{ success: boolean; count: number; data: BlogPost[] }> {
    return apiRequest("/content/blog-posts");
  }

  public static async createBlogPost(post: {
    title: string;
    category: string;
    date?: string;
    readTime?: string;
    excerpt: string;
    image?: string;
    content?: string;
  }): Promise<{ success: boolean; data: BlogPost; message: string }> {
    return apiRequest("/content/blog-posts", {
      method: "POST",
      body: JSON.stringify(post),
    });
  }

  public static async updateBlogPost(id: number, post: Partial<BlogPost>): Promise<{ success: boolean; data: BlogPost; message: string }> {
    return apiRequest(`/content/blog-posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(post),
    });
  }

  public static async deleteBlogPost(id: number): Promise<ApiResponse> {
    return apiRequest(`/content/blog-posts/${id}`, {
      method: "DELETE",
    });
  }
}
