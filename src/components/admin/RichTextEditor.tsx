'use client';

import { useRef, useState, useEffect } from 'react';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Heading3,
    RemoveFormatting,
    Code,
    Eye
} from 'lucide-react';

interface RichTextEditorProps {
    name: string;
    defaultValue?: string;
    placeholder?: string;
}

export default function RichTextEditor({ name, defaultValue = '', placeholder }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [htmlContent, setHtmlContent] = useState<string>(defaultValue);
    const [isCodeView, setIsCodeView] = useState<boolean>(false);

    useEffect(() => {
        if (editorRef.current && !isCodeView) {
            if (editorRef.current.innerHTML !== htmlContent) {
                editorRef.current.innerHTML = htmlContent;
            }
        }
    }, [isCodeView]);

    const executeCommand = (command: string, value: string | undefined = undefined) => {
        if (isCodeView) return;
        document.execCommand(command, false, value);
        if (editorRef.current) {
            setHtmlContent(editorRef.current.innerHTML);
        }
    };

    const handleInput = () => {
        if (editorRef.current) {
            setHtmlContent(editorRef.current.innerHTML);
        }
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setHtmlContent(val);
        if (editorRef.current) {
            editorRef.current.innerHTML = val;
        }
    };

    return (
        <div className="border border-border rounded-2xl overflow-hidden bg-secondary/30 focus-within:border-accent transition-colors">
            {/* Hidden Input for Form Submission */}
            <input type="hidden" name={name} value={htmlContent} />

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-secondary border-b border-border/60 text-foreground">
                <button
                    type="button"
                    onClick={() => executeCommand('bold')}
                    className="p-2 rounded-lg hover:bg-background/80 text-muted-foreground hover:text-foreground transition-colors"
                    title="Kalın (Bold)"
                >
                    <Bold size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => executeCommand('italic')}
                    className="p-2 rounded-lg hover:bg-background/80 text-muted-foreground hover:text-foreground transition-colors"
                    title="İtalik (Italic)"
                >
                    <Italic size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => executeCommand('underline')}
                    className="p-2 rounded-lg hover:bg-background/80 text-muted-foreground hover:text-foreground transition-colors"
                    title="Altı Çizili (Underline)"
                >
                    <Underline size={16} />
                </button>

                <div className="w-px h-5 bg-border/80 mx-1" />

                <button
                    type="button"
                    onClick={() => executeCommand('formatBlock', '<h3>')}
                    className="p-2 rounded-lg hover:bg-background/80 text-muted-foreground hover:text-foreground transition-colors font-bold text-xs flex items-center gap-1"
                    title="Başlık (H3)"
                >
                    <Heading3 size={16} />
                </button>

                <button
                    type="button"
                    onClick={() => executeCommand('insertUnorderedList')}
                    className="p-2 rounded-lg hover:bg-background/80 text-muted-foreground hover:text-foreground transition-colors"
                    title="Maddeli Liste"
                >
                    <List size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => executeCommand('insertOrderedList')}
                    className="p-2 rounded-lg hover:bg-background/80 text-muted-foreground hover:text-foreground transition-colors"
                    title="Numaralı Liste"
                >
                    <ListOrdered size={16} />
                </button>

                <div className="w-px h-5 bg-border/80 mx-1" />

                <button
                    type="button"
                    onClick={() => executeCommand('removeFormat')}
                    className="p-2 rounded-lg hover:bg-background/80 text-muted-foreground hover:text-foreground transition-colors"
                    title="Biçimlendirmeyi Temizle"
                >
                    <RemoveFormatting size={16} />
                </button>

                <div className="ml-auto flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setIsCodeView(!isCodeView)}
                        className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                            isCodeView ? 'bg-accent text-white' : 'hover:bg-background/80 text-muted-foreground'
                        }`}
                        title={isCodeView ? 'Görsel Mod' : 'HTML Kodu Gör'}
                    >
                        {isCodeView ? <Eye size={14} /> : <Code size={14} />}
                        <span>{isCodeView ? 'Görsel Mod' : 'HTML'}</span>
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            {isCodeView ? (
                <textarea
                    value={htmlContent}
                    onChange={handleCodeChange}
                    className="w-full h-40 p-4 bg-background text-foreground font-mono text-xs outline-none resize-y"
                    placeholder="HTML kodu düzenleyin..."
                />
            ) : (
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    className="min-h-[140px] max-h-[400px] p-4 overflow-y-auto outline-none prose prose-invert max-w-none text-sm text-foreground space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h3]:text-base [&_h3]:font-bold [&_h3]:my-2"
                />
            )}
        </div>
    );
}
