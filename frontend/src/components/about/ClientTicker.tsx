import React from 'react';
import { motion } from 'motion/react';
import { logos } from '../../assets/logos';

const clients = [
  { name: "ADNOC", logo: logos.adnoc },
  { name: "Aldar", logo: logos.aldar },
  { name: "ALEC", logo: logos.alec },
  { name: "Crescent Petroleum", logo: logos.crescent_petroleum },
  { name: "du", logo: logos.du },
  { name: "Emaar", logo: logos.emaar },
  { name: "ENOC", logo: logos.enoc },
  { name: "Etisalat", logo: logos.etisalat },
  { name: "Jumeirah", logo: logos.jumeirah, needsDarkBg: true }, // Added flag here
  { name: "Millennium Hotels", logo: logos.millennium },
  { name: "Miral", logo: logos.miral },
  { name: "NMDC", logo: logos.nmdc },
];

export default function ClientTicker() {
  const LogoBlock = () => (
    <div className="flex items-center gap-16 md:gap-24 pr-16 md:pr-24">
      {clients.map((client, index) => (
        <div
          key={`${client.name}-${index}`}
          className="flex-shrink-0 group w-28 md:w-40 h-16 flex items-center justify-center transition-all duration-500"
        >
          <img
            src={client.logo}
            alt={client.name}
            // Dynamically add a background, padding, and rounded corners if it's a white logo
            className={`max-h-full max-w-full object-contain group-hover:scale-110 transition-all duration-500 ${client.needsDarkBg ? 'bg-slate-800 p-2 md:p-3 rounded-lg shadow-sm' : ''
              }`}
            loading="eager"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('span')) {
                const text = document.createElement('span');
                text.innerText = client.name;
                text.className = 'text-[10px] font-bold tracking-widest text-primary uppercase whitespace-nowrap text-center opacity-70';
                parent.appendChild(text);
              }
            }}
          />
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-24 bg-gradient-to-b from-[#FBF7F0] to-[#F5EFE4] overflow-hidden relative border-y border-slate-200/40">
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.6em] text-gold font-bold block mb-5 bg-gold/10 px-4 py-1.5 rounded-full">
            Esteemed Clientele
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-primary leading-tight tracking-tight">
            The <span className="italic font-light text-slate-700">Network</span> of Trust
          </h2>
          <p className="text-slate-600 text-sm md:text-base mt-6 max-w-xl mx-auto font-light leading-relaxed">
            Collaborating with regional giants and global leaders to drive strategic growth and leadership excellence.
          </p>
        </motion.div>
      </div>

      <div className="relative z-10 w-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 md:w-72 bg-gradient-to-r from-[#F7F2E9] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 md:w-72 bg-gradient-to-l from-[#F7F2E9] to-transparent z-20 pointer-events-none" />

        <motion.div
          className="flex w-max items-center py-4 will-change-transform"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <LogoBlock />
          <LogoBlock />
        </motion.div>
      </div>
    </section>
  );
}