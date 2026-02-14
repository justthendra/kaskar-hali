import prisma from "@/lib/prisma";
import { createBranchUser, deleteUser } from "@/lib/actions/users";
import { Trash2, UserPlus, User as UserIcon } from "lucide-react";

export default async function SettingsPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        where: { role: { not: 'USER' } }
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-foreground tracking-tighter mb-2">Ayarlar</h1>
                <p className="text-muted-foreground">Şube ve kullanıcı yönetimi.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create New User Form */}
                <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <UserPlus size={120} />
                    </div>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <UserPlus className="text-accent" />
                        Yeni Şube Ekle
                    </h2>
                    <form action={async (formData) => {
                        'use server';
                        await createBranchUser(formData);
                    }} className="space-y-4 relative z-10">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Şube Adı</label>
                            <input name="name" placeholder="Örn: İstanbul Anadolu Şube" className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Kullanıcı Adı</label>
                            <input name="username" placeholder="kaskar_anadolu" className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Şifre</label>
                            <input name="password" type="password" placeholder="******" className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none" required minLength={6} />
                        </div>
                        <button className="w-full h-12 bg-foreground text-background rounded-xl font-bold uppercase tracking-widest hover:bg-foreground/90 transition-colors">
                            Oluştur
                        </button>
                    </form>
                </div>

                {/* User List */}
                <div className="bg-card border border-border rounded-3xl p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <UserIcon className="text-accent" />
                        Kayıtlı Şube ve Yöneticiler ({users.length})
                    </h2>
                    <div className="space-y-4">
                        {users.map((branch) => (
                            <div key={branch.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-2xl group hover:bg-secondary transition-colors border border-transparent hover:border-border/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                                        {branch.name?.[0] || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground">{branch.name}</p>
                                        <p className="text-xs text-muted-foreground font-mono">@{branch.username || 'user'}</p>
                                        <span className="text-[10px] bg-background border border-border px-2 py-0.5 rounded-full mt-1 inline-block uppercase tracking-wide font-bold">{branch.role}</span>
                                    </div>
                                </div>

                                {branch.role !== 'ADMIN' && (
                                    <form action={async () => {
                                        'use server';
                                        await deleteUser(branch.id);
                                    }}>
                                        <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100" title="Sil">
                                            <Trash2 size={18} />
                                        </button>
                                    </form>
                                )}
                            </div>
                        ))}

                        {users.length === 0 && (
                            <div className="text-center py-10 text-muted-foreground">
                                Kayıtlı şube bulunamadı.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
