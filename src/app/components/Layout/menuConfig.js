// menuConfig.js
import { LayoutDashboard, Home, ArrowDownUp, BarChartBig, BarChart4, ClipboardCheck, CalendarDays, Settings, NotebookPen } from 'lucide-react';

export const USER_MENU_CONFIG = {
    0: [ // Desenvolvedor
        {
            label: "Dashboard",
            icon: <LayoutDashboard />,
            submenu: [
                { label: "Geral", path: "/dashboard/general", icon: <Home /> },
                { label: "Por Jogo", path: "/dashboard/game", icon: <ArrowDownUp /> },
            ],
        },
        { label: "Jogos", path: "/games", icon: <CalendarDays /> },
        { label: "Métricas", path: "/metrics", icon: <NotebookPen /> },
        { label: "Configurações", path: "/settings", icon: <Settings /> },
    ],
    1: [ // Professor
        {
            label: "Dashboard",
            icon: <LayoutDashboard />,
            submenu: [
                { label: "Geral", path: "/dashboard/general", icon: <Home /> },
                { label: "Por Sala", path: "/dashboard/room", icon: <ArrowDownUp /> },
                { label: "Por Estudante", path: "/dashboard/student", icon: <BarChartBig /> },
            ],
        },
        { label: "Salas", path: "/rooms", icon: <ClipboardCheck /> },
        { label: "Configurações", path: "/settings", icon: <Settings /> },
    ],
    2: [ // Estudante
        {
            label: "Dashboard",
            icon: <LayoutDashboard />,
            submenu: [
                { label: "Geral", path: "/dashboard/general", icon: <Home /> },
                { label: "Por Sala", path: "/dashboard/room", icon: <ArrowDownUp /> },
            ],
        },
        { label: "Configurações", path: "/settings", icon: <Settings /> },
    ],
    3: [ // Administrador
        {
            label: "Dashboard",
            icon: <LayoutDashboard />,
            submenu: [
                { label: "Geral", path: "/dashboard/general", icon: <Home /> },
                { label: "Por Sala", path: "/dashboard/room", icon: <ArrowDownUp /> },
                { label: "Por Jogo", path: "/dashboard/game", icon: <ArrowDownUp /> },
                { label: "Por Estudante", path: "/dashboard/student", icon: <ArrowDownUp /> },
            ],
        },
        { label: "Salas", path: "/rooms", icon: <ClipboardCheck /> },
        { label: "Jogos", path: "/games", icon: <CalendarDays /> },
        { label: "Métricas", path: "/metrics", icon: <NotebookPen /> },
        { label: "Configurações", path: "/settings", icon: <Settings /> },
    ],
};
