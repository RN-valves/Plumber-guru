"use client";

import { useMemo } from "react";
import { AlertCircle, CheckCircle2, MinusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LOCALE_HOME_PREFIXES } from "@/lib/seo-defaults";
import {
  PUBLIC_PAGE_SEO_LABELS,
  pageSeoHealth,
} from "@/lib/site-settings-defaults";
import type { LocaleHomeKey, SeoSettings } from "@/types/site-settings";
import { getLocaleLabel, type Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

type SeoSettingsTabProps = {
  seo: SeoSettings;
  onChange: (seo: SeoSettings) => void;
};

function HealthBadge({ score }: { score: "good" | "warning" | "poor" }) {
  const styles = {
    good: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
    poor: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  };

  const Icon =
    score === "good"
      ? CheckCircle2
      : score === "warning"
        ? MinusCircle
        : AlertCircle;

  return (
    <Badge className={cn("gap-1 capitalize", styles[score])}>
      <Icon className="size-3" />
      {score}
    </Badge>
  );
}

export function SeoSettingsTab({ seo, onChange }: SeoSettingsTabProps) {
  const pageKeys = useMemo(
    () => Object.keys(PUBLIC_PAGE_SEO_LABELS) as (keyof typeof PUBLIC_PAGE_SEO_LABELS)[],
    []
  );

  function updateGlobal<K extends keyof SeoSettings>(key: K, value: SeoSettings[K]) {
    onChange({ ...seo, [key]: value });
  }

  function updatePage(
    key: keyof typeof PUBLIC_PAGE_SEO_LABELS,
    field: "title" | "description" | "keywords" | "focusKeyword",
    value: string
  ) {
    onChange({
      ...seo,
      pages: {
        ...seo.pages,
        [key]: { ...seo.pages[key], [field]: value },
      },
    });
  }

  function updateLocalePage(
    locale: LocaleHomeKey,
    field: "title" | "description",
    value: string
  ) {
    onChange({
      ...seo,
      localePages: {
        ...seo.localePages,
        [locale]: { ...seo.localePages[locale], [field]: value },
      },
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Global SEO</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="seo-site-url">Site URL (canonical base)</Label>
            <Input
              id="seo-site-url"
              placeholder="https://plumber-guru.com"
              value={seo.siteUrl}
              onChange={(e) => updateGlobal("siteUrl", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo-tagline-en">Tagline (English)</Label>
            <Input
              id="seo-tagline-en"
              value={seo.taglineEn}
              onChange={(e) => updateGlobal("taglineEn", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo-tagline-hi">Tagline (Hindi)</Label>
            <Input
              id="seo-tagline-hi"
              value={seo.taglineHi}
              onChange={(e) => updateGlobal("taglineHi", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="seo-default-desc">Default meta description</Label>
            <Textarea
              id="seo-default-desc"
              rows={3}
              value={seo.defaultDescription}
              onChange={(e) => updateGlobal("defaultDescription", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="seo-default-keywords">Default keywords</Label>
            <Input
              id="seo-default-keywords"
              placeholder="plumber, plumbing, India, प्लंबर"
              value={seo.defaultKeywords}
              onChange={(e) => updateGlobal("defaultKeywords", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Comma-separated</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo-support-email">Support email</Label>
            <Input
              id="seo-support-email"
              type="email"
              value={seo.supportEmail}
              onChange={(e) => updateGlobal("supportEmail", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo-twitter">Twitter handle</Label>
            <Input
              id="seo-twitter"
              placeholder="@plumberguru"
              value={seo.twitterHandle}
              onChange={(e) => updateGlobal("twitterHandle", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="seo-og-image">Custom OG image URL (optional)</Label>
            <Input
              id="seo-og-image"
              placeholder="https://plumber-guru.com/og-image.png"
              value={seo.ogImageUrl}
              onChange={(e) => updateGlobal("ogImageUrl", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to use auto-generated share image (1200×630)
            </p>
          </div>
          <Separator className="sm:col-span-2" />
          <p className="text-sm font-medium sm:col-span-2">
            Search engine verification
          </p>
          <div className="space-y-2">
            <Label htmlFor="seo-google">Google Search Console</Label>
            <Input
              id="seo-google"
              placeholder="verification code"
              value={seo.googleVerification}
              onChange={(e) => updateGlobal("googleVerification", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo-bing">Bing Webmaster</Label>
            <Input
              id="seo-bing"
              placeholder="msvalidate.01 code"
              value={seo.bingVerification}
              onChange={(e) => updateGlobal("bingVerification", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="seo-yandex">Yandex</Label>
            <Input
              id="seo-yandex"
              value={seo.yandexVerification}
              onChange={(e) => updateGlobal("yandexVerification", e.target.value)}
            />
          </div>
          <Separator className="sm:col-span-2" />
          <p className="text-sm font-medium sm:col-span-2">Social profiles (schema)</p>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="seo-facebook">Facebook URL</Label>
            <Input
              id="seo-facebook"
              value={seo.facebookUrl}
              onChange={(e) => updateGlobal("facebookUrl", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="seo-linkedin">LinkedIn URL</Label>
            <Input
              id="seo-linkedin"
              value={seo.linkedinUrl}
              onChange={(e) => updateGlobal("linkedinUrl", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Page SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {pageKeys.map((key) => {
            const page = seo.pages[key];
            const meta = PUBLIC_PAGE_SEO_LABELS[key];
            const health = pageSeoHealth(page.title, page.description);

            return (
              <div
                key={key}
                className="space-y-4 rounded-xl border border-border p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">{meta.label}</p>
                    <p className="text-xs text-muted-foreground">{meta.path}</p>
                  </div>
                  <HealthBadge score={health.score} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Meta title</Label>
                    <Input
                      value={page.title}
                      onChange={(e) => updatePage(key, "title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Meta description</Label>
                    <Textarea
                      rows={2}
                      value={page.description}
                      onChange={(e) =>
                        updatePage(key, "description", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Keywords</Label>
                    <Input
                      value={page.keywords}
                      onChange={(e) =>
                        updatePage(key, "keywords", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Focus keyword</Label>
                    <Input
                      value={page.focusKeyword}
                      onChange={(e) =>
                        updatePage(key, "focusKeyword", e.target.value)
                      }
                    />
                  </div>
                </div>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {health.checks.map((check) => (
                    <li key={check.label} className="flex items-center gap-2">
                      <HealthBadge score={check.status} />
                      {check.label}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Locale homepages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {LOCALE_HOME_PREFIXES.map((locale) => (
            <div
              key={locale}
              className="space-y-4 rounded-xl border border-border p-4"
            >
              <p className="font-medium">
                {getLocaleLabel(locale as Locale)} ({locale})
              </p>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={seo.localePages[locale].title}
                    onChange={(e) =>
                      updateLocalePage(locale, "title", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    rows={2}
                    value={seo.localePages[locale].description}
                    onChange={(e) =>
                      updateLocalePage(locale, "description", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
