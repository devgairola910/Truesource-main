import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionCard } from "@/components/ui/section-card";
import { blogPosts, getBlogPostBySlug } from "@/lib/blog-posts";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | TrueSource",
    };
  }

  return {
    title: `${post.title} | TrueSource Blog`,
    description: post.summary,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <section className="reveal-up rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 md:p-8">
        <p className="text-xs font-mono uppercase tracking-[0.22em] text-[var(--text-soft)]">
          {post.category}
        </p>
        <h2 className="mt-2 font-heading text-3xl font-bold text-[var(--text-strong)] md:text-4xl">
          {post.title}
        </h2>
        <p className="mt-3 text-sm text-[var(--text-soft)]">
          {post.date} | {post.readTime} | By {post.author}
        </p>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--text-muted)]">{post.summary}</p>
      </section>

      <SectionCard
        className="reveal-up"
        title="Article"
        description="Detailed breakdown"
      >
        <div className="space-y-4 text-base leading-8 text-[var(--text-muted)]">
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        className="reveal-up"
        title="Continue Reading"
        description="More resources from TrueSource"
      >
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            href="/blog"
            className="rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 font-semibold text-[var(--text-strong)] transition hover:bg-[var(--surface-3)]"
          >
            Back to Blog Index
          </Link>
          <Link
            href="/services"
            className="rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 font-semibold text-[var(--text-strong)] transition hover:bg-[var(--surface-3)]"
          >
            Explore Services
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 font-semibold text-[var(--text-strong)] transition hover:bg-[var(--surface-3)]"
          >
            Contact Team
          </Link>
        </div>
      </SectionCard>
    </>
  );
}
