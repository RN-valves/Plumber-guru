"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  MOCK_BLOG_POSTS,
  computeSeoHealth,
  type BlogPost,
  type SeoHealth,
} from "@/lib/admin-content-mock";

const STATUS_STYLES: Record<string, string> = {
  published: "bg-green-100 text-green-800",
  draft: "bg-gray-100 text-gray-600",
  scheduled: "bg-blue-100 text-blue-800",
};

function SeoDot({ health }: { health: SeoHealth }) {
  return (
    <span
      className={cn(
        "inline-block size-2.5 rounded-full",
        health === "good" && "bg-green-500",
        health === "warning" && "bg-yellow-500",
        health === "poor" && "bg-red-500"
      )}
      title={`SEO: ${health}`}
    />
  );
}

function postSeoHealth(post: BlogPost): SeoHealth {
  return computeSeoHealth({
    title: post.title,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    focusKeyword: post.focusKeyword,
    content: post.title + " " + post.metaDescription,
    imageAlt: post.hasImageAlt ? "Featured image alt text" : "",
  }).score;
}

export default function BlogPostsPage() {
  const [posts, setPosts] = useState(MOCK_BLOG_POSTS);

  function deletePost(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog / SEO Posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage articles and search optimization
          </p>
        </div>
        <Button className="gap-2" render={<Link href="/admin/blog/new" />}>
          <Plus className="size-4" />
          New Post
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">SEO</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <SeoDot health={postSeoHealth(post)} />
                  </TableCell>
                  <TableCell>
                    <p className="max-w-[220px] font-medium line-clamp-2">
                      {post.title}
                    </p>
                    <Badge variant="outline" className="mt-1 text-[10px]">
                      {post.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[180px] truncate text-sm text-muted-foreground">
                    /{post.slug}
                  </TableCell>
                  <TableCell>{post.language}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={STATUS_STYLES[post.status]}
                    >
                      {post.status.charAt(0).toUpperCase() +
                        post.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {post.views.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {post.publishedDate}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Post actions"
                          />
                        }
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Link href="/admin/blog/new" className="w-full">
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => deletePost(post.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
