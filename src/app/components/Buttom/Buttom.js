"use client"

import React from "react";
import { Button } from "@/components/ui/button"

export const MyButton = (props) => {
    return(
        <Button {...props}>
            {props.children}
        </Button>
    )
}
