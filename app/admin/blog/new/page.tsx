"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  BLOG_CATEGORIES,
  VIDEO_LANGUAGES,
  computeSeoHealth,
  slugify,
  type SeoHealth,
} from "@/lib/admin-content-mock";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

function SeoIndicator({
  health,
  label,
}: {
  health: SeoHealth;
  label: string;
}) {
  return (
    <li className="flex items-center gap-2 text-sm">
      <span
        className={cn(
          "size-2 shrink-0 rounded-full",
          health === "good" && "bg-green-500",
          health === "warning" && "bg-yellow-500",
          health === "poor" && "bg-red-500"
        )}
      />
      {label}
    </li>
  );
}

export default function NewBlogPostPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [language, setLanguage] = useState("English");
  const [content, setContent] = useState(
    "## Introduction\n\nWrite your post content here…"
  );
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [category, setCategory] = useState("Tips");
  const [imageAlt, setImageAlt] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");

  useEffect(() => {
    if (!slugManual && title) {
      setSlug(slugify(title));
    }
  }, [title, slugManual]);

  useEffect(() => {
    if (!metaTitle && title) {
      setMetaTitle(title.slice(0, 60));
    }
  }, [title, metaTitle]);

  const seo = useMemo(
    () =>
      computeSeoHealth({
        title,
        metaTitle,
        metaDescription,
        focusKeyword,
        content,
        imageAlt,
      }),
    [title, metaTitle, metaDescription, focusKeyword, content, imageAlt]
  );

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="gap-1 -ml-2"
        render={<Link href="/admin/blog" />}
      >
        <ArrowLeft className="size-4" />
        Back to posts
      </Button>

      <div>
        <h1 className="text-2xl font-bold text-foreground">New Post</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a blog article with SEO optimization
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Post title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">/</span>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => {
                      setSlugManual(true);
                      setSlug(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={language}
                  onValueChange={(v) => v && setLanguage(v)}
                >
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["English", "Hindi", ...VIDEO_LANGUAGES.slice(1)].map(
                      (l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <div data-color-mode="light">
                  <MDEditor
                    value={content}
                    onChange={(v) => setContent(v ?? "")}
                    height={360}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">SEO fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta title</Label>
                <Input
                  id="meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {metaTitle.length} characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-desc">Meta description</Label>
                <Textarea
                  id="meta-desc"
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {metaDescription.length} characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="keyword">Focus keyword</Label>
                <Input
                  id="keyword"
                  placeholder="e.g. pipe leak fix"
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={category}
                  onValueChange={(v) => v && setCategory(v)}
                >
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOG_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="featured">Featured image</Label>
                <Input id="featured" type="file" accept="image/*" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image-alt">Featured image alt text</Label>
                <Input
                  id="image-alt"
                  placeholder="Describe the image for accessibility & SEO"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                SEO health
                <span
                  className={cn(
                    "size-3 rounded-full",
                    seo.score === "good" && "bg-green-500",
                    seo.score === "warning" && "bg-yellow-500",
                    seo.score === "poor" && "bg-red-500"
                  )}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {seo.checks.map((check) => (
                  <SeoIndicator
                    key={check.label}
                    health={check.status}
                    label={check.label}
                  />
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule date (optional)</Label>
                <Input
                  id="schedule"
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </div>
              <Button className="w-full">Publish</Button>
              <Button variant="secondary" className="w-full">
                Save Draft
              </Button>
              <Button variant="outline" className="w-full" disabled={!scheduleDate}>
                Schedule
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
