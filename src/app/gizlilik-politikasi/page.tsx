
export default function PrivacyPolicyPage() {
    return (
        <main className="bg-background min-h-screen">
            <div className="relative h-[30vh] min-h-[300px] flex items-center justify-center overflow-hidden">
                <div className="relative z-10 text-center px-6">
                    <h1 className="text-4xl md:text-6xl font-black text-black tracking-tighter mb-4">
                        Gizlilik <span className="text-accent font-extrabold italic underline">Politikası</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Kaşkar Halı olarak, kişisel verilerinizin güvenliği hususuna azami hassasiyet göstermekteyiz.
                        Bu bilinçle, ürün ve hizmetlerimizden faydalanan kişiler dahil, Şirket ile ilişkili tüm şahıslara ait her türlü kişisel verinin
                        6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVK Kanunu")'na uygun olarak işlenerek, muhafaza edilmesine büyük önem atfetmekteyiz.
                    </p>
                </div>
            </div>

            <section className="px-[6%] py-16 max-w-[1000px] mx-auto prose prose-invert prose-lg prose-headings:font-bold prose-headings:tracking-tight prose-p:text-black prose-a:text-accent font-light">
                <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-xl">
                    <p>
                        <span className="text-black font-bold">Kaşkar Halı</span> olarak, kişisel verilerinizin güvenliği hususuna azami hassasiyet göstermekteyiz.
                        Bu bilinçle, ürün ve hizmetlerimizden faydalanan kişiler dahil, Şirket ile ilişkili tüm şahıslara ait her türlü kişisel verinin
                        6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVK Kanunu")'na uygun olarak işlenerek, muhafaza edilmesine büyük önem atfetmekteyiz.
                    </p>

                    <br />

                    <h3 className="text-black font-bold">1. Kişisel Verilerin Toplanması</h3>
                    <p>
                        Web sitemizi ziyaret ettiğinizde, üye olduğunuzda veya alışveriş yaptığınızda; adınız, soyadınız, e-posta adresiniz,
                        telefon numaranız, adres bilgileriniz ve ödeme bilgileriniz gibi kişisel verileriniz toplanabilir.
                    </p>
                    <br />

                    <h3 className="text-black font-bold">2. Kişisel Verilerin İşlenmesi ve İşleme Amaçları</h3>
                    <p>
                        Toplanan kişisel verileriniz; Şirketimiz tarafından sunulan ürün ve hizmetlerden sizleri faydalandırmak için gerekli çalışmaların
                        iş birimlerimiz tarafından yapılması, Şirketimiz tarafından sunulan ürün ve hizmetlerin sizlerin beğeni, kullanım alışkanlıkları
                        ve ihtiyaçlarına göre özelleştirilerek sizlere önerilmesi amaçlarıyla işlenmektedir.
                    </p>
                    <br />

                    <h3 className="text-black font-bold">3. Kişisel Verilerin Aktarılması</h3>
                    <p>
                        Kişisel verileriniz; yukarıda belirtilen amaçların gerçekleştirilmesi doğrultusunda, iş ortaklarımıza, tedarikçilerimize,
                        kanunen yetkili kamu kurumlarına ve özel kişilere, KVK Kanunu'nun 8. ve 9. maddelerinde belirtilen kişisel veri işleme
                        şartları ve amaçları çerçevesinde aktarılabilecektir.
                    </p>
                    <br />

                    <h3 className="text-black font-bold">4. Kişisel Veri Sahibinin Hakları</h3>
                    <p>
                        Kişisel veri sahipleri olarak, haklarınıza ilişkin taleplerinizi info@kaskarhali.com adresi üzerinden bize iletebilirsiniz.
                        Talebiniz en geç otuz gün içinde ücretsiz olarak sonuçlandırılacaktır.
                    </p>
                    <br />
                </div>
            </section>
        </main>
    );
}
