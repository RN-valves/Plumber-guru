"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { Loader2, Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { SeoSettingsTab } from "@/components/admin/SeoSettingsTab";
import { NOTIFICATION_EVENTS } from "@/lib/admin-settings-mock";
import { getDefaultSiteSettings } from "@/lib/site-settings-defaults";
import type { SiteSettingsDocument } from "@/types/site-settings";

async function fetcher(url: string): Promise<SiteSettingsDocument> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error || `Request failed (${res.status})`
    );
  }
  return res.json() as Promise<SiteSettingsDocument>;
}

export default function SiteSettingsPage() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/settings",
    fetcher
  );
  const defaults = getDefaultSiteSettings();

  const [general, setGeneral] = useState(defaults.general);
  const [seo, setSeo] = useState(defaults.seo);
  const [homepage, setHomepage] = useState(defaults.homepage);
  const [payment, setPayment] = useState(defaults.payment);
  const [notifEnabled, setNotifEnabled] = useState(defaults.notifications.enabled);
  const [templates, setTemplates] = useState(defaults.notifications.templates);
  const [newCity, setNewCity] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!data) return;
    setGeneral(data.general);
    setSeo(data.seo);
    setHomepage(data.homepage);
    setPayment(data.payment);
    setNotifEnabled(data.notifications.enabled);
    setTemplates(data.notifications.templates);
  }, [data]);

  async function handleSave(
    section: "general" | "seo" | "homepage" | "notifications" | "payment"
  ) {
    setSaving(true);
    setSaveError("");
    setSaved(false);

    const payload = {
      general: section === "general" ? general : undefined,
      seo: section === "seo" ? seo : undefined,
      homepage: section === "homepage" ? homepage : undefined,
      notifications:
        section === "notifications"
          ? { enabled: notifEnabled, templates }
          : undefined,
      payment: section === "payment" ? payment : undefined,
    };

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          (body as { error?: string }).error || "Failed to save settings"
        );
      }

      const updated = (await res.json()) as SiteSettingsDocument;
      await mutate(updated, false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  function addCity() {
    const city = newCity.trim();
    if (!city || homepage.featuredCities.includes(city)) return;
    setHomepage((h) => ({
      ...h,
      featuredCities: [...h.featuredCities, city],
    }));
    setNewCity("");
  }

  function removeCity(city: string) {
    setHomepage((h) => ({
      ...h,
      featuredCities: h.featuredCities.filter((c) => c !== city),
    }));
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        Loading settings…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
        Failed to load settings: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Site Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure platform-wide options and SEO for Plumber Guru
          </p>
          {data?.updatedAt ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Last saved: {new Date(data.updatedAt).toLocaleString("en-IN")}
              {data.updatedBy ? ` by ${data.updatedBy}` : ""}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {saved ? (
            <Badge className="bg-green-600">Settings saved successfully</Badge>
          ) : null}
          {saveError ? (
            <Badge variant="destructive">{saveError}</Badge>
          ) : null}
        </div>
      </div>

      <Tabs defaultValue="seo" className="w-full">
        <TabsList
          variant="line"
          className="h-auto w-full max-w-none flex-wrap justify-start gap-0 rounded-none border-b border-border bg-transparent p-0"
        >
          <TabsTrigger value="seo" className="px-4 py-2.5">
            SEO
          </TabsTrigger>
          <TabsTrigger value="general" className="px-4 py-2.5">
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="px-4 py-2.5">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="homepage" className="px-4 py-2.5">
            Homepage
          </TabsTrigger>
          <TabsTrigger value="payment" className="px-4 py-2.5">
            Payment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="seo" className="mt-6 space-y-6">
          <SeoSettingsTab seo={seo} onChange={setSeo} />
          <SaveBar
            onSave={() => handleSave("seo")}
            saving={saving}
            label="Save SEO settings"
          />
        </TabsContent>

        <TabsContent value="general" className="mt-6 space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-base">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid w-full gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site name</Label>
                <Input
                  id="site-name"
                  value={general.siteName}
                  onChange={(e) =>
                    setGeneral((g) => ({ ...g, siteName: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={general.tagline}
                  onChange={(e) =>
                    setGeneral((g) => ({ ...g, tagline: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Contact phone</Label>
                <Input
                  id="phone"
                  value={general.contactPhone}
                  onChange={(e) =>
                    setGeneral((g) => ({ ...g, contactPhone: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Contact email</Label>
                <Input
                  id="email"
                  type="email"
                  value={general.contactEmail}
                  onChange={(e) =>
                    setGeneral((g) => ({ ...g, contactEmail: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="whatsapp">WhatsApp number</Label>
                <Input
                  id="whatsapp"
                  value={general.whatsapp}
                  onChange={(e) =>
                    setGeneral((g) => ({ ...g, whatsapp: e.target.value }))
                  }
                />
              </div>
              <Separator className="sm:col-span-2" />
              <p className="text-sm font-medium text-foreground sm:col-span-2">
                Social media links
              </p>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="youtube">YouTube</Label>
                <Input
                  id="youtube"
                  className="w-full"
                  value={general.youtube}
                  onChange={(e) =>
                    setGeneral((g) => ({ ...g, youtube: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  className="w-full"
                  value={general.instagram}
                  onChange={(e) =>
                    setGeneral((g) => ({ ...g, instagram: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="wa-channel">WhatsApp channel</Label>
                <Input
                  id="wa-channel"
                  className="w-full"
                  value={general.whatsappChannel}
                  onChange={(e) =>
                    setGeneral((g) => ({
                      ...g,
                      whatsappChannel: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">Maintenance mode</p>
                  <p className="text-sm text-muted-foreground">
                    Show maintenance page to all public visitors
                  </p>
                </div>
                <Switch
                  checked={general.maintenanceMode}
                  onCheckedChange={(c) =>
                    setGeneral((g) => ({ ...g, maintenanceMode: !!c }))
                  }
                />
              </div>
            </CardContent>
          </Card>
          <SaveBar
            onSave={() => handleSave("general")}
            saving={saving}
            label="Save general settings"
          />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-4">
          {NOTIFICATION_EVENTS.map((event) => (
            <Card key={event.id}>
              <CardContent className="space-y-4 pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{event.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.channel}
                    </p>
                  </div>
                  <Switch
                    checked={notifEnabled[event.id] ?? false}
                    onCheckedChange={(c) =>
                      setNotifEnabled((n) => ({ ...n, [event.id]: !!c }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>SMS / notification template</Label>
                  <Textarea
                    rows={2}
                    value={templates[event.templateKey] ?? ""}
                    onChange={(e) =>
                      setTemplates((t) => ({
                        ...t,
                        [event.templateKey]: e.target.value,
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Variables:{" "}
                    {event.variables.map((v) => (
                      <code
                        key={v}
                        className="mr-1 rounded bg-muted px-1 py-0.5"
                      >
                        {v}
                      </code>
                    ))}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
          <SaveBar
            onSave={() => handleSave("notifications")}
            saving={saving}
            label="Save notification settings"
          />
        </TabsContent>

        <TabsContent value="homepage" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Homepage stats</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <StatField
                label="Plumbers stat"
                value={homepage.statPlumbers}
                onChange={(v) =>
                  setHomepage((h) => ({ ...h, statPlumbers: v }))
                }
              />
              <StatField
                label="Jobs stat"
                value={homepage.statJobs}
                onChange={(v) => setHomepage((h) => ({ ...h, statJobs: v }))}
              />
              <StatField
                label="Cities stat"
                value={homepage.statCities}
                onChange={(v) => setHomepage((h) => ({ ...h, statCities: v }))}
              />
              <StatField
                label="Training videos stat"
                value={homepage.statTraining}
                onChange={(v) =>
                  setHomepage((h) => ({ ...h, statTraining: v }))
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Section toggles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ToggleRow
                label="Podcast section"
                description="Show latest podcast episodes on homepage"
                checked={homepage.showPodcast}
                onChange={(c) =>
                  setHomepage((h) => ({ ...h, showPodcast: c }))
                }
              />
              <ToggleRow
                label="Testimonials"
                description="Show plumber success stories carousel"
                checked={homepage.showTestimonials}
                onChange={(c) =>
                  setHomepage((h) => ({ ...h, showTestimonials: c }))
                }
              />
              <ToggleRow
                label="Language banner"
                description="Show multilingual support banner"
                checked={homepage.showLanguageBanner}
                onChange={(c) =>
                  setHomepage((h) => ({ ...h, showLanguageBanner: c }))
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Featured cities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {homepage.featuredCities.map((city) => (
                  <Badge
                    key={city}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    {city}
                    <button
                      type="button"
                      onClick={() => removeCity(city)}
                      className="rounded-full p-0.5 hover:bg-muted"
                      aria-label={`Remove ${city}`}
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add city name"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCity()}
                />
                <Button type="button" variant="outline" onClick={addCity}>
                  <Plus className="size-4" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
          <SaveBar
            onSave={() => handleSave("homepage")}
            saving={saving}
            label="Save homepage settings"
          />
        </TabsContent>

        <TabsContent value="payment" className="mt-6 space-y-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-base">Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid w-full gap-6 sm:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="razorpay">Razorpay API key</Label>
                <Input
                  id="razorpay"
                  type="password"
                  placeholder="rzp_live_…"
                  value={payment.razorpayKey}
                  onChange={(e) =>
                    setPayment((p) => ({ ...p, razorpayKey: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commission">Job lead commission (%)</Label>
                <Input
                  id="commission"
                  type="number"
                  min="0"
                  max="100"
                  value={payment.leadCommission}
                  onChange={(e) =>
                    setPayment((p) => ({
                      ...p,
                      leadCommission: e.target.value,
                    }))
                  }
                />
              </div>
              <Separator className="md:col-span-2" />
              <p className="text-sm font-medium md:col-span-2">
                Brand Partnership pricing (₹/month)
              </p>
              <div className="space-y-2">
                <Label htmlFor="basic">Basic plan</Label>
                <Input
                  id="basic"
                  type="number"
                  value={payment.brandBasic}
                  onChange={(e) =>
                    setPayment((p) => ({ ...p, brandBasic: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pro">Pro plan</Label>
                <Input
                  id="pro"
                  type="number"
                  value={payment.brandPro}
                  onChange={(e) =>
                    setPayment((p) => ({ ...p, brandPro: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="enterprise">Enterprise plan</Label>
                <Input
                  id="enterprise"
                  type="number"
                  value={payment.brandEnterprise}
                  onChange={(e) =>
                    setPayment((p) => ({
                      ...p,
                      brandEnterprise: e.target.value,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
          <SaveBar
            onSave={() => handleSave("payment")}
            saving={saving}
            label="Save payment settings"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SaveBar({
  onSave,
  saving,
  label,
}: {
  onSave: () => void;
  saving: boolean;
  label: string;
}) {
  return (
    <div className="sticky bottom-0 flex justify-end border-t border-border bg-gray-50/95 py-4 backdrop-blur dark:bg-gray-900/95">
      <Button className="gap-2" onClick={onSave} disabled={saving}>
        {saving ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Save className="size-4" />
        )}
        {saving ? "Saving…" : label}
      </Button>
    </div>
  );
}

function StatField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
