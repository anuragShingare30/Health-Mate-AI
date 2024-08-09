"use client";
import { LuSunMedium } from "react-icons/lu";
import { IoMoonOutline } from "react-icons/io5";
import React from "react";


let themes = {
    dark: "sunset",
    light: "nord",
    };



function ThemeToggle() {
    let [theme, setTheme] = React.useState(themes.dark); 

    function toggleTheme(){
        let newTheme = theme === themes.dark ? themes.light : themes.dark;
        document.documentElement.setAttribute("data-theme", newTheme);
        setTheme(newTheme);
    }

    return (
        <button className="btn btn-sm btn-outline" onClick={toggleTheme}>
            {theme === "nord" ? (
                <IoMoonOutline className="w-4 h-4"/>
            ) : (
                <LuSunMedium className="h-4 w-4"/> 
            )}
        </button>
    );
};

export { ThemeToggle };