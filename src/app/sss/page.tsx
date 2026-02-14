
import { Plus, Minus } from "lucide-react";

export default function FAQPage() {
    return (
        <main className="bg-background min-h-screen">
            <div className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <div className="relative z-10 text-center px-6">
                    <h1 className="text-5xl md:text-7xl font-black text-black tracking-tighter mb-6">
                        Sıkça Sorulan Sorular
                    </h1>
                    <p className="max-w-xl mx-auto text-black font-light text-lg">
                        Merak ettiğiniz tüm soruların cevaplarını burada bulabilirsiniz.
                    </p>
                </div>
            </div>

            <section className="px-[6%] py-24 max-w-[1000px] mx-auto space-y-8">
                <FAQItem
                    question="Siparişim ne zaman kargoya verilir?"
                    answer="Siparişleriniz, ödeme onayının ardından 3-5 iş günü içerisinde kargoya teslim edilmektedir. Özel üretim veya stokta olmayan ürünler için bu süre değişiklik gösterebilir."
                />
                <FAQItem
                    question="Değişim koşulları nelerdir?"
                    answer="Satın aldığınız ürün eğer özel ölçü değilse ve stokta mevcutsa, teslim tarihinden itibaren 14 gün içerisinde iade edebilir veya değiştirebilirsiniz. Ürünün kullanılmamış ve orijinal ambalajında olması gerekmektedir. Özel üretim halılarda değişim ve iade yapılamamaktadır. Ürün hatalıysa tarafımızca firmaya gönderilir ve ürünün yenisi ile değiştirilir."
                />
                <FAQItem
                    question="Hangi ödeme yöntemlerini kabul ediyorsunuz?"
                    answer="Kredi kartı, banka kartı ve havale/EFT yöntemleri ile ödeme yapabilirsiniz. Tüm işlemleriniz 256-bit SSL sertifikası ile korunmaktadır."
                />
                <FAQItem
                    question="Özel ölçü halı siparişi verebilir miyim?"
                    answer="Evet, bazı koleksiyonlarımızda özel ölçü seçeneğimiz bulunmaktadır. Detaylı bilgi almak ve sipariş oluşturmak için müşteri hizmetlerimizle iletişime geçebilirsiniz."
                />
                <FAQItem
                    question="Halıların temizliği ve bakımı nasıl yapılmalıdır?"
                    answer="Halılarımızın uzun ömürlü olması için düzenli olarak elektrik süpürgesi ile temizlenmesini, leke oluşumunda anında müdahale edilmesini ve profesyonel yıkama hizmeti alınmasını öneriyoruz."
                />
            </section>
        </main>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    return (
        <details className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 open:shadow-md open:bg-secondary/20">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none">
                <h3 className="font-bold text-lg text-black pr-8">{question}</h3>
                <div className="text-accent transition-transform duration-300 group-open:rotate-45">
                    <Plus size={24} className="group-open:hidden" />
                    <Minus size={24} className="hidden group-open:block" />
                </div>
            </summary>
            <div className="px-6 pb-6 text-black leading-relaxed animate-in slide-in-from-top-2 fade-in duration-300">
                {answer}
            </div>
        </details>
    );
}
