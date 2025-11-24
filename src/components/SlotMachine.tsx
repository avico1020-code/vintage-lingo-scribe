import { useState } from "react";
import { motion } from "framer-motion";

interface SlotMachineProps {
  currentWord: string;
  isSpinning: boolean;
  onPullHandle: () => void;
}

export const SlotMachine = ({ currentWord, isSpinning, onPullHandle }: SlotMachineProps) => {
  const [handlePulled, setHandlePulled] = useState(false);

  const handleClick = () => {
    if (isSpinning) return;
    setHandlePulled(true);
    onPullHandle();
    setTimeout(() => setHandlePulled(false), 500);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Slot Machine Body */}
      <div className="relative bg-gradient-to-b from-pink-500 to-pink-600 rounded-3xl p-8 vintage-shadow border-4 border-pink-700">
        {/* Top Arc */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-pink-500 to-pink-600 rounded-t-full border-4 border-pink-700 border-b-0 flex items-center justify-center">
          <div className="absolute top-6 w-full">
            {/* Decorative dots */}
            <div className="flex justify-around px-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-yellow-400 rounded-full border-2 border-yellow-600" />
              ))}
            </div>
          </div>
          <div className="text-2xl font-bold text-yellow-400 mt-8 tracking-wider" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.3)' }}>
            BIG WIN
          </div>
        </div>

        {/* Display Window */}
        <div className="bg-yellow-400 rounded-2xl p-6 mb-6 mt-12 border-4 border-yellow-600">
          <div className="bg-gray-900 rounded-xl p-8 min-h-32 flex items-center justify-center border-4 border-gray-800">
            <motion.div
              key={currentWord}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-cyan-400 text-center break-words"
              style={{ textShadow: '0 0 20px rgba(34, 211, 238, 0.5)' }}
            >
              {isSpinning ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                >
                  🎰
                </motion.div>
              ) : currentWord ? (
                currentWord
              ) : (
                <span className="text-2xl text-cyan-500">משוך את הידית!</span>
              )}
            </motion.div>
          </div>
        </div>

        {/* Coins */}
        <div className="flex justify-center gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-12 h-12 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full border-4 border-yellow-700" />
          ))}
        </div>

        {/* Bottom Grill */}
        <div className="bg-cyan-500 rounded-xl p-4 border-4 border-cyan-700">
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-2 bg-yellow-400 rounded-full border-2 border-yellow-600" />
            ))}
          </div>
        </div>
      </div>

      {/* Handle */}
      <motion.button
        onClick={handleClick}
        animate={{ 
          rotate: handlePulled ? 45 : 0,
          y: handlePulled ? 20 : 0 
        }}
        transition={{ duration: 0.3 }}
        className="absolute -right-8 top-32 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isSpinning}
      >
        {/* Handle Base */}
        <div className="relative">
          <div className="w-8 h-32 bg-gradient-to-r from-pink-600 to-pink-500 rounded-full border-4 border-pink-700" />
          {/* Handle Knob */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full border-4 border-pink-700 shadow-lg" />
        </div>
      </motion.button>
    </div>
  );
};
