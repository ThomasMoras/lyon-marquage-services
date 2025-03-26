"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CookieSettings {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentDialogProps {
  initialSettings: CookieSettings;
  onSave: (settings: CookieSettings) => void;
  onClose: () => void;
}

export default function CookieConsentDialog({
  initialSettings,
  onSave,
  onClose,
}: CookieConsentDialogProps) {
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("simple");
  const [settings, setSettings] = useState<CookieSettings>({
    ...initialSettings,
    necessary: true,
  });

  const handleAcceptAll = () => {
    const newSettings = {
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
    };
    setSettings(newSettings);
    onSave(newSettings);
    setOpen(false);
  };

  const handleRejectAll = () => {
    const newSettings = {
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false,
    };
    setSettings(newSettings);
    onSave(newSettings);
    setOpen(false);
  };

  const handleSavePreferences = () => {
    onSave(settings);
    setOpen(false);
  };

  const toggleSetting = (key: keyof CookieSettings) => {
    if (key === "necessary") return; // Les cookies nécessaires ne peuvent pas être désactivés
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Paramètres des cookies</DialogTitle>
          <DialogDescription>
            Nous utilisons des cookies pour améliorer votre expérience sur notre site. Vous pouvez
            personnaliser vos préférences ci-dessous.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="simple">Simple</TabsTrigger>
            <TabsTrigger value="advanced">Avancé</TabsTrigger>
          </TabsList>

          <TabsContent value="simple" className="py-4">
            <p>Choisissez votre niveau de consentement aux cookies :</p>
            <div className="flex justify-between mt-4 space-x-4">
              <Button variant="outline" onClick={handleRejectAll} className="flex-1">
                Refuser tous
              </Button>
              <Button onClick={handleAcceptAll} className="flex-1">
                Accepter tous
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="necessary" className="font-medium">
                  Cookies nécessaires
                </Label>
                <p className="text-sm text-gray-500">Requis pour le fonctionnement du site</p>
              </div>
              <Switch id="necessary" checked disabled />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="preferences" className="font-medium">
                  Préférences
                </Label>
                <p className="text-sm text-gray-500">Stocke vos préférences (thème, etc.)</p>
              </div>
              <Switch
                id="preferences"
                checked={settings.preferences}
                onCheckedChange={() => toggleSetting("preferences")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="analytics" className="font-medium">
                  Analytiques
                </Label>
                <p className="text-sm text-gray-500">
                  Nous aide à comprendre comment vous utilisez le site
                </p>
              </div>
              <Switch
                id="analytics"
                checked={settings.analytics}
                onCheckedChange={() => toggleSetting("analytics")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketing" className="font-medium">
                  Marketing
                </Label>
                <p className="text-sm text-gray-500">
                  Permet d&apos;afficher des contenus personnalisés
                </p>
              </div>
              <Switch
                id="marketing"
                checked={settings.marketing}
                onCheckedChange={() => toggleSetting("marketing")}
              />
            </div>

            <DialogFooter className="mt-4">
              <Button onClick={handleSavePreferences}>Enregistrer les préférences</Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
