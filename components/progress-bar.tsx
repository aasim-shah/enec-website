import { motion } from "framer-motion";

type ProgressBarProps = {
  progress: number;
};

export const UploadProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="relative w-7/12  mx-4 mr-auto h-4 bg-gray-800 rounded-full overflow-hidden shadow-lg border border-gray-700">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ ease: "easeOut", duration: 0.5 }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
        {progress}%
      </div>
    </div>
  );
};
