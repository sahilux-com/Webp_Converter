import React from 'react';
import {
    LayoutDashboard,
    Settings,
    History,
    LogOut,
    User,
    Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
                <div className="flex h-16 items-center px-6 border-b border-slate-200">
                    <div className="flex items-center gap-2 font-bold text-lg text-slate-900">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white">W</span>
                        </div>
                        WebP Studio
                    </div>
                </div>
                <ScrollArea className="flex-1 px-4 py-6">
                    <nav className="flex flex-col gap-2">
                        <Button variant="secondary" className="justify-start gap-3 w-full bg-slate-100 text-slate-900 hover:bg-slate-200">
                            <LayoutDashboard size={18} />
                            Converter
                        </Button>
                        <Button variant="ghost" className="justify-start gap-3 w-full text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                            <History size={18} />
                            History
                        </Button>
                        <Button variant="ghost" className="justify-start gap-3 w-full text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                            <Settings size={18} />
                            Settings
                        </Button>
                    </nav>
                </ScrollArea>
                <div className="p-4 border-t border-slate-200">
                    <Button variant="ghost" className="justify-start gap-3 w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                        <LogOut size={18} />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="flex h-16 items-center justify-between px-6 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-center gap-4 lg:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu size={20} />
                        </Button>
                        <span className="font-semibold text-slate-900">WebP Studio</span>
                    </div>
                    <div className="flex flex-1 justify-end items-center gap-4">
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium leading-none text-slate-900">John Doe</p>
                                <p className="text-xs text-slate-500">Pro Plan</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                <User size={18} className="text-slate-600" />
                            </div>
                        </div>
                    </div>
                </header>

                <ScrollArea className="flex-1 p-6 md:p-8">
                    <div className="max-w-6xl mx-auto space-y-8">
                        {children}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default DashboardLayout;
