import React from "react";
import { Film, Coffee, ShoppingBag, Utensils } from "lucide-react";

const TransactionItem = ({
  title,
  date,
  amount,
  points,
  isSplit = false,
  participants = [],
  paidByName = null,
  totalAmount = null,
  onClick = null,
}: {
  title: string;
  date: string;
  amount: string;
  points: number;
  isSplit: boolean;
  participants: { id: string; name: string }[];
  paidByName: string | null;
  totalAmount: string | null;
  onClick: (() => void) | null;
}) => {
  // Generate avatar colors based on name
  const getAvatarGradient = (name: string) => {
    const gradients = [
      "from-blue-500 to-purple-600",
      "from-emerald-500 to-teal-600",
      "from-pink-500 to-rose-600",
      "from-orange-500 to-red-600",
      "from-indigo-500 to-blue-600",
      "from-violet-500 to-purple-600",
      "from-cyan-500 to-blue-600",
      "from-amber-500 to-orange-600",
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };
  // Format date
  const formattedDate = new Date(date)
    .toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    })
    .toUpperCase();

  // Get month and day
  const [month, day] = formattedDate.split(" ");

  // Choose icon based on title
  const getIcon = () => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("netflix") || lowerTitle.includes("movie")) {
      return <Film className="w-5 h-5 text-red-500" />;
    } else if (
      lowerTitle.includes("cafe") ||
      lowerTitle.includes("restaurant")
    ) {
      return <Utensils className="w-5 h-5 text-orange-500" />;
    } else if (
      lowerTitle.includes("coffee") ||
      lowerTitle.includes("starbucks")
    ) {
      return <Coffee className="w-5 h-5 text-amber-600" />;
    } else {
      return <ShoppingBag className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div
      className={`flex items-center justify-between py-4 px-6 ${
        onClick ? "cursor-pointer hover:bg-gray-50 transition-colors" : ""
      }`}
      onClick={onClick ?? (() => {})}
    >
      <div className="flex items-center flex-1">
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mr-4 flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <p className="text-xs text-gray-500">
              {day} {month}
            </p>
            {paidByName && (
              <span className="text-xs text-gray-400">
                • Paid by {paidByName}
              </span>
            )}
            {totalAmount && (
              <span className="text-xs text-gray-400">
                • Total ${totalAmount}
              </span>
            )}
            {isSplit && participants.length > 0 && (
              <div className="flex items-center">
                <span className="text-xs text-gray-400 mr-1">• Split with</span>
                <div className="flex -space-x-2">
                  {participants.slice(0, 3).map((participant, index) => (
                    <div
                      key={participant.id || index}
                      className={`w-6 h-6 rounded-full bg-gradient-to-br ${getAvatarGradient(
                        participant.name
                      )} flex items-center justify-center text-white text-xs font-semibold border-2 border-white`}
                      title={participant.name}
                    >
                      {participant.name.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {participants.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-semibold border-2 border-white">
                      +{participants.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {isSplit && (
          <span className="bg-blue-50 text-blue-700 text-xs font-semibold rounded-full px-2.5 py-1">
            SPLIT
          </span>
        )}
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">${amount}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
