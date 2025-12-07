"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Monitor, Shield } from "lucide-react";
import { useLanguage } from '@/lib/i18n';

export default function SettingsPage() {
    const { t } = useLanguage();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t.dashboard.settings_page.title}</h1>
                <p className="text-muted-foreground">{t.dashboard.settings_page.subtitle}</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Monitor className="h-5 w-5 text-indigo-400" />
                            <CardTitle>{t.dashboard.settings_page.interface_title}</CardTitle>
                        </div>
                        <CardDescription>{t.dashboard.settings_page.interface_desc}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <label className="text-base font-medium">{t.dashboard.settings_page.reduced_motion}</label>
                                <p className="text-sm text-muted-foreground">{t.dashboard.settings_page.reduced_motion_desc}</p>
                            </div>
                            {/* Switch Component */}
                            <Switch />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-green-400" />
                            <CardTitle>{t.dashboard.settings_page.security_title}</CardTitle>
                        </div>
                        <CardDescription>{t.dashboard.settings_page.security_desc}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            {t.dashboard.settings_page.connected_text}
                        </p>
                        <Button variant="destructive" size="sm">{t.dashboard.settings_page.disconnect_btn}</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
