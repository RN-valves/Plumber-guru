"use client";

import { useState } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_FORUM_POSTS } from "@/lib/admin-misc-mock";
import { cn } from "@/lib/utils";

const STATUS_STYLE = {
  published: "bg-green-100 text-green-800",
  flagged: "bg-red-100 text-red-800",
  hidden: "bg-gray-100 text-gray-600",
};

export default function ForumPostsPage() {
  const [posts, setPosts] = useState(MOCK_FORUM_POSTS);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Forum Posts"
        description="Moderate community discussions"
      >
        <Badge variant="secondary" className="gap-1">
          <MessageSquare className="size-3.5" />
          {posts.filter((p) => p.status === "flagged").length} flagged
        </Badge>
      </AdminPageHeader>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead className="min-w-[240px]">Title</TableHead>
                <TableHead>Replies</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.author}</TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.replies}</TableCell>
                  <TableCell>{post.likes}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {post.createdAt}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(STATUS_STYLE[post.status])}
                    >
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-red-600"
                      onClick={() =>
                        setPosts((prev) => prev.filter((p) => p.id !== post.id))
                      }
                    >
                      <Trash2 className="size-3.5" />
                      Remove
                    </Button>
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
