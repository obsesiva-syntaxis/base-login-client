import { createContext, useContext, useState, type ReactNode } from 'react';

export interface SidebarContextValue {
    collapsed: boolean;
    toggleCollapsed: () => void;
    hoveredIndex: number | null;
    setHoveredIndex: (v: number | null) => void;
    footerOpen: boolean;
    toggleFooter: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export const useSidebar = () => {
    const ctx = useContext(SidebarContext);
    if (!ctx) throw new Error('useSidebar must be used within <Sidebar>');
    return ctx;
};

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [footerOpen, setFooterOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const toggleCollapsed = () => setCollapsed((c) => !c);
    const toggleFooter = () => setFooterOpen((f) => !f);

    return (
        <SidebarContext.Provider value={{ collapsed, toggleCollapsed, hoveredIndex, setHoveredIndex, footerOpen, toggleFooter }}>
            {children}
        </SidebarContext.Provider>
    );
};