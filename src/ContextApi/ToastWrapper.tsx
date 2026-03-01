"use client"
import React, { useContext, useEffect, createContext, useState } from "react";

const ToastContent = ({ toast }: { toast: any }) => {
    const [progress, setProgress] = useState(100);

    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const start = Date.now();
        const duration = toast.duration;

        const interval = setInterval(() => {
            const elapsed = Date.now() - start;
            const percent = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(percent);
            setVisible(true)
        }, 50);

        return () => {
            clearInterval(interval)
            setVisible(false)
        };
    }, [toast.duration]);

    return (
        <div style={{
            transform: visible ? "translateX(0%)"
                : "translateX(120%)",
        }} className=" bg-orange-400 p-2 rounded 
    transition-transform duration-300 ease-in-out toast-bounce
    will-change-transform relative overflow-hidden">
            {/* Message */}
            <div className="text-white">{toast.message}</div>

            {/* Progress Track */}
            <div className="absolute bottom-0 left-0 h-[6px] bg-black/30 w-full">
                {/* Progress Bar */}
                <div
                    className="h-full bg-red-500 transition-[width] duration-50"
                    style={{ width: `${progress}%` }}   // ✅ % not px
                />
            </div>
        </div>
    );
};


const Toast = ({ toasts }: any) => {




    return (
        <div className=" fixed top-4 right-4  transition-all">
            {toasts.map((toast: any, idx: number) => {

                return (<div className=" transition-all w-full max-w-[400px]  mb-2"
                    // style={{ transform: `translateX(-${toast.duration})` }}
                    key={idx}>
                    < ToastContent toast={toast} />



                    {/* {toast.message} */}
                </div>
                )
            })
            }
        </div>
    )
}

export const ToastContext = createContext<{
    showToast(messgae: string, type: string, duration: number): void
} | null>(null)


export const ToastWrapper = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<any>([])


    const showToast = (message: string, type: string, duration = 3000) => {

        const id = Date.now()
        setToasts((prev: any) => [...prev, { id, message, type, duration }])

        setTimeout(() => {
            setToasts((prev: any) => prev.filter((t: any) => t.id !== id))
        }, duration
        )
    }




    return <ToastContext.Provider value={{ showToast }} >
        {children}
        <Toast toasts={toasts} />
    </ToastContext.Provider>

}


export const useToast = () => {

    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error("error in toast data.........")
    return ctx
}



