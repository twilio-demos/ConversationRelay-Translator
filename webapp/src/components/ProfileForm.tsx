"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES, UserProfile, VOICES } from "@/types/profile";
import { useState } from "react";

interface ProfileFormProps {
  profile?: UserProfile;
  onSubmit: (profile: UserProfile) => Promise<void>;
}

export function ProfileForm({ profile, onSubmit }: ProfileFormProps) {
  const [formData, setFormData] = useState<UserProfile>(
    profile || {
      phoneNumber: "",
      name: "",
      sourceLanguage: "en-US",
      sourceLanguageCode: "en",
      sourceLanguageFriendly: "English - United States",
      sourceTranscriptionProvider: "Deepgram",
      sourceTtsProvider: "Amazon",
      sourceVoice: "Matthew-Generative",
      calleeDetails: true,
      calleeNumber: "",
      calleeLanguage: "es-MX",
      calleeLanguageCode: "es-MX",
      calleeLanguageFriendly: "Spanish - Mexico",
      calleeTranscriptionProvider: "Deepgram",
      calleeTtsProvider: "Amazon",
      calleeVoice: "Lupe-Generative",
      useFlex: false,
      flexNumber: "",
      flexWorkerHandle: "",
    }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof UserProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLanguageChange = (
    type: "source" | "callee",
    languageCode: string
  ) => {
    const language = LANGUAGES.find((l) => l.code === languageCode);
    if (!language) return;

    // Get the first available voice for the new language
    const availableVoices =
      VOICES[language.translateCode as keyof typeof VOICES];
    const defaultVoice = availableVoices?.[0] || "";

    // Update all fields in a single state update
    setFormData((prev) => {
      if (type === "source") {
        return {
          ...prev,
          sourceLanguage: language.code,
          sourceLanguageCode: language.translateCode,
          sourceLanguageFriendly: language.friendly,
          sourceVoice: defaultVoice,
        };
      } else {
        return {
          ...prev,
          calleeLanguage: language.code,
          calleeLanguageCode: language.translateCode,
          calleeLanguageFriendly: language.friendly,
          calleeVoice: defaultVoice,
        };
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => updateField("phoneNumber", e.target.value)}
                placeholder="+1234567890"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Caller Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Caller Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sourceLanguage">Language</Label>
              <Select
                value={formData.sourceLanguage}
                onValueChange={(value) =>
                  handleLanguageChange("source", value)
                }>
                <SelectTrigger id="sourceLanguage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.friendly}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceVoice">Voice</Label>
              <Select
                value={formData.sourceVoice}
                onValueChange={(value) => updateField("sourceVoice", value)}>
                <SelectTrigger id="sourceVoice">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOICES[
                    formData.sourceLanguageCode as keyof typeof VOICES
                  ]?.map((voice) => (
                    <SelectItem key={voice} value={voice}>
                      {voice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceTranscriptionProvider">
                Transcription Provider
              </Label>
              <Select
                value={formData.sourceTranscriptionProvider}
                onValueChange={(value) =>
                  updateField("sourceTranscriptionProvider", value)
                }>
                <SelectTrigger id="sourceTranscriptionProvider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Deepgram">Deepgram</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceTtsProvider">TTS Provider</Label>
              <Select
                value={formData.sourceTtsProvider}
                onValueChange={(value) =>
                  updateField("sourceTtsProvider", value)
                }>
                <SelectTrigger id="sourceTtsProvider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Amazon">Amazon</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Callee Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Callee Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center space-x-2">
            <Checkbox
              id="calleeDetails"
              checked={formData.calleeDetails}
              onCheckedChange={(checked) =>
                updateField("calleeDetails", checked)
              }
            />
            <Label
              htmlFor="calleeDetails"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Use custom callee details
            </Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="calleeNumber">Callee Phone Number</Label>
              <Input
                id="calleeNumber"
                type="tel"
                value={formData.calleeNumber}
                onChange={(e) => updateField("calleeNumber", e.target.value)}
                placeholder="+1234567890"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calleeLanguage">Language</Label>
              <Select
                value={formData.calleeLanguage}
                onValueChange={(value) =>
                  handleLanguageChange("callee", value)
                }>
                <SelectTrigger id="calleeLanguage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.friendly}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="calleeVoice">Voice</Label>
              <Select
                value={formData.calleeVoice}
                onValueChange={(value) => updateField("calleeVoice", value)}>
                <SelectTrigger id="calleeVoice">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOICES[
                    formData.calleeLanguageCode as keyof typeof VOICES
                  ]?.map((voice) => (
                    <SelectItem key={voice} value={voice}>
                      {voice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="calleeTranscriptionProvider">
                Transcription Provider
              </Label>
              <Select
                value={formData.calleeTranscriptionProvider}
                onValueChange={(value) =>
                  updateField("calleeTranscriptionProvider", value)
                }>
                <SelectTrigger id="calleeTranscriptionProvider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Deepgram">Deepgram</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="calleeTtsProvider">TTS Provider</Label>
              <Select
                value={formData.calleeTtsProvider}
                onValueChange={(value) =>
                  updateField("calleeTtsProvider", value)
                }>
                <SelectTrigger id="calleeTtsProvider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Amazon">Amazon</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>

        <div className="px-6 pb-6">
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Flex Settings</h3>
            <div className="rounded-lg space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useFlex"
                  checked={formData.useFlex}
                  onCheckedChange={(checked) => updateField("useFlex", checked)}
                />
                <Label
                  htmlFor="useFlex"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Use Twilio Flex
                </Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="flexNumber">Flex Number</Label>
                  <Input
                    id="flexNumber"
                    type="tel"
                    value={formData.flexNumber || ""}
                    onChange={(e) => updateField("flexNumber", e.target.value)}
                    placeholder="+1234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flexWorkerHandle">Flex Worker Handle</Label>
                  <Input
                    id="flexWorkerHandle"
                    type="text"
                    value={formData.flexWorkerHandle}
                    onChange={(e) =>
                      updateField("flexWorkerHandle", e.target.value)
                    }
                    placeholder="worker@example.com"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
}
