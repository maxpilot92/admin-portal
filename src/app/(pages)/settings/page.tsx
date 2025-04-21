"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Loader2, Check } from "lucide-react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/image-upload";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useTheme } from "next-themes";

// Define the type for settings
interface Settings {
  id?: string;
  siteName: string;
  siteUrl: string;
  siteLogo: string;
  siteFavicon: string;
  mode: "light" | "dark" | "system";
}

// Define the type for loading states
interface LoadingStates {
  siteName: boolean;
  siteUrl: boolean;
  siteLogo: boolean;
  siteFavicon: boolean;
  mode: boolean;
  initial: boolean;
}

// Track which fields have been changed
interface ChangedFields {
  siteName: boolean;
  siteUrl: boolean;
  siteLogo: boolean;
  siteFavicon: boolean;
  mode: boolean;
}

export default function SettingsPage() {
  // Original settings (for tracking changes)
  const [originalSettings, setOriginalSettings] = useState<Settings>({
    siteName: "",
    siteUrl: "",
    siteLogo: "",
    siteFavicon: "",
    mode: "system",
  });

  // Current settings state
  const [settings, setSettings] = useState<Settings>({
    siteName: "",
    siteUrl: "",
    siteLogo: "",
    siteFavicon: "",
    mode: "system",
  });

  // Track if settings exist in the database
  const [settingsExist, setSettingsExist] = useState<boolean>(false);

  // Track which fields have been changed
  const [changedFields, setChangedFields] = useState<ChangedFields>({
    siteName: false,
    siteUrl: false,
    siteLogo: false,
    siteFavicon: false,
    mode: false,
  });

  // Loading states for each setting
  const [loading, setLoading] = useState<LoadingStates>({
    siteName: false,
    siteUrl: false,
    siteLogo: false,
    siteFavicon: false,
    mode: false,
    initial: true,
  });

  // Error states
  const [errors, setErrors] = useState<Partial<Record<keyof Settings, string>>>(
    {}
  );

  // Success message state
  const [saveSuccess, setSaveSuccess] = useState<
    Record<keyof ChangedFields, boolean>
  >({
    siteName: false,
    siteUrl: false,
    siteLogo: false,
    siteFavicon: false,
    mode: false,
  });

  const { setTheme } = useTheme();

  // Fetch current settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("/api/settings");
        console.log("Fetched settings:", response.data);
        if (response.data && response.data.length > 0) {
          // Settings exist
          const data = response.data[0]; // Get the first setting object
          setSettingsExist(true);

          // Update settings with fetched data
          const fetchedSettings = {
            id: data.id,
            siteName: data.siteName || "",
            siteUrl: data.siteUrl || "",
            siteLogo: data.siteLogo || "",
            siteFavicon: data.siteFavicon || "",
            mode: data.mode || "system",
          };

          setSettings(fetchedSettings);
          setOriginalSettings(fetchedSettings);
        } else {
          // No settings found
          setSettingsExist(false);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        // Assume settings don't exist if there's an error
        setSettingsExist(false);
      } finally {
        setLoading((prev) => ({ ...prev, initial: false }));
      }
    };

    fetchSettings();
  }, []);

  // Validate URL format
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name as keyof Settings;

    // Update settings
    setSettings((prev) => ({ ...prev, [key]: value }));

    // Mark field as changed
    setChangedFields((prev) => ({
      ...prev,
      [key]: value !== originalSettings[key],
    }));

    // Validate input
    let error: string | undefined;

    if (key === "siteName") {
      if (!value.trim()) error = "Site name is required";
    } else if (key === "siteUrl") {
      if (!value.trim()) error = "Site URL is required";
      else if (!isValidUrl(value)) error = "Please enter a valid URL";
    }

    // Update error state
    setErrors((prev) => ({ ...prev, [key]: error }));
  };

  // Handle mode selection
  const handleModeChange = (value: string) => {
    setSettings((prev) => ({
      ...prev,
      mode: value as "light" | "dark" | "system",
    }));
    setTheme(value);
    setChangedFields((prev) => ({
      ...prev,
      mode: value !== originalSettings.mode,
    }));
  };

  // Handle logo upload
  const handleLogoUpload = (url: string) => {
    setSettings((prev) => ({ ...prev, siteLogo: url }));
    setChangedFields((prev) => ({
      ...prev,
      siteLogo: url !== originalSettings.siteLogo,
    }));
  };

  // Handle favicon upload
  const handleFaviconUpload = (url: string) => {
    setSettings((prev) => ({ ...prev, siteFavicon: url }));
    setChangedFields((prev) => ({
      ...prev,
      siteFavicon: url !== originalSettings.siteFavicon,
    }));
  };

  // Update a single setting
  const updateSetting = async <K extends keyof Settings>(key: K) => {
    // Don't update if there's an error
    if (errors[key]) return;

    // Set loading state for this specific setting
    setLoading((prev) => ({ ...prev, [key]: true }));

    try {
      if (settingsExist) {
        // Update existing setting with PATCH
        const response = await axios.patch("/api/settings", {
          id: settings.id,
          [key]: settings[key],
        });

        if (response.status === 200) {
          // Update was successful
          setOriginalSettings((prev) => ({ ...prev, [key]: settings[key] }));
          setChangedFields((prev) => ({ ...prev, [key]: false }));

          // Show success message
          setSaveSuccess((prev) => ({ ...prev, [key]: true }));
          setTimeout(() => {
            setSaveSuccess((prev) => ({ ...prev, [key]: false }));
          }, 3000);
        }
      } else {
        // Create new settings with POST
        const response = await axios.post("/api/settings", settings);

        if (response.status === 201) {
          // Creation was successful
          setSettingsExist(true);
          setSettings((prev) => ({ ...prev, id: response.data.id }));
          setOriginalSettings(settings);

          // Clear all changed fields
          setChangedFields({
            siteName: false,
            siteUrl: false,
            siteLogo: false,
            siteFavicon: false,
            mode: false,
          });

          // Show success message for all fields
          setSaveSuccess({
            siteName: true,
            siteUrl: true,
            siteLogo: true,
            siteFavicon: true,
            mode: true,
          });
          setTimeout(() => {
            setSaveSuccess({
              siteName: false,
              siteUrl: false,
              siteLogo: false,
              siteFavicon: false,
              mode: false,
            });
          }, 3000);
        }
      }
    } catch (error) {
      console.error(
        `Error ${settingsExist ? "updating" : "creating"} ${key}:`,
        error
      );
    } finally {
      // Clear loading state
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Save all settings at once
  const saveAllSettings = async () => {
    // Validate all settings before saving
    const errors: Partial<Record<keyof Settings, string>> = {};

    if (!settings.siteName.trim()) {
      errors.siteName = "Site name is required";
    }

    if (!settings.siteUrl.trim()) {
      errors.siteUrl = "Site URL is required";
    } else if (!isValidUrl(settings.siteUrl)) {
      errors.siteUrl = "Please enter a valid URL";
    }

    // Update error state
    setErrors(errors);

    // If there are errors, don't proceed
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Set loading state for all settings
    setLoading({
      siteName: true,
      siteUrl: true,
      siteLogo: true,
      siteFavicon: true,
      mode: true,
      initial: false,
    });

    try {
      // Send POST request with all settings
      const response = await axios.post("/api/settings", settings);

      if (response.status === 201) {
        setSettingsExist(true);
        setSettings((prev) => ({ ...prev, id: response.data.id }));
        setOriginalSettings(settings);

        // Clear all changed fields
        setChangedFields({
          siteName: false,
          siteUrl: false,
          siteLogo: false,
          siteFavicon: false,
          mode: false,
        });

        // Show success messages
        setSaveSuccess({
          siteName: true,
          siteUrl: true,
          siteLogo: true,
          siteFavicon: true,
          mode: true,
        });
        setTimeout(() => {
          setSaveSuccess({
            siteName: false,
            siteUrl: false,
            siteLogo: false,
            siteFavicon: false,
            mode: false,
          });
        }, 3000);
      }
    } catch (error) {
      console.error("Error creating settings:", error);
    } finally {
      // Clear loading states
      setLoading({
        siteName: false,
        siteUrl: false,
        siteLogo: false,
        siteFavicon: false,
        mode: false,
        initial: false,
      });
    }
  };

  if (loading.initial) {
    return (
      <div className="container mx-auto py-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Settings</h1>
            {!settingsExist && (
              <Button
                onClick={saveAllSettings}
                disabled={
                  loading.siteName ||
                  loading.siteUrl ||
                  loading.siteLogo ||
                  loading.siteFavicon ||
                  loading.mode
                }
              >
                {loading.siteName ||
                loading.siteUrl ||
                loading.siteLogo ||
                loading.siteFavicon ||
                loading.mode ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </div>
                ) : (
                  "Save All Settings"
                )}
              </Button>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure your site settings and appearance.
                {settingsExist
                  ? " Click 'Update' to save changes."
                  : " Click 'Save All Settings' when you're done."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="siteName">
                    Site Name <span className="text-destructive">*</span>
                  </Label>
                  {saveSuccess.siteName && (
                    <span className="text-sm text-green-500 flex items-center">
                      <Check className="h-4 w-4 mr-1" /> Saved
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      id="siteName"
                      name="siteName"
                      value={settings.siteName}
                      onChange={handleInputChange}
                      placeholder="My Awesome Site"
                      className={errors.siteName ? "border-destructive" : ""}
                    />
                    {errors.siteName && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.siteName}
                      </p>
                    )}
                  </div>
                  {settingsExist && changedFields.siteName && (
                    <Button
                      onClick={() => updateSetting("siteName")}
                      disabled={loading.siteName || !!errors.siteName}
                    >
                      {loading.siteName ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Update"
                      )}
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="siteUrl">
                    Site URL <span className="text-destructive">*</span>
                  </Label>
                  {saveSuccess.siteUrl && (
                    <span className="text-sm text-green-500 flex items-center">
                      <Check className="h-4 w-4 mr-1" /> Saved
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      id="siteUrl"
                      name="siteUrl"
                      value={settings.siteUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      className={errors.siteUrl ? "border-destructive" : ""}
                    />
                    {errors.siteUrl && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.siteUrl}
                      </p>
                    )}
                  </div>
                  {settingsExist && changedFields.siteUrl && (
                    <Button
                      onClick={() => updateSetting("siteUrl")}
                      disabled={loading.siteUrl || !!errors.siteUrl}
                    >
                      {loading.siteUrl ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Update"
                      )}
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Site Logo</Label>
                  {saveSuccess.siteLogo && (
                    <span className="text-sm text-green-500 flex items-center">
                      <Check className="h-4 w-4 mr-1" /> Saved
                    </span>
                  )}
                </div>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <ImageUpload
                      value={settings.siteLogo}
                      onChange={handleLogoUpload}
                      label="Upload Logo"
                      imageHeight={100}
                    />
                  </div>
                  {settingsExist && changedFields.siteLogo && (
                    <Button
                      onClick={() => updateSetting("siteLogo")}
                      disabled={loading.siteLogo}
                    >
                      {loading.siteLogo ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Update"
                      )}
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Site Favicon</Label>
                  {saveSuccess.siteFavicon && (
                    <span className="text-sm text-green-500 flex items-center">
                      <Check className="h-4 w-4 mr-1" /> Saved
                    </span>
                  )}
                </div>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <ImageUpload
                      value={settings.siteFavicon}
                      onChange={handleFaviconUpload}
                      label="Upload Favicon"
                      imageHeight={64}
                      imageWidth={64}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Recommended size: 32x32 or 64x64 pixels
                    </p>
                  </div>
                  {settingsExist && changedFields.siteFavicon && (
                    <Button
                      onClick={() => updateSetting("siteFavicon")}
                      disabled={loading.siteFavicon}
                    >
                      {loading.siteFavicon ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Update"
                      )}
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mode">Theme Mode</Label>
                  {saveSuccess.mode && (
                    <span className="text-sm text-green-500 flex items-center">
                      <Check className="h-4 w-4 mr-1" /> Saved
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Select
                      value={settings.mode}
                      onValueChange={handleModeChange}
                    >
                      <SelectTrigger id="mode">
                        <SelectValue placeholder="Select theme mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {settingsExist && changedFields.mode && (
                    <Button
                      onClick={() => updateSetting("mode")}
                      disabled={loading.mode}
                    >
                      {loading.mode ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Update"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
