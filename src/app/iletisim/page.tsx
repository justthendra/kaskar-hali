
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="bg-background min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <div className="relative z-10 text-center px-6">
                    <h1 className="text-5xl md:text-7xl font-black text-black tracking-tighter mb-6">
                        İletişim
                    </h1>
                    <p className="max-w-xl mx-auto text-black font-light text-lg">
                        Sorularınız, görüşleriniz ve iş birlikleri için bize ulaşın.
                    </p>
                </div>
            </div>

            <section className="px-[6%] py-24 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Bize Ulaşın</h2>
                            <p className="text-black text-lg leading-relaxed">
                                Kaşkar Halı olarak müşteri memnuniyeti bizim için her şeyden önemlidir.
                                Aşağıdaki iletişim kanallarından veya formu doldurarak bize dilediğiniz zaman ulaşabilirsiniz.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-accent shrink-0">
                                    <Phone size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Telefon</h3>
                                    <p className="text-black">+90 (532) 661 85 47</p>
                                    <p className="text-black">+90 (545) 201 66 89</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-accent shrink-0">
                                    <Mail size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">E-Posta</h3>
                                    <p className="text-black">info@kaskarhali.com</p>
                                    <p className="text-black">satis@kaskarhali.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-accent shrink-0">
                                    <MapPin size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Adres</h3>
                                    <p className="text-black">
                                        Haznedar, Bağcılar Cd. No:96, 34600 Güngören/İstanbul
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-card border border-border rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <Send size={200} />
                        </div>

                        <h2 className="text-3xl font-bold mb-8 relative z-10">İletişim Formu</h2>

                        <form className="space-y-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-black">Adınız Soyadınız</label>
                                    <input type="text" className="w-full h-14 px-6 rounded-2xl bg-secondary border border-border focus:border-accent outline-none transition-all" placeholder="Adınız" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-black">E-Posta</label>
                                    <input type="email" className="w-full h-14 px-6 rounded-2xl bg-secondary border border-border focus:border-accent outline-none transition-all" placeholder="ornek@email.com" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-black">Konu</label>
                                <input type="text" className="w-full h-14 px-6 rounded-2xl bg-secondary border border-border focus:border-accent outline-none transition-all" placeholder="Mesajınızın konusu" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-black">Mesajınız</label>
                                <textarea className="w-full h-40 p-6 rounded-2xl bg-secondary border border-border focus:border-accent outline-none transition-all resize-none" placeholder="Mesajınızı buraya yazınız..." />
                            </div>

                            <button className="w-full h-14 bg-foreground text-background rounded-2xl font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all duration-300 flex items-center justify-center gap-3">
                                <span>Gönder</span>
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
