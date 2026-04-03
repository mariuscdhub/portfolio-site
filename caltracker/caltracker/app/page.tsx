import Link from 'next/link';
import { ArrowRight, Flame, X, Database, Cloud, Tag, ChefHat } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0F0B] text-white flex flex-col font-sans overflow-x-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-emerald-900/20 to-transparent pointer-events-none blur-3xl" />

      {/* Navbar */}
      <header className="px-6 py-6 flex items-center justify-between relative z-10 max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-black font-extrabold text-xl font-mono">C</span>
          </div>
          <span className="font-extrabold text-xl tracking-wider">CALTRACKER</span>
        </div>
        <Link
          href="/login"
          className="bg-white text-black font-semibold px-5 py-2.5 rounded-full hover:bg-zinc-200 transition-colors text-sm"
        >
          Se connecter
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center max-w-5xl w-full mx-auto px-6 relative z-10">

        {/* Hero Section */}
        <section className="py-20 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-8 backdrop-blur-sm">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-emerald-400 text-sm font-semibold tracking-wide">La révolution du tracking nutritionnel</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 font-sans uppercase">
            Unlock your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-amber-500 pb-2">
              nutrition flow
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed">
            Le seul tracker qui comprend vraiment les bodybuilders. <span className="text-emerald-400 font-semibold">Cru vs Cuit</span>, recettes intelligentes, sync cloud. <span className="text-white font-bold">Tout en un seul endroit.</span>
          </p>

          <Link
            href="/signup"
            className="group bg-white text-black font-bold text-lg px-8 py-4 rounded-full flex items-center gap-3 hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(52,211,153,0.3)]"
          >
            Commencer gratuitement
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>

        {/* Problems Section */}
        <section className="py-24 w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Le problème que vous connaissez trop bien</h2>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">Les trackers classiques ne comprennent pas les vrais besoins des athlètes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#111] p-8 rounded-3xl border border-red-500/20 hover:border-red-500/40 transition-colors">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-500/20">
                <X className="w-6 h-6 text-white" strokeWidth={3} />
              </div>
              <h3 className="text-xl font-bold mb-3">Cru vs Cuit ignoré</h3>
              <p className="text-zinc-400 leading-relaxed">100g de riz cru ≠ 100g de riz cuit. Les apps classiques ne font pas la différence.</p>
            </div>

            <div className="bg-[#111] p-8 rounded-3xl border border-red-500/20 hover:border-red-500/40 transition-colors">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-500/20">
                <X className="w-6 h-6 text-white" strokeWidth={3} />
              </div>
              <h3 className="text-xl font-bold mb-3">Recettes compliquées</h3>
              <p className="text-zinc-400 leading-relaxed">Calculer les macros de vos meal preps demande des heures de calculs manuels.</p>
            </div>

            <div className="bg-[#111] p-8 rounded-3xl border border-red-500/20 hover:border-red-500/40 transition-colors">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-500/20">
                <X className="w-6 h-6 text-white" strokeWidth={3} />
              </div>
              <h3 className="text-xl font-bold mb-3">Données perdues</h3>
              <p className="text-zinc-400 leading-relaxed">Changez de téléphone ? Vos 6 mois de tracking disparaissent.</p>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="py-24 w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Notre solution simple et puissante</h2>
            <p className="text-zinc-400 text-lg md:text-xl">Conçu par un bodybuilder, pour les bodybuilders</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="bg-[#111] p-8 md:p-10 rounded-3xl border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Tag className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Cru vs Cuit intelligent</h3>
              <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                Marquez chaque aliment comme cru ou cuit. L'app utilise automatiquement les bonnes valeurs nutritionnelles. <span className="text-emerald-400 font-medium">Fini les erreurs de calcul.</span>
              </p>
              <div className="flex gap-3">
                <span className="px-4 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 text-sm font-bold tracking-wider">CRU</span>
                <span className="px-4 py-1.5 rounded-lg border border-amber-500/30 text-amber-500 text-sm font-bold tracking-wider">CUIT</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#111] p-8 md:p-10 rounded-3xl border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6">
                <ChefHat className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Recettes en 1 clic</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Créez vos recettes et meal preps. Les macros s'ajustent avec précision selon la cuisson. <span className="text-amber-500 font-medium">Gagnez du temps chaque semaine.</span>
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#111] p-8 md:p-10 rounded-3xl border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Database className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Frigo virtuel</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Ajoutez vos aliments personnalisés. Créez votre propre base de données. <span className="text-blue-400 font-medium">Votre nutrition, vos règles.</span>
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#111] p-8 md:p-10 rounded-3xl border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Cloud className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Sync cloud permanent</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Vos données sauvegardées en temps réel. Accessible depuis n'importe quel appareil. <span className="text-purple-400 font-medium">Jamais de perte de données.</span>
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 w-full flex justify-center pb-32">
          <div className="bg-gradient-to-br from-[#111] to-zinc-900 border border-zinc-800 p-12 md:p-16 rounded-[3rem] text-center w-full max-w-4xl relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5 blur-[100px]" />
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight relative z-10 leading-tight">
              Prêt à optimiser <br />
              votre nutrition ?
            </h2>
            <p className="text-zinc-400 text-xl font-medium mb-10 max-w-xl mx-auto relative z-10">
              Rejoignez des milliers d'athlètes qui ont transformé leur tracking
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 bg-white text-black font-bold text-lg px-8 py-4 rounded-full hover:bg-zinc-200 transition-transform hover:scale-105 relative z-10"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
