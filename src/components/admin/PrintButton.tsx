"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 active:bg-primary/80 hover:text-white active:text-white transition-colors"
        >
            <Printer size={18} />
            <span className="font-bold">Yazdır</span>
        </button>
    );
}
