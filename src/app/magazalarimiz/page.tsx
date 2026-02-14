
import { MapPin, Phone, Clock, Navigation } from "lucide-react";

const STORES = [
    {
        id: 'merkez',
        name: 'Kaşkar Halı - Camlıkahve',
        address: 'Haznedar, Bağcılar Cd. No:96, 34600 Güngören/İstanbul',
        phone: '+90 (533) 442 29 56',
        hours: 'Pazartesi - Cumartesi: 09:00 - 20:30 | Pazar: 11:00 - 19:00',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.5231347033437!2d28.860860276563812!3d41.01380951908336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cabbca2fd91f5f%3A0xd195954f47950ec!2zS2HFn2thciBIYWzEsSBLaWxpbSDDh2V5aXogQ2FycGV0!5e0!3m2!1str!2str!4v1770933373016!5m2!1str!2str'
    },
    {
        id: 'sube-1',
        name: 'Kaşkar Halı - Gültepe',
        address: 'Ortabayır, Talatpaşa Cd. No:25, 34000 Kağıthane/İstanbul',
        phone: '+90 (532) 661 85 47',
        hours: 'Pazartesi - Cumartesi: 09:00 - 20:30 | Pazar: 11:00 - 19:00',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.5243579379016!2d29.00332987656615!3d41.07938851504233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7c87b49c059%3A0x994dd0e78db3c22e!2zS2HFn2thciBIYWzEsSBHw7xsdGVwZQ!5e0!3m2!1str!2str!4v1770933425877!5m2!1str!2str'
    },
    {
        id: 'sube-2',
        name: 'Kaşkar Halı - Atışalanı',
        address: 'Kazım Karabekir, Atışalanı Cd. No:85, 34230 Esenler/İstanbul',
        phone: '+90 (545) 201 66 89',
        hours: 'Pazartesi - Cumartesi: 09:00 - 20:30 | Pazar: 11:00 - 19:00',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d752.2655677041361!2d28.87780526966263!3d41.04576730965061!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cababc15d5f20d%3A0x6b544a5fe8755e87!2zS2F6xLFtIEthcmFiZWtpciwgQXTEscWfYWxhbsSxIENkLiBObzo4NS9BLCAzNDIyMCBFc2VubGVyL8Swc3RhbmJ1bA!5e0!3m2!1str!2str!4v1770933509175!5m2!1str!2str'
    }
];

export default function StoresPage() {
    return (
        <main className="bg-background min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <div className="relative z-10 text-center px-6">
                    <h1 className="text-5xl md:text-7xl font-black text-black tracking-tighter mb-6">
                        Mağazalarımız
                    </h1>
                    <p className="max-w-xl mx-auto text-black font-light text-lg">
                        İstanbul'un en seçkin mobilya kentlerinde hizmetinizdeyiz.
                    </p>
                </div>
            </div>

            {/* Stores List */}
            <section className="px-[6%] py-24 max-w-[1800px] mx-auto space-y-32">
                {STORES.map((store, index) => (
                    <div key={store.id} className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>

                        {/* Store Info */}
                        <div className="flex-1 space-y-8">
                            <div>
                                <h2 className="text-4xl font-bold text-foreground tracking-tight mb-2">{store.name}</h2>
                                <div className="h-1 w-20 bg-accent rounded-full" />
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/50 hover:border-accent/30 transition-colors">
                                    <MapPin className="text-accent shrink-0 mt-1" size={24} />
                                    <div>
                                        <h3 className="font-bold text-foreground mb-1">Adres</h3>
                                        <p className="text-muted-foreground leading-relaxed">{store.address}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/50 hover:border-accent/30 transition-colors">
                                    <Phone className="text-accent shrink-0 mt-1" size={24} />
                                    <div>
                                        <h3 className="font-bold text-foreground mb-1">Telefon</h3>
                                        <p className="text-muted-foreground">{store.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/50 hover:border-accent/30 transition-colors">
                                    <Clock className="text-accent shrink-0 mt-1" size={24} />
                                    <div>
                                        <h3 className="font-bold text-foreground mb-1">Çalışma Saatleri</h3>
                                        <p className="text-muted-foreground">{store.hours}</p>
                                    </div>
                                </div>
                            </div>

                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all duration-300"
                            >
                                <Navigation size={20} />
                                Yol Tarifi Al
                            </a>
                        </div>

                        {/* Map Embed */}
                        <div className="flex-1 w-full h-[400px] lg:h-[500px] rounded-[3rem] overflow-hidden border-4 border-white dark:border-white/10 shadow-2xl relative group">
                            <iframe
                                src={store.mapUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="grayscale group-hover:grayscale-0 transition-all duration-700 w-full h-full"
                            />
                            {/* Decorative Frame */}
                            <div className="absolute inset-0 border-[1px] border-white/20 rounded-[3rem] pointer-events-none" />
                        </div>
                    </div>
                ))}
            </section>
        </main>
    );
}
