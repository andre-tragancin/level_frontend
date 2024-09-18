"use client"

// import { SideBar } from "../Sidebar/Sidebar"
import { LayoutDashboard, Home, ArrowDownUp, BarChartBig, BarChart4, ClipboardCheck, CalendarDays, Settings, NotebookPen } from 'lucide-react';
import Link from 'next/link';
import { Menu, SubMenu, MenuItem } from 'react-pro-sidebar';
import { Sidebar } from 'react-pro-sidebar';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const Layout = ({children}) => {
    const pathname = usePathname();

    const [openSubMenu, setOpenSubMenu] = useState(null);

    const isActive = (path) => pathname === path;

    const handleSubMenuOpenChange = (label, open) => {
        // Ensure only one submenu is open at a time
        setOpenSubMenu(open ? label : null);
    };

    const itens = [
        {
            "title": "Dashboard",
            "icon" : <LayoutDashboard/>,
            "children": [
                {
                    "title": "Geral",
                    "icon": <Home />,
                    "path": "/dashboard/geral",
                },
                {
                    "title": "Por Sala",
                    "icon": <ArrowDownUp/>,
                    "path": "/",
                },
                {
                    "title": "Por Jogo",
                    "icon": <BarChartBig />,
                    "path": "/",
                },
                {
                    "title": "Por Aluno",
                    "icon": <BarChart4 />,
                    "path": "/",
                }
            ]
        },
        {
            "title": "Salas",
            "icon" : <ClipboardCheck />,
            "path": "/",
        },
        {
            "title": "Jogos",
            "icon" : <CalendarDays />,
            "path": "/",
        },
        {
            "title": "Métricas",
            "icon" : <NotebookPen />,
            "path": "/",
        },
        {
            "title": "Configurações",
            "icon" : <Settings/>,
            "path": "/",
        }
    
    ]

    // const router = useRouter();
    // const { pathname } = router;

    return(
        <div className=" h-screen flex">
            <Sidebar backgroundColor='#2B2B40' style={{borderRight:'1px solid #65648C ', height: '100vh',
                    position: 'fixed' }}>
                <div className='flex flex-col h-screen'>
                    <Menu
                        menuItemStyles={{
                            button: ({ level, active, disabled }) => {
                                // console.log(active)
                            return {
                                color: '#e5e7eb',
                                backgroundColor: active ? '#65648C' : "#2B2B40",
                                '&:hover': {
                                backgroundColor: active ? '#8B8AC2' :'#65648C',
                                color: '#white',
                                },
                            };
                            },
                        }}
                    >
                        <SubMenu 
                            icon={<LayoutDashboard />} 
                            label="Dashboard"
                            open={openSubMenu === 'dashboard'}
                            active={openSubMenu === 'dashboard'}
                            onOpenChange={(open) => handleSubMenuOpenChange('dashboard', open)}
                            
                        >
                            <MenuItem 
                                active={isActive('/dashboard/general')} 
                                icon={<Home strokeWidth={'3px'} />} 
                                component={<Link href={"/dashboard/general"} />}
                            > 
                                Geral 
                            </MenuItem>
                            <MenuItem 
                                active={isActive('/dashboard/room')}
                                icon={<ArrowDownUp/>}
                                component={<Link href={"/dashboard/room"} />}
                            > 
                                Por Sala 
                            </MenuItem>
                            <MenuItem
                                active={isActive('/dashboard/game')} 
                                icon={<BarChartBig />}
                                component={<Link href={'/dashboard/game'} />}
                            > 
                                Por Jogo 
                            </MenuItem>
                            <MenuItem
                                active={isActive('/dashboard/student')} 
                                icon={<BarChart4 />}
                                component={<Link href={'/dashboard/student'} />}
                            > 
                                Por Aluno 
                            </MenuItem>
                        </SubMenu>
                        <MenuItem 
                            active={isActive('/rooms')} 
                            icon={<ClipboardCheck />}
                            component={<Link href={'/rooms'} />}
                        > 
                            Salas 
                        </MenuItem>
                        <MenuItem 
                            active={isActive('/games')} 
                            icon={<CalendarDays />}
                            component={<Link href={'/games'} />}
                        > 
                            Jogos 
                        </MenuItem>
                        <MenuItem 
                            active={isActive('/metrics')} 
                            icon={<NotebookPen />}
                            component={<Link href={'/metrics'} />}
                        > 
                            Métricas 
                        </MenuItem>
                        <MenuItem 
                            active={isActive('/settings')} 
                            icon={<Settings/>}
                            component={<Link href={'/settings'} />}
                        > 
                            Configurações 
                        </MenuItem>
                    </Menu>
                    <div className='mt-auto flex p-3 items-center'>
                        <div className='flex'>
                            <Avatar className='size-14'>
                                <AvatarImage src="https://github.com/andre-tragancin.png" />
                                <AvatarFallback>AT</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className='flex-col px-4'>
                            <p className='text-base text-zinc-200'>André Tragancin</p>
                            <p className='text-xs text-zinc-500'>Desenvolvedor</p>
                        </div>
                    </div>
                </div>
            </Sidebar>
            <div className="flex flex-col flex-1 ml-[250px]">
                  <main className="flex justify-center flex-grow p-4 bg-gray-200">
                    {children}
                  </main>
                  <footer className="flex justify-between bg-gray-100 items-center p-4">
                    <div className="flex flex-1 items-center space-x-8">
                      <p className=" text-indigo-500 font-semibold text-xs">
                        &copy;Pensar e Jogar
                      </p>
                      <p className="text-xs text-zinc-500">
                        All rights reserved
                      </p>
                    </div>
                    <div className="flex space-x-8">
                      <p className="text-xs text-zinc-500">
                        Privacy Policy
                      </p>
                      <p className="text-xs text-zinc-500">
                        Terms & Conditions
                      </p>
                    </div>
                    
                  </footer>
            </div>
        </div>
    )
}