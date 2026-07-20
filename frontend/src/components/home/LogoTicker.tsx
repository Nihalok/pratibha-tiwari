import React from 'react';
import { motion } from 'motion/react';
import { logos } from '../../assets/logos';

// Partners structure prepared for local SVG assets
const partners = [
  {
    name: "ICC",
    logo: logos.icc,
    fallbackText: "ICC",
    isLarge: true
  },
  {
    name: "PCC",
    logo: logos.pcc,
    fallbackText: "PCC",
    isLarge: true
  },
  {
    name: "NLP",
    logo: logos.nlp,
    fallbackText: "NLP"
  },
  {
    name: "IIT",
    logo: logos.iit,
    fallbackText: "IIT",
    isLarge: true
  },
  {
    name: "Khaleej Times",
    logo: logos.khaleej_times,
    fallbackText: "KHALEEJ TIMES"
  },
  {
    name: "Hindustan Times",
    logo: logos.hindustan_times,
    fallbackText: "HINDUSTAN TIMES"
  },
  {
    name: "Mumbai Express",
    logo: logos.mumbai_express,
    fallbackText: "MUMBAI EXPRESS"
  },
  {
    name: "Gulf News",
    logo: logos.gulf_news,
    fallbackText: "GULF NEWS"
  },
  {
    name: "ICF",
    logo: logos.icf,
    fallbackText: "ICF",
    isLarge: true
  },
  {
    name: "TED X",
    logo: logos.tedx,
    fallbackText: "TED X"
  }
];

export default function LogoTicker() {
  const [failedLogos, setFailedLogos] = React.useState<Record<string, boolean>>({});

  // Updated to accept a unique key instead of just name/index to account for the duplicated blocks
  const handleLogoError = (key: string) => {
    setFailedLogos(prev => ({ ...prev, [key]: true }));
  };

  // Reusable block to ensure perfect seamless looping
  const LogoBlock = ({ blockId }: { blockId: number }) => (
    <div className="flex items-center gap-16 md:gap-24 pr-16 md:pr-24">
      {partners.map((partner, index) => {
        const key = `${partner.name}-${blockId}-${index}`;
        const hasFailed = failedLogos[key];

        return (
          <div
            key={key}
            className="flex-shrink-0"
          >
            <div className={`${partner.isLarge ? 'h-12 md:h-16' : 'h-8 md:h-12'} w-auto flex items-center justify-center transition-all duration-300 opacity-100`}>
              {hasFailed ? (
                <span className="text-[9px] font-bold tracking-widest text-primary uppercase">
                  {partner.fallbackText || partner.name}
                </span>
              ) : (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-full w-auto object-contain brightness-110"
                  onError={() => handleLogoError(key)}
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <section className="py-12 bg-transparent overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >

          <h2 className="text-4xl md:text-6xl font-serif text-primary leading-tight">
            <span className='text-gold' >Academic & Professional Recognitions</span>
          </h2>
          <p className="text-slate-800 text-sm md:text-base mt-4 max-w-xl mx-auto font-normal tracking-wide">
            An Alumna and Featured Voice Across Leading Platforms
          </p>
        </motion.div>
      </div>

      <div className="relative z-10 w-full overflow-hidden">
        {/* Soft gradient edge masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-pearl to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-pearl to-transparent z-20 pointer-events-none" />

        {/* w-max is critical here so the 50% translation matches the duplicated blocks perfectly */}
        <motion.div
          key="logo-ticker-track"
          className="flex w-max items-center py-4 will-change-transform"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration: 35, // Adjust to speed up/slow down
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop"
          }}
        >
          {/* Exactly two identical blocks make the loop seamless */}
          <LogoBlock blockId={1} />
          <LogoBlock blockId={2} />
        </motion.div>
      </div>
    </section>
  );
}