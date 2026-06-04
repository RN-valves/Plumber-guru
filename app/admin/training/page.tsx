"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  MoreHorizontal,
  Plus,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CSV_VIDEO_TEMPLATE,
  MOCK_TRAINING_VIDEOS,
  VIDEO_CATEGORIES,
  VIDEO_LANGUAGES,
  VIDEO_LEVELS,
  type TrainingVideo,
} from "@/lib/admin-content-mock";

export default function TrainingVideosPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [videos, setVideos] = useState(MOCK_TRAINING_VIDEOS);
  const [titleHi, setTitleHi] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [language, setLanguage] = useState("Hindi");
  const [category, setCategory] = useState("Leak Fix");
  const [level, setLevel] = useState("Beginner");

  function toggleStatus(id: string, published: boolean) {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, status: published ? "published" : "draft" }
          : v
      )
    );
  }

  function deleteVideo(id: string) {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  }

  function resetForm() {
    setTitleHi("");
    setTitleEn("");
    setYoutubeUrl("");
    setLanguage("Hindi");
    setCategory("Leak Fix");
    setLevel("Beginner");
  }

  function addVideo(status: "published" | "draft") {
    if (!titleEn.trim()) return;
    const newVideo: TrainingVideo = {
      id: `tv-${Date.now()}`,
      titleHi: titleHi || titleEn,
      titleEn,
      language,
      category,
      level,
      views: 0,
      status,
      thumbnailColor: "#f97316",
      youtubeUrl: youtubeUrl || undefined,
    };
    setVideos((prev) => [newVideo, ...prev]);
    resetForm();
    setFormOpen(false);
  }

  function downloadCsvTemplate() {
    const blob = new Blob([CSV_VIDEO_TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "training-videos-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Training Videos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage multilingual plumbing training content
        </p>
      </div>

      <Collapsible open={formOpen} onOpenChange={setFormOpen}>
        <Card>
          <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-4 text-left">
            <div className="flex items-center gap-2">
              <Plus className="size-4 text-primary" />
              <CardTitle className="text-base">Add New Video</CardTitle>
            </div>
            {formOpen ? (
              <ChevronUp className="size-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="border-t border-border pt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title-hi">Title (Hindi)</Label>
                  <Input
                    id="title-hi"
                    placeholder="हिंदी में शीर्षक"
                    value={titleHi}
                    onChange={(e) => setTitleHi(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title-en">Title (English)</Label>
                  <Input
                    id="title-en"
                    placeholder="English title"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube URL</Label>
                  <Input
                    id="youtube"
                    placeholder="https://youtube.com/watch?v=…"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="video-file">Or upload video file</Label>
                  <Input id="video-file" type="file" accept="video/*" />
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={language}
                    onValueChange={(v) => v && setLanguage(v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VIDEO_LANGUAGES.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={category}
                    onValueChange={(v) => v && setCategory(v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VIDEO_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select value={level} onValueChange={(v) => v && setLevel(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VIDEO_LEVELS.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumb">Thumbnail upload</Label>
                  <Input id="thumb" type="file" accept="image/*" />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={() => addVideo("published")}>Publish</Button>
                <Button variant="secondary" onClick={() => addVideo("draft")}>
                  Save Draft
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bulk upload</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={downloadCsvTemplate}>
            <Download className="size-4" />
            Download CSV template
          </Button>
          <Input type="file" accept=".csv" className="max-w-xs" />
          <Button variant="secondary" className="gap-2">
            <Upload className="size-4" />
            Upload CSV
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Thumb</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell>
                    <div
                      className="flex size-12 items-center justify-center rounded-md text-xs font-bold text-white"
                      style={{ backgroundColor: video.thumbnailColor }}
                    >
                      PG
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{video.titleEn}</p>
                    <p className="text-xs text-muted-foreground">
                      {video.titleHi}
                    </p>
                    <Badge variant="outline" className="mt-1 text-[10px]">
                      {video.level}
                    </Badge>
                  </TableCell>
                  <TableCell>{video.language}</TableCell>
                  <TableCell>{video.category}</TableCell>
                  <TableCell>
                    {video.views.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={video.status === "published"}
                        onCheckedChange={(c) => toggleStatus(video.id, !!c)}
                        aria-label="Toggle publish status"
                      />
                      <span className="text-xs text-muted-foreground">
                        {video.status === "published" ? "Published" : "Draft"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Video actions"
                          />
                        }
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            href="/training"
                            className="flex items-center gap-2"
                            target="_blank"
                          >
                            <ExternalLink className="size-3.5" />
                            View on site
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => deleteVideo(video.id)}
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
