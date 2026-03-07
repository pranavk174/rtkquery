
import { useEffect, useState } from 'react'
import { Switch } from "@/components/ui/switch"

const darkThemeToggle = () => {
    // Initialize state from localStorage to match server-rendered state
    const [dark, setDark] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark'
        }
        return false
    })

    useEffect(() => {
        // Sync state with actual DOM class on mount
        const saved = localStorage.getItem('theme')
        const isDark = saved === 'dark'

        if (isDark !== dark) {
            setDark(isDark)
        }
    }, [])



    const handleToggle = () => {
        if (dark) {
            document.documentElement.classList.remove('dark')
            localStorage.setItem("theme", "light");

        } else {
            document.documentElement.classList.add('dark')
            localStorage.setItem("theme", "dark");
        }
        setDark(!dark)
    }
    return (
        <div className='font-bold flex items-center gap-2'><Switch aria-label="Toggle Dark Mode" checked={dark} className='bg-white' onClick={handleToggle} /> {dark ? 'Dark' : 'Light'} </div>
    )
}

export default darkThemeToggle