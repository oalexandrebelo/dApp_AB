"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    LayoutDashboard,
    ArrowLeftRight,
    PiggyBank,
    Receipt,
    Settings,
    ChevronLeft,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function AppSidebar() {
    const pathname = usePathname();
    const { t } = useLanguage();
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    const navigation = [
        {
            label: t.dashboard.sidebar.dashboard,
            icon: LayoutDashboard,
            href: "/dashboard",
            color: "text-cyan-400",
            bgActive: "bg-cyan-500/10",
        },
        {
            label: t.dashboard.sidebar.supply,
            icon: PiggyBank,
            href: "/dashboard/supply",
            color: "text-emerald-400",
            bgActive: "bg-emerald-500/10",
        },
        {
            label: t.dashboard.sidebar.borrow,
            icon: Receipt,
            href: "/dashboard/borrow",
            color: "text-orange-400",
            bgActive: "bg-orange-500/10",
        },
        {
            label: t.dashboard.sidebar.transactions,
            icon: ArrowLeftRight,
            href: "/dashboard/transactions",
            color: "text-violet-400",
            bgActive: "bg-violet-500/10",
        },
        {
            label: t.dashboard.sidebar.settings,
            icon: Settings,
            href: "/dashboard/settings",
            color: "text-slate-400",
            bgActive: "bg-slate-500/10",
        },
    ];

    return (
        <Sidebar collapsible="icon" className="border-r-0">
            <SidebarHeader className="p-4">
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/logo-icon.svg"
                        alt="Nexux"
                        width={32}
                        height={32}
                        className="shrink-0"
                    />
                    {!isCollapsed && (
                        <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                            Nexux Lend
                        </span>
                    )}
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;

                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.label}
                                            className={cn(
                                                "transition-all duration-200",
                                                isActive && [
                                                    item.bgActive,
                                                    item.color,
                                                    "font-medium",
                                                ]
                                            )}
                                        >
                                            <Link href={item.href}>
                                                <Icon
                                                    className={cn(
                                                        "h-4 w-4 transition-colors",
                                                        isActive
                                                            ? item.color
                                                            : "text-muted-foreground"
                                                    )}
                                                />
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4">
                {!isCollapsed && (
                    <div className="rounded-lg bg-sidebar-accent/50 p-3 space-y-2">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            Language
                        </p>
                        <LanguageSwitcher />
                    </div>
                )}
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
