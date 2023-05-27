import GameList from "./GameList";
import styles from "./gamePickModal.module.css";
import type { GameType } from ".";

interface GamePickModalProps {
  gameList: GameType[];
  activeGameId: string;
  onGameChange: (gameId: string) => void;
  onClose: () => void;
}

export default function GamePickModal({
  onGameChange,
  onClose,
  gameList,
  activeGameId,
}: GamePickModalProps) {
  return (
    <div className="absolute left-0 w-full h-[500px] bg-[#292A2D] rounded-[10px] p-[25px]">
      <button
        className="absolute  w-[68px] h-[68px] translate-x-[-100%] top-[-6px] left-[-36px]   text-white rounded-[10px] bg-[#292A2D]"
        onClick={onClose}
      >
        {/* TODO replace inline-svg to Icon component */}
        <svg
          style={{ margin: "0 auto" }}
          width="12"
          height="21"
          viewBox="0 0 12 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.4335 18.867L2 10.4335L10.4335 2"
            stroke="white"
            strokeWidth="2.81116"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className={`overflow-y-scroll h-full ${styles.scrollbar}`}>
        <GameList
          gameList={gameList}
          onGameChange={onGameChange}
          activeGameId={activeGameId}
        />
      </div>
    </div>
  );
}
