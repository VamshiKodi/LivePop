import { FaShareAlt, FaTwitter, FaLinkedin, FaCopy, FaCheck } from 'react-icons/fa';
import { useState } from 'react';

interface ShareButtonProps {
  countryName: string;
  population: number;
  url: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ countryName, population, url }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatPop = (pop: number) => {
    if (pop >= 1e9) return `${(pop / 1e9).toFixed(2)}B`;
    if (pop >= 1e6) return `${(pop / 1e6).toFixed(1)}M`;
    return pop.toLocaleString();
  };

  const text = `${countryName} has a live population of ${formatPop(population)} people! Check it out on LivePop.`;

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareToLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinUrl, '_blank');
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(`${text} ${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center gap-2 px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors text-sm font-medium"
      >
        <FaShareAlt size={14} />
        Share
      </button>

      {showOptions && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowOptions(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <button
              onClick={shareToTwitter}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <FaTwitter className="text-blue-400" />
              <span className="text-gray-700 dark:text-gray-300">Twitter</span>
            </button>
            <button
              onClick={shareToLinkedIn}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <FaLinkedin className="text-blue-600" />
              <span className="text-gray-700 dark:text-gray-300">LinkedIn</span>
            </button>
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
              {copied ? <FaCheck className="text-green-500" /> : <FaCopy className="text-gray-500" />}
              <span className="text-gray-700 dark:text-gray-300">
                {copied ? 'Copied!' : 'Copy Link'}
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;
