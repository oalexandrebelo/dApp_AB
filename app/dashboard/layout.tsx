"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { AppSidebar } from "@/components/AppSidebar";
import { OnboardingTour } from "@/components/dashboard/OnboardingTour";
import { GridMotion } from "@/components/react-bits/GridMotion";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dark">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="flex flex-col min-h-screen">
                    {/* Top Navigation Bar */}
                    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur-xl px-4">
                        {/* Mobile Sidebar Trigger */}
                        <SidebarTrigger className="-ml-1 md:hidden" />
                        <Separator orientation="vertical" className="mr-2 h-4 md:hidden" />

                        {/* Logo - Left */}
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            <Image
                                src="/logo.svg"
                                alt="Nexux Lend"
                                width={140}
                                height={35}
                                priority
                            />
                        </Link>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Wallet - Right */}
                        <div className="flex items-center gap-4">
                            <ConnectButton
                                accountStatus={{
                                    smallScreen: "avatar",
                                    largeScreen: "full",
                                }}
                            />
                        </div>
                    </header>

                    {/* Main Content with GridMotion Background */}
                    <div className="flex-1 relative">
                        <GridMotion
                            className="absolute inset-0"
                            cellSize={60}
                            opacity={0.03}
                            color="rgb(6, 182, 212)"
                            interactive={true}
                        />
                        <main className="relative z-10 p-6">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                {children}
                            </motion.div>
                        </main>
                    </div>

                    <OnboardingTour />
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}


