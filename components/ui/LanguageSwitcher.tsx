"use client";

import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    const labels = {
        en: "English",
        pt: "Português",
        es: "Español"
    };

    const flags = {
        en: "🇺🇸",
        pt: "🇧🇷",
        es: "🇪🇸"
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                    <span className="text-lg leading-none">{flags[language]}</span>
                    <span className="hidden sm:inline">{labels[language]}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')} className="gap-2">
                    <span className="text-lg">🇺🇸</span> English
                    {language === 'en' && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('pt')} className="gap-2">
                    <span className="text-lg">🇧🇷</span> Português
                    {language === 'pt' && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('es')} className="gap-2">
                    <span className="text-lg">🇪🇸</span> Español
                    {language === 'es' && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
