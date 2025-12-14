"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { Monitor, Shield, DollarSign, Bell, Zap, Download, ArrowLeft } from "lucide-react";
import { useLanguage } from '@/lib/i18n';
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const { toast } = useToast();

    // Account Settings
    const [slippage, setSlippage] = useState("0.5");
    const [deadline, setDeadline] = useState("20");

    // Display Settings
    const [currency, setCurrency] = useState("USD");
    const [theme, setTheme] = useState("dark");
    const [compactMode, setCompactMode] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);

    // Notifications
    const [liquidationAlerts, setLiquidationAlerts] = useState(true);
    const [txNotifications, setTxNotifications] = useState(true);
    const [apyChanges, setApyChanges] = useState(false);

    // Load settings from localStorage
    useEffect(() => {
        const savedSettings = localStorage.getItem("nexux-settings");
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            setSlippage(settings.slippage || "0.5");
            setDeadline(settings.deadline || "20");
            setCurrency(settings.currency || "USD");
            setTheme(settings.theme || "dark");
            setCompactMode(settings.compactMode || false);
            setReducedMotion(settings.reducedMotion || false);
            setLiquidationAlerts(settings.liquidationAlerts ?? true);
            setTxNotifications(settings.txNotifications ?? true);
            setApyChanges(settings.apyChanges || false);
        }
    }, []);

    const saveSettings = () => {
        const settings = {
            slippage,
            deadline,
            currency,
            theme,
            compactMode,
            reducedMotion,
            liquidationAlerts,
            txNotifications,
            apyChanges,
        };

        localStorage.setItem("nexux-settings", JSON.stringify(settings));

        toast({
            title: "Settings Saved",
            description: "Your preferences have been updated successfully.",
        });
    };

    const exportData = () => {
        const data = {
            settings: JSON.parse(localStorage.getItem("nexux-settings") || "{}"),
            transactions: JSON.parse(localStorage.getItem("nexux-transactions") || "[]"),
            apyHistory: JSON.parse(localStorage.getItem("nexux-apy-history") || "[]"),
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `nexux-data-${new Date().toISOString().split("T")[0]}.json`;
        a.click();

        toast({
            title: "Data Exported",
            description: "Your data has been downloaded successfully.",
        });
    };

    return (
        <div className="space-y-8">
            {/* Back Button */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/dashboard')}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Button>
            </div>

            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t.dashboard.settings_page.title}</h1>
                <p className="text-muted-foreground">{t.dashboard.settings_page.subtitle}</p>
            </div>

            <div className="space-y-6">
                {/* Account Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Account Settings
                        </CardTitle>
                        <CardDescription>
                            Configure transaction defaults and preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="slippage">Slippage Tolerance (%)</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="slippage"
                                    type="number"
                                    step="0.1"
                                    min="0.1"
                                    max="5"
                                    value={slippage}
                                    onChange={(e) => setSlippage(e.target.value)}
                                    className="max-w-[200px]"
                                />
                                <div className="flex gap-2">
                                    {["0.1", "0.5", "1.0"].map((value) => (
                                        <Button
                                            key={value}
                                            variant={slippage === value ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSlippage(value)}
                                        >
                                            {value}%
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Maximum price movement tolerance for transactions
                            </p>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label htmlFor="deadline">Transaction Deadline (minutes)</Label>
                            <Input
                                id="deadline"
                                type="number"
                                min="1"
                                max="60"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="max-w-[200px]"
                            />
                            <p className="text-xs text-muted-foreground">
                                Time limit for transaction execution
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Display Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Monitor className="h-5 w-5 text-indigo-400" />
                            <CardTitle>Display Settings</CardTitle>
                        </div>
                        <CardDescription>
                            Customize how information is displayed
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select value={currency} onValueChange={setCurrency}>
                                <SelectTrigger id="currency" className="max-w-[200px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USD">USD ($)</SelectItem>
                                    <SelectItem value="EUR">EUR (€)</SelectItem>
                                    <SelectItem value="BTC">BTC (₿)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label htmlFor="theme">Theme</Label>
                            <Select value={theme} onValueChange={setTheme}>
                                <SelectTrigger id="theme" className="max-w-[200px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="compact">Compact Mode</Label>
                                <p className="text-xs text-muted-foreground">
                                    Reduce spacing for more content
                                </p>
                            </div>
                            <Switch
                                id="compact"
                                checked={compactMode}
                                onCheckedChange={setCompactMode}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="reducedMotion">{t.dashboard.settings_page.reduced_motion}</Label>
                                <p className="text-xs text-muted-foreground">
                                    {t.dashboard.settings_page.reduced_motion_desc}
                                </p>
                            </div>
                            <Switch
                                id="reducedMotion"
                                checked={reducedMotion}
                                onCheckedChange={setReducedMotion}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notifications
                        </CardTitle>
                        <CardDescription>
                            Manage alert preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="liquidation">Liquidation Risk Alerts</Label>
                                <p className="text-xs text-muted-foreground">
                                    Get notified when health factor is low
                                </p>
                            </div>
                            <Switch
                                id="liquidation"
                                checked={liquidationAlerts}
                                onCheckedChange={setLiquidationAlerts}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="transactions">Transaction Confirmations</Label>
                                <p className="text-xs text-muted-foreground">
                                    Show notifications for completed transactions
                                </p>
                            </div>
                            <Switch
                                id="transactions"
                                checked={txNotifications}
                                onCheckedChange={setTxNotifications}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="apy">APY Change Alerts</Label>
                                <p className="text-xs text-muted-foreground">
                                    Notify when APY changes significantly
                                </p>
                            </div>
                            <Switch
                                id="apy"
                                checked={apyChanges}
                                onCheckedChange={setApyChanges}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Security & Advanced */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-green-400" />
                            <CardTitle>Security & Advanced</CardTitle>
                        </div>
                        <CardDescription>
                            Wallet connection and data management
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Wallet Connection</Label>
                                <p className="text-xs text-muted-foreground">
                                    {t.dashboard.settings_page.connected_text}
                                </p>
                            </div>
                            <Button variant="destructive" size="sm">
                                {t.dashboard.settings_page.disconnect_btn}
                            </Button>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Export Data</Label>
                                <p className="text-xs text-muted-foreground">
                                    Download your transaction history and settings
                                </p>
                            </div>
                            <Button onClick={exportData} variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Clear Cache</Label>
                                <p className="text-xs text-muted-foreground">
                                    Reset local data and preferences
                                </p>
                            </div>
                            <Button
                                onClick={() => {
                                    localStorage.clear();
                                    toast({
                                        title: "Cache Cleared",
                                        description: "All local data has been reset.",
                                    });
                                }}
                                variant="outline"
                                size="sm"
                            >
                                Clear
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => router.push('/dashboard')}>
                        Cancel
                    </Button>
                    <Button onClick={saveSettings}>
                        Save Settings
                    </Button>
                </div>
            </div>
        </div>
    );
}
