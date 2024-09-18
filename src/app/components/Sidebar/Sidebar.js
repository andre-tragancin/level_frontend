'use client';


import { SideBarItem } from "./SidebarItem"
import { useState } from "react";

export const SideBar = ({itens}) => {

    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (title) => {
        console.log("TITLE", title)
        setSelectedItem(title);
    };

    return(
        <aside className=" w-60 min-h-full border-r p-4">
            {itens.map((item, index) => <SideBarItem key={index} item={item} selected={selectedItem} onItemClick={handleItemClick} />)}
        </aside>
    )
}