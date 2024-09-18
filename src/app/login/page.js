"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
// import LoginLayout from "./layout"

export default function Login() {

    function handleClick() { 
        console.log("CLick")
    }

    return (
        <div>
            <Button asChild>
                <Link href={"/"} >Login</Link>
            </Button>
        </div>
    )
  }

// Login.getLayout = function getLayout(page) {
//     return <LoginLayout>{page}</LoginLayout>
// }