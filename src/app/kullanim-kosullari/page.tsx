
export default function TermsOfUsePage() {
    return (
        <main className="bg-background min-h-screen">
            <div className="relative h-[30vh] min-h-[300px] flex items-center justify-center overflow-hidden">
                <div className="relative z-10 text-center px-6">
                    <h1 className="text-4xl md:text-6xl font-black text-black tracking-tighter mb-4">
                        Kullanım <span className="text-accent font-extrabold italic underline">Koşulları</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Kaşkar Halı'nın internet sitesini ziyaret ettiğiniz için teşekkür ederiz. Bu sayfada, internet sitemizi kullanırken uymanız gereken kuralları ve sorumluluklarınızı bulabilirsiniz.
                    </p>
                </div>
            </div>

            <section className="px-[6%] py-16 max-w-[1000px] mx-auto prose prose-invert prose-lg prose-headings:font-bold prose-headings:tracking-tight prose-p:text-muted-foreground prose-a:text-accent font-light">
                <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-xl">
                    <p>
                        Bu internet sitesine girmeniz veya bu internet sitesindeki herhangi bir bilgiyi kullanmanız aşağıdaki koşulları kabul ettiğiniz anlamına gelir.
                    </p>

                    <br />

                    <h3 className="text-black font-bold">1. Genel Koşullar</h3>
                    <p>
                        <span className="font-bold">Kaşkar Halı</span>, dilediği zaman bu yasal uyarı sayfasının içeriğini güncelleme yetkisini saklı tutmaktadır.
                        Kullanıcılarına siteye her girişte yasal uyarı sayfasını ziyaret etmelerini tavsiye etmektedir.
                    </p>
                    <br />

                    <h3 className="text-black font-bold">2. Fikri Mülkiyet Hakları</h3>
                    <p>
                        Bu internet sitesinde bulunan bilgiler, yazılar, resimler, markalar, slogan ve diğer işaretler ile sair sınaî ve fikri mülkiyet haklarına ilişkin bilgilerin korunmasına yönelik programlarla,
                        sayfa düzeni ve işbu internet sitesinin sunumu Kaşkar Halı'nın mülkiyetindedir.
                    </p>
                    <br />

                    <h3 className="text-black font-bold">3. Sorumluluk Sınırları</h3>
                    <p>
                        <span className="font-bold">Kaşkar Halı</span>, bu internet sitesine girilmesi, sitenin ya da sitedeki bilgilerin ve diğer verilerin programların vs. kullanılması sebebiyle,
                        sözleşmenin ihlali, haksız fiil, ya da başkaca sebeplere binaen, doğabilecek doğrudan ya da dolaylı hiçbir zarardan sorumlu değildir.
                    </p>
                    <br />

                    <h3 className="text-black font-bold">4. Değişiklik Hakları</h3>
                    <p>
                        <span className="font-bold">Kaşkar Halı</span>, işbu site ve site uzantısında mevcut her tür hizmet, ürün, siteyi kullanma koşulları ile sitede sunulan bilgileri
                        önceden bir ihtara gerek olmaksızın değiştirme, siteyi yeniden organize etme, yayını durdurma hakkını saklı tutar.
                    </p>
                    <br />
                </div>
            </section>
        </main>
    );
}
