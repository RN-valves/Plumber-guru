"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Headphones,
  Mic,
  MoreHorizontal,
  Pin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  MOCK_PODCAST_EPISODES,
  PODCAST_STATS,
  VIDEO_LANGUAGES,
  type PodcastEpisode,
} from "@/lib/admin-content-mock";

export default function PodcastEpisodesPage() {
  const [episodes, setEpisodes] = useState(MOCK_PODCAST_EPISODES);
  const [title, setTitle] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [description, setDescription] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [guest, setGuest] = useState("");
  const [language, setLanguage] = useState("Hindi");
  const [duration, setDuration] = useState("");
  const [publishDate, setPublishDate] = useState("");

  function toggleFeature(id: string) {
    setEpisodes((prev) =>
      prev.map((e) => (e.id === id ? { ...e, featured: !e.featured } : e))
    );
  }

  function deleteEpisode(id: string) {
    setEpisodes((prev) => prev.filter((e) => e.id !== id));
  }

  function handleAudioUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const audio = document.createElement("audio");
    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      const mins = Math.floor(audio.duration / 60);
      const secs = Math.floor(audio.duration % 60);
      setDuration(`${mins}:${secs.toString().padStart(2, "0")}`);
      URL.revokeObjectURL(audio.src);
    };
    audio.src = URL.createObjectURL(file);
  }

  function addEpisode(mode: "publish" | "schedule" | "draft") {
    if (!title.trim()) return;
    const ep: PodcastEpisode = {
      id: `pe-${Date.now()}`,
      episodeNumber: Number(episodeNumber) || episodes.length + 1,
      title,
      guest: guest || null,
      duration: duration || "30:00",
      plays: 0,
      publishedDate:
        mode === "schedule" && publishDate
          ? publishDate
          : mode === "draft"
            ? "—"
            : new Date().toLocaleDateString("en-IN"),
      status: mode === "draft" ? "draft" : "published",
      featured: false,
      coverColor: "#f97316",
      language,
    };
    setEpisodes((prev) => [ep, ...prev]);
    setTitle("");
    setEpisodeNumber("");
    setDescription("");
    setExternalUrl("");
    setGuest("");
    setDuration("");
    setPublishDate("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Podcast Episodes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage Plumber Guru podcast content
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Episodes"
          value={String(PODCAST_STATS.totalEpisodes)}
          icon={Mic}
        />
        <StatCard
          label="Total Plays"
          value={PODCAST_STATS.totalPlays.toLocaleString("en-IN")}
          icon={Headphones}
        />
        <StatCard
          label="Most Played"
          value={PODCAST_STATS.mostPlayedTitle.replace("Episode 42: ", "Ep. 42")}
          small
        />
        <StatCard
          label="Avg Duration"
          value={PODCAST_STATS.avgDuration}
          icon={Clock}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Episode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="ep-title">Episode title (Hindi)</Label>
              <Input
                id="ep-title"
                placeholder="एपिसोड शीर्षक"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ep-num">Episode number</Label>
              <Input
                id="ep-num"
                type="number"
                placeholder="49"
                value={episodeNumber}
                onChange={(e) => setEpisodeNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guest">Guest name (optional)</Label>
              <Input
                id="guest"
                placeholder="Guest plumber name"
                value={guest}
                onChange={(e) => setGuest(e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audio">Audio file (MP3)</Label>
              <Input
                id="audio"
                type="file"
                accept="audio/mpeg,audio/mp3"
                onChange={handleAudioUpload}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ext-url">External URL (Spotify/JioSaavn)</Label>
              <Input
                id="ext-url"
                placeholder="https://open.spotify.com/episode/…"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cover">Cover image</Label>
              <Input id="cover" type="file" accept="image/*" />
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
              <Label htmlFor="duration">Duration (manual)</Label>
              <Input
                id="duration"
                placeholder="42:18"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pub-date">Publish date</Label>
              <Input
                id="pub-date"
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => addEpisode("publish")}>Publish Now</Button>
            <Button variant="secondary" onClick={() => addEpisode("schedule")}>
              <Calendar className="size-4" />
              Schedule
            </Button>
            <Button variant="outline" onClick={() => addEpisode("draft")}>
              Save Draft
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">Cover</TableHead>
                <TableHead>Ep.</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Plays</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {episodes.map((ep) => (
                <TableRow key={ep.id}>
                  <TableCell>
                    <div
                      className="flex size-10 items-center justify-center rounded-md text-[10px] font-bold text-white"
                      style={{ backgroundColor: ep.coverColor }}
                    >
                      {ep.episodeNumber}
                    </div>
                  </TableCell>
                  <TableCell>#{ep.episodeNumber}</TableCell>
                  <TableCell>
                    <p className="max-w-[200px] font-medium line-clamp-2">
                      {ep.title}
                    </p>
                    {ep.featured && (
                      <Badge className="mt-1 gap-1 text-[10px]">
                        <Pin className="size-3" />
                        Featured
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {ep.guest ?? "—"}
                  </TableCell>
                  <TableCell>{ep.duration}</TableCell>
                  <TableCell>{ep.plays.toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    <span className="text-sm">{ep.publishedDate}</span>
                    {ep.status === "draft" && (
                      <Badge variant="outline" className="ml-1 text-[10px]">
                        Draft
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Episode actions"
                          />
                        }
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleFeature(ep.id)}>
                          {ep.featured ? "Unfeature" : "Feature (homepage)"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => deleteEpisode(ep.id)}
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

function StatCard({
  label,
  value,
  icon: Icon,
  small,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  small?: boolean;
}) {
  return (
    <Card className="py-4">
      <CardContent className="px-4 py-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p
          className={
            small
              ? "mt-1 line-clamp-2 text-sm font-semibold"
              : "text-2xl font-bold"
          }
        >
          {value}
        </p>
        {Icon && (
          <Icon className="absolute right-4 top-4 hidden size-6 text-muted-foreground opacity-50 xl:block" />
        )}
      </CardContent>
    </Card>
  );
}
