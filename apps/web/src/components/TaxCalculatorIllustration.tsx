import { motion } from 'framer-motion';

export default function TaxCalculatorIllustration() {
  return (
    <div className="relative w-full h-full max-w-2xl mx-auto flex items-center justify-center">
      <svg
        viewBox="0 0 600 600"
        className="w-full h-full max-w-[600px] max-h-[600px]"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Tax calculator illustration"
      >
        {/* Enterprise Box */}
        <motion.rect
          x="50"
          y="100"
          width="200"
          height="150"
          rx="8"
          fill="none"
          stroke="rgb(17, 24, 39)"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.text
          x="150"
          y="140"
          textAnchor="middle"
          fill="rgb(17, 24, 39)"
          fontSize="20"
          fontWeight="600"
          fontFamily="Instrument Serif, serif"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Enterprise
        </motion.text>
        <motion.text
          x="150"
          y="180"
          textAnchor="middle"
          fill="rgb(107, 114, 128)"
          fontSize="16"
          fontFamily="Inter, sans-serif"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          RM120,000
        </motion.text>
        <motion.text
          x="150"
          y="210"
          textAnchor="middle"
          fill="rgb(107, 114, 128)"
          fontSize="14"
          fontFamily="Inter, sans-serif"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Net Cash
        </motion.text>

        {/* Sdn Bhd Box */}
        <motion.rect
          x="350"
          y="100"
          width="200"
          height="150"
          rx="8"
          fill="none"
          stroke="rgb(17, 24, 39)"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.text
          x="450"
          y="140"
          textAnchor="middle"
          fill="rgb(17, 24, 39)"
          fontSize="20"
          fontWeight="600"
          fontFamily="Instrument Serif, serif"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Sdn Bhd
        </motion.text>
        <motion.text
          x="450"
          y="180"
          textAnchor="middle"
          fill="rgb(107, 114, 128)"
          fontSize="16"
          fontFamily="Inter, sans-serif"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          RM122,300
        </motion.text>
        <motion.text
          x="450"
          y="210"
          textAnchor="middle"
          fill="rgb(107, 114, 128)"
          fontSize="14"
          fontFamily="Inter, sans-serif"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Net Cash
        </motion.text>

        {/* VS Text */}
        <motion.text
          x="300"
          y="180"
          textAnchor="middle"
          fill="rgb(17, 24, 39)"
          fontSize="24"
          fontWeight="700"
          fontFamily="Instrument Serif, serif"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
        >
          VS
        </motion.text>

        <motion.path
          d="M 300 340 L 380 340"
          stroke="rgb(17, 24, 39)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.polygon
          points="375,335 385,340 375,345"
          fill="rgb(17, 24, 39)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        />

        <motion.text
          x="300"
          y="400"
          textAnchor="middle"
          fill="rgb(17, 24, 39)"
          fontSize="18"
          fontWeight="600"
          fontFamily="Inter, sans-serif"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          Better to switch to Sdn Bhd
        </motion.text>
        <motion.text
          x="300"
          y="430"
          textAnchor="middle"
          fill="rgb(107, 114, 128)"
          fontSize="15"
          fontFamily="Inter, sans-serif"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
        >
          Save RM2,300 per year
        </motion.text>
      </svg>
    </div>
  );
}

