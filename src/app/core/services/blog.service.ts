import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

import { BlogContentBlock, BlogPost, BlogPostDraft } from '../../models/blog-post.model';

const STORAGE_KEY = 'language-teacher-blog-posts';
export const BLOG_SUMMARY_MAX_LENGTH = 150;

const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: 'daily-speaking-habit',
    createdAt: '2026-04-12',
    title: 'How to build a daily speaking habit',
    summary: 'Small, repeatable exercises that make English practice easier to keep.',
    contentBlocks: [
      {
        id: 'daily-speaking-habit-subtitle',
        type: 'subtitle',
        text: 'Keep practice short and repeatable',
      },
      {
        id: 'daily-speaking-habit-paragraph',
        type: 'paragraph',
        text: 'Choose one topic, speak for two minutes, and save useful phrases for review. A small daily habit is easier to keep than a long session once a week.',
      },
    ],
  },
  {
    id: 'business-english-preparation',
    createdAt: '2026-03-28',
    title: 'What to prepare before a business English lesson',
    summary: 'Bring real examples from meetings, emails, or presentations to make lessons useful.',
    contentBlocks: [
      {
        id: 'business-english-preparation-subtitle',
        type: 'subtitle',
        text: 'Use your real work materials',
      },
      {
        id: 'business-english-preparation-paragraph',
        type: 'paragraph',
        text: 'Practical materials help us focus on language you can use immediately. Bring meeting notes, emails, presentation slides, or situations where you want clearer English.',
      },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly posts = signal<BlogPost[]>(this.readStoredPosts());

  readonly blogPosts = this.posts.asReadonly();

  public getPosts(): Observable<BlogPost[]> {
    // Future Spring Boot endpoint: GET /api/public/blog
    return of(this.posts());
  }

  public getPostById(id: string): BlogPost | undefined {
    // Future Spring Boot endpoint: GET /api/public/blog/{id}
    return this.posts().find((post) => post.id === id);
  }

  public getAdminPosts(): BlogPost[] {
    // Future Spring Boot endpoint: GET /api/admin/blog
    return this.posts();
  }

  public createPost(draft: BlogPostDraft): BlogPost {
    // Future Spring Boot endpoint: POST /api/admin/blog
    this.validateDraft(draft);

    const nextPost: BlogPost = {
      ...this.sanitizeDraft(draft),
      id: this.createId(draft.title),
      createdAt: new Date().toISOString(),
    };

    this.persist([nextPost, ...this.posts()]);
    return nextPost;
  }

  public updatePost(id: string, draft: BlogPostDraft): BlogPost {
    // Future Spring Boot endpoint: PUT /api/admin/blog/{id}
    this.validateDraft(draft);

    const currentPosts = this.posts();
    const existingPost = currentPosts.find((post) => post.id === id);

    if (!existingPost) {
      throw new Error('Blog post was not found.');
    }

    const nextPost: BlogPost = {
      ...existingPost,
      ...this.sanitizeDraft(draft),
      createdAt: existingPost.createdAt,
    };

    this.persist(currentPosts.map((post) => (post.id === id ? nextPost : post)));
    return nextPost;
  }

  public deletePost(id: string): void {
    // Future Spring Boot endpoint: DELETE /api/admin/blog/{id}
    const nextPosts = this.posts().filter((post) => post.id !== id);

    if (nextPosts.length === this.posts().length) {
      throw new Error('Blog post was not found.');
    }

    this.persist(nextPosts);
  }

  private persist(posts: BlogPost[]): void {
    const normalizedPosts = this.normalizePosts(posts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedPosts));
    this.posts.set(normalizedPosts);
  }

  private readStoredPosts(): BlogPost[] {
    const storedPosts = localStorage.getItem(STORAGE_KEY);

    if (!storedPosts) {
      return this.normalizePosts(DEFAULT_BLOG_POSTS);
    }

    try {
      const parsedPosts = JSON.parse(storedPosts) as Partial<BlogPost>[];
      return this.normalizePosts(parsedPosts);
    } catch {
      return this.normalizePosts(DEFAULT_BLOG_POSTS);
    }
  }

  private normalizePosts(posts: Partial<BlogPost>[]): BlogPost[] {
    return posts
      .map((post, index) => this.normalizePost(post, index))
      .filter((post): post is BlogPost => Boolean(post))
      .sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt));
  }

  private normalizePost(post: Partial<BlogPost>, index: number): BlogPost | null {
    const legacyPost = post as Partial<BlogPost> & {
      excerpt?: string;
      content?: string;
      publishedAt?: string;
    };
    const title = post.title?.trim();
    const summary = (post.summary ?? legacyPost.excerpt ?? '').trim().slice(0, BLOG_SUMMARY_MAX_LENGTH);

    if (!title || !summary) {
      return null;
    }

    const fallbackContent = legacyPost.content?.trim();
    const contentBlocks =
      post.contentBlocks?.length ? post.contentBlocks : this.createLegacyContentBlocks(fallbackContent);

    return {
      id: String(post.id ?? this.createId(title || `blog-post-${index + 1}`)),
      createdAt: post.createdAt ?? legacyPost.publishedAt ?? new Date().toISOString(),
      title,
      summary,
      contentBlocks: this.normalizeBlocks(contentBlocks),
      images: post.images?.filter(Boolean),
    };
  }

  private createLegacyContentBlocks(content: string | undefined): BlogContentBlock[] {
    return [
      {
        id: this.createBlockId(),
        type: 'paragraph',
        text: content || '',
      },
    ];
  }

  private normalizeBlocks(blocks: BlogContentBlock[]): BlogContentBlock[] {
    return blocks
      .filter((block) => block.type === 'subtitle' || block.type === 'paragraph' || block.type === 'image')
      .map((block) => ({
        id: block.id || this.createBlockId(),
        type: block.type,
        text: block.text?.trim() ?? '',
        bold: Boolean(block.bold),
        italic: Boolean(block.italic),
        underline: Boolean(block.underline),
        imageUrl: block.imageUrl,
        imageName: block.imageName,
      }));
  }

  private validateDraft(draft: BlogPostDraft): void {
    if (!draft.title.trim() || !draft.summary.trim()) {
      throw new Error('Required blog fields are missing.');
    }

    if (draft.summary.trim().length > BLOG_SUMMARY_MAX_LENGTH) {
      throw new Error('Summary is too long.');
    }

    if (!draft.contentBlocks.some((block) => block.type === 'paragraph' && block.text?.trim())) {
      throw new Error('At least one paragraph block is required.');
    }
  }

  private sanitizeDraft(draft: BlogPostDraft): BlogPostDraft {
    const contentBlocks = this.normalizeBlocks(draft.contentBlocks).filter(
      (block) => block.type === 'image' ? block.imageUrl : block.text,
    );

    return {
      title: draft.title.trim(),
      summary: draft.summary.trim().slice(0, BLOG_SUMMARY_MAX_LENGTH),
      contentBlocks,
      images: contentBlocks
        .filter((block) => block.type === 'image' && block.imageUrl)
        .map((block) => block.imageUrl as string),
    };
  }

  public createBlockId(): string {
    return `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private createId(title: string): string {
    const baseId =
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'blog-post';
    const existingIds = new Set(this.posts?.().map((post) => post.id) ?? []);

    if (!existingIds.has(baseId)) {
      return baseId;
    }

    let counter = 2;
    while (existingIds.has(`${baseId}-${counter}`)) {
      counter += 1;
    }

    return `${baseId}-${counter}`;
  }
}
