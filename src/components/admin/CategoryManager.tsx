'use client';

import { useState } from 'react';
import { Plus, Layers, Tag, Search, FolderPlus, Package } from 'lucide-react';
import DeleteCategoryButton from './DeleteCategoryButton';
import { createCategory } from '@/lib/actions/definitions';

interface CategoryItem {
    id: string;
    name: string;
    brandId: string;
    _count: {
        products: number;
    };
}

interface BrandWithCategories {
    id: string;
    name: string;
    logo?: string | null;
    categories: CategoryItem[];
}

interface CategoryManagerProps {
    brands: BrandWithCategories[];
}

export default function CategoryManager({ brands }: CategoryManagerProps) {
    const [selectedBrandId, setSelectedBrandId] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('ALL');

    // Filter brands based on active tab and search term
    const filteredBrands = brands.filter(brand => {
        if (activeTab !== 'ALL' && brand.id !== activeTab) return false;
        
        if (!searchTerm.trim()) return true;
        
        const matchesBrand = brand.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = brand.categories.some(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return matchesBrand || matchesCategory;
    });

    const totalCategories = brands.reduce((acc, b) => acc + b.categories.length, 0);

    return (
        <div className="space-y-8">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/40">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Koleksiyon Yönetimi</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {brands.length} Marka altında toplam {totalCategories} koleksiyon listeleniyor.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Marka veya koleksiyon ara..."
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none text-sm"
                    />
                </div>
            </div>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Form */}
                <div className="lg:col-span-1">
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm sticky top-8 space-y-6">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Plus size={20} className="text-accent" />
                                Yeni Koleksiyon Ekle
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1">
                                Seçili bir markanın altına yeni bir koleksiyon (seri) tanımlayın.
                            </p>
                        </div>

                        <form
                            action={async (formData: FormData) => {
                                const res = await createCategory(formData);
                                if (res?.message && res.message.includes('başarıyla')) {
                                    // Reset selected brand after successful creation
                                    const formEl = document.getElementById('add-category-form') as HTMLFormElement;
                                    formEl?.reset();
                                }
                            }}
                            id="add-category-form"
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    Bağlı Olduğu Marka
                                </label>
                                <select
                                    name="brandId"
                                    value={selectedBrandId}
                                    onChange={(e) => setSelectedBrandId(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none font-medium"
                                    required
                                >
                                    <option value="">Marka Seçiniz</option>
                                    {brands.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    Koleksiyon Adı
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent outline-none font-medium"
                                    placeholder="Örn: Pierre Cardin"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full h-12 bg-foreground text-background rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                                <FolderPlus size={18} />
                                Koleksiyon Oluştur
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Categorized Collections List */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Brand Filter Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <button
                            type="button"
                            onClick={() => setActiveTab('ALL')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                                activeTab === 'ALL'
                                    ? 'bg-foreground text-background shadow-sm'
                                    : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground'
                            }`}
                        >
                            Tüm Markalar ({totalCategories})
                        </button>
                        {brands.map(brand => (
                            <button
                                key={brand.id}
                                type="button"
                                onClick={() => setActiveTab(brand.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                                    activeTab === brand.id
                                        ? 'bg-foreground text-background shadow-sm'
                                        : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground'
                                }`}
                            >
                                <span>{brand.name}</span>
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                                    activeTab === brand.id ? 'bg-background/20 text-background' : 'bg-secondary text-foreground'
                                }`}>
                                    {brand.categories.length}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Brand Cards Grid */}
                    <div className="space-y-6">
                        {filteredBrands.map(brand => (
                            <div key={brand.id} className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
                                {/* Brand Header */}
                                <div className="flex items-center justify-between pb-4 border-b border-border/40">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-border/50 flex items-center justify-center p-1.5 shadow-xs">
                                            {brand.logo ? (
                                                <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
                                            ) : (
                                                <Tag size={18} className="text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl tracking-tight text-foreground">{brand.name}</h3>
                                            <p className="text-xs text-muted-foreground font-medium">
                                                {brand.categories.length} adet koleksiyon
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedBrandId(brand.id)}
                                        className="px-3 py-1.5 text-xs font-bold text-accent bg-accent/10 rounded-lg hover:bg-accent hover:text-white transition-colors flex items-center gap-1"
                                    >
                                        <Plus size={14} />
                                        Bu Markaya Ekle
                                    </button>
                                </div>

                                {/* Collections Grid under this Brand */}
                                {brand.categories.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                        {brand.categories.map(category => (
                                            <div
                                                key={category.id}
                                                className="flex items-center justify-between p-4 bg-secondary/30 border border-border/50 rounded-2xl hover:border-accent/40 transition-colors group"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                                                        <Layers size={20} />
                                                    </div>
                                                    <div className="truncate">
                                                        <h4 className="font-bold text-sm text-foreground truncate">{category.name}</h4>
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                                            <Package size={12} />
                                                            <span>{category._count.products} Ürün</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <DeleteCategoryButton categoryId={category.id} categoryName={category.name} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center bg-secondary/20 rounded-2xl border border-dashed border-border/60">
                                        <p className="text-xs text-muted-foreground font-medium">
                                            {brand.name} markasına henüz koleksiyon eklenmemiş.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedBrandId(brand.id)}
                                            className="mt-2 text-xs font-bold text-accent hover:underline inline-flex items-center gap-1"
                                        >
                                            <Plus size={12} /> Hemen koleksiyon ekle
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {filteredBrands.length === 0 && (
                            <div className="text-center py-16 bg-card border border-border/60 rounded-3xl">
                                <p className="text-muted-foreground">Aradığınız kriterlere uygun marka veya koleksiyon bulunamadı.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
