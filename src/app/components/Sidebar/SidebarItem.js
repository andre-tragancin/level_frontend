'use client';

import { LayoutDashboard, ChevronRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export const SideBarItem = ({ item, selected, onItemClick }) => {
    // console.log("Teste",item)

    // console.log("Selected", item.title, selected)
    const  [open, setOpen] = useState(false)

    return (
        item.children ? (
            <div className="sidebar-item"  >
                <div className="sidebar-title flex items-center gap-1 cursor-pointer mb-2 hover:backdrop-brightness-75 rounded" onClick={() => setOpen(!open)}>
                    {item.icon}
                    <span> {item.title} </span>
                    {open ? (
                        <ChevronDown className="ml-auto" size={16} />
                        ) : (
                        <ChevronRight className={"ml-auto"} size={16} />
                    )}
                </div>
                <div className={`sidebar-content text-sm pl-4 ${open ? 'h-auto' : 'overflow-hidden h-0'} `}>
                    {item.children.map((child, index) => <SideBarItem key={index} item={child} selected={selected} onItemClick={onItemClick} />)}
                </div>
            </div>
        ): 
        // <Link href={item.path}>
            // <div className="sidebar-item hover:backdrop-brightness-90 rounded">
            <div className="sidebar-item rounded">
                    <Link href={item.path}>
                        <div className={`sidebar-title flex items-center gap-1 cursor-pointer mb-2 ${selected=== item.title ? 'backdrop-brightness-75 hover:backdrop-brightness-90 rounded' : 'hover:backdrop-brightness-75 rounded'}`} onClick={ () => onItemClick(item.title)}>
                            {item.icon}
                            <span>{item.title}</span>
                        </div>
                    </Link>
            </div>
        // </Link>
        
    )
}