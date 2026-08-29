import { useState, useEffect, useCallback } from "react";
import { ContentService, HeroSlide, BlogPost } from "../services/contentService";

export function useContent() {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [heroRes, blogRes] = await Promise.all([
        ContentService.getHeroSlides(),
        ContentService.getBlogPosts(),
      ]);

      if (heroRes.success) setHeroSlides(heroRes.data);
      if (blogRes.success) setBlogPosts(blogRes.data);
    } catch (err: any) {
      setError(err.message || "Failed to load content.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const updateHeroSlides = async (slides: HeroSlide[]) => {
    try {
      const res = await ContentService.updateHeroSlides(slides);
      if (res.success) {
        setHeroSlides(res.data);
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to update hero slides.");
      throw err;
    }
  };

  const createBlogPost = async (post: any) => {
    try {
      const res = await ContentService.createBlogPost(post);
      if (res.success) {
        await fetchContent();
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to create blog post.");
      throw err;
    }
  };

  const updateBlogPost = async (id: number, post: Partial<BlogPost>) => {
    try {
      const res = await ContentService.updateBlogPost(id, post);
      if (res.success) {
        await fetchContent();
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to update blog post.");
      throw err;
    }
  };

  const deleteBlogPost = async (id: number) => {
    try {
      const res = await ContentService.deleteBlogPost(id);
      if (res.success) {
        await fetchContent();
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to delete blog post.");
      throw err;
    }
  };

  return {
    heroSlides,
    blogPosts,
    isLoading,
    error,
    updateHeroSlides,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    refetch: fetchContent,
  };
}
