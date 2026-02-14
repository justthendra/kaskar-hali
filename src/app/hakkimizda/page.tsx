import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
    return (
        <main className="bg-background min-h-screen">
            {/* Header */}
            <div className="relative pt-20 pb-20 px-[6%] text-center overflow-hidden">
                <span className="text-accent text-[10px] font-black uppercase tracking-[0.5em] mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    Hikayemiz
                </span>
                <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 relative z-10">
                    Gelenekten Geleceğe<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#F1D789]">Zarafet</span>
                </h1>

                {/* Background Pattern */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl -z-10" />
            </div>

            {/* Content Section */}
            <section className="px-[6%] pb-32 max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
                        <div className="h-1 w-20 bg-accent rounded-full" />
                        <h2 className="text-3xl font-bold text-foreground leading-tight">
                            1995'ten Bugüne, <br />
                            Değişmeyen Kalite Tutkusu.
                        </h2>
                        <div className="space-y-6 text-muted-foreground text-lg font-light leading-relaxed">
                            <p>
                                Kaşkar Halı olarak, halıyı sadece bir zemin örtüsü olarak değil, evin ruhunu yansıtan bir sanat eseri olarak görüyoruz. Çeyrek asrı aşkın tecrübemizle, dünyanın en seçkin ipliklerini geleneksel dokuma sanatıyla harmanlıyor, modern yaşam alanlarına değer katıyoruz.
                            </p>
                            <p>
                                Anadolu'nun zengin motiflerinden modern dünyanın minimalist çizgilerine uzanan geniş koleksiyonumuzda, her zevke ve her mekana uygun bir dokunuş bulacaksınız. Sürdürülebilirlik ve kaliteyi odağımıza alarak, gelecek nesillere miras kalacak tasarımlar üretiyoruz.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
                            <div>
                                <span className="block text-4xl font-black text-accent mb-1">33+</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Yıllık Tecrübe</span>
                            </div>
                            <div>
                                <span className="block text-4xl font-black text-accent mb-1">20K+</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mutlu Müşteri</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative h-[600px] rounded-[3rem] overflow-hidden group shadow-2xl">
                        {/* Placeholder image until a real one is provided */}
                        {/* If we had an image, it would go here */}
                        /*
                        <Image
                            src="/hakkımızda.png"
                            alt="Kaşkar Showroom"
                            fill
                            className="object-cover transition-transform duration-1000 scale-110 group-hover:scale-100"
                        />
                        */
                        <div className="absolute inset-0 bg-accent/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>
            </section>
        </main>
    );
}
