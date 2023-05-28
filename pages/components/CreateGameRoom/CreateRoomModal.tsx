import {
  useState,
  useEffect,
  useContext,
  FormEvent,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import Button from "@/shared/components/Button";
import GamePickModal from "./GamePickModal";
import { createRoomEndpoint } from "@/requests/rooms";
import { getAllGamesEndpoint } from "@/requests/games";
import useRequest from "@/shared/hooks/useRequest";
import { CreateRoomResponseType } from "@/pages/api/mock/rooms";
import { useRouter } from "next/router";
import { GameType } from "@/pages/api/mock/games";
import CreateGameRoomContext from "@/shared/contexts/CreateGameRoomContext";
import styles from "./createRoomModall.module.css";

export default function CreateRoomModal() {
  const [gameList, setGameList] = useState<GameType[]>([]);
  const [showPickGameModal, setShowPickGameModal] = useState(false);
  const { fetch } = useRequest();
  const { push } = useRouter();
  const { roomForm, setRoomForm } = useContext(CreateGameRoomContext);
  const [currentGame, setCurrentGame] = useState<GameType | undefined>(
    undefined
  );
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [passwords, setPasswords] = useState(["", "", "", ""]);

  // 取得遊戲清單
  useEffect(() => {
    async function handleGetAllGame() {
      const result = (await fetch(getAllGamesEndpoint())) as any as GameType[];
      setGameList(result);
    }
    handleGetAllGame();
  }, [fetch]);

  useEffect(() => {
    const game = gameList.find((game) => game.id === roomForm.gameId);
    game && setCurrentGame(game);
  }, [roomForm.gameId, gameList]);

  // 變更遊戲事件
  function handleChangeGame(gameId: string) {
    setRoomForm({ ...roomForm, gameId });
  }

  // 變更遊戲最大人數事件
  function handleChangeMaxplayers(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setRoomForm({ ...roomForm, maxPlayers: Number(value) });
  }

  // 變更房間類型事件
  function handleChangeIsPublic(event: ChangeEvent<HTMLInputElement>) {
    const isPublic = event.target.value === "public";
    setIsPublic(isPublic);
  }

  const isNumeric = (value: string) => {
    const regExp = /[0-9]/;
    return regExp.test(value);
  };

  // 變更密碼 keyup 事件
  function handlePasswordKeyUp(e: KeyboardEvent, index: number) {
    if (!isNumeric(e.key)) return;
    handlePasswordChange(e.key, index);
  }
  // 變更密碼 change 事件
  function handlePasswordChange(value: string, index: number) {
    if (!isNumeric(value) && value !== "") return;
    const nextPasswords = [...passwords];
    nextPasswords[Number(index)] = value;
    setPasswords(nextPasswords);
  }

  // 創建房間事件
  async function handleCreateRoom(event: FormEvent) {
    if (!roomForm.name) return;
    event.preventDefault();
    const password = Number(passwords.join(""));
    setRoomForm({ ...roomForm, password });
    const result = (await fetch(
      createRoomEndpoint({ ...roomForm, password })
    )) as any as CreateRoomResponseType;
    push(`/rooms/${result.id}`);
  }

  return (
    <>
      <form className="flex flex-col gap-[24px] py-10 px-[55px] mix-h-[500px] mx-auto">
        <div className="flex">
          <label htmlFor="name" className="inline-block min-w-[145px]">
            請輸入房間名稱
          </label>
          <input
            className="text-base py-[5px] px-[9px] border-[#1E1F22] border rounded-[10px] bg-[#1E1F22] w-full"
            onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
            value={roomForm.name}
            name="name"
            id="name"
            required
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="gameId" className="inline-block min-w-[145px]">
            請選擇遊戲
          </label>
          <div className="relative w-full text-base py-[5px] px-[9px] border-[#1E1F22] border rounded-[10px] bg-[#1E1F22]">
            <span>{roomForm.gameId}</span>
            <button
              className="w-[28.11px] h-[28.11px] ml-[9px] absolute right-[-8px] translate-x-[100%] "
              onClick={() => setShowPickGameModal(true)}
            >
              <svg
                className="stroke-[2.8116] stroke-[#1E1F22] hover:stroke-[#2F88FF]"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.0518 12.0598C12.6315 12.7382 11.6503 14.1879 11.6503 15.8669C11.6503 18.1957 13.5382 20.0836 15.867 20.0836C17.546 20.0836 18.9958 19.1024 19.6742 17.6821"
                  strokeWidth="2.81116"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.8744 7.23721C17.9326 6.90908 16.9206 6.73071 15.867 6.73071C10.8212 6.73071 6.73071 10.8212 6.73071 15.867C6.73071 20.9128 10.8212 25.0033 15.867 25.0033C20.9128 25.0033 25.0033 20.9128 25.0033 15.867C25.0033 14.8134 24.8249 13.8013 24.4968 12.8595"
                  strokeWidth="2.81116"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22.5909 3.52085C20.5936 2.4308 18.3026 1.81128 15.867 1.81128C8.10416 1.81128 1.81116 8.10428 1.81116 15.8671C1.81116 23.6299 8.10416 29.9229 15.867 29.9229C23.6298 29.9229 29.9228 23.6299 29.9228 15.8671C29.9228 13.4314 29.3033 11.1405 28.2132 9.14314"
                  strokeWidth="2.81116"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M29.9228 1.81128L15.8669 15.8671"
                  strokeWidth="2.81116"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex">
          <span className="inline-block min-w-[145px]">請選擇人數</span>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-[13px]">
            {Object.keys(Array.from({ length: 10 })).map((_, index) => (
              <div key={index + 1}>
                <input
                  value={index + 1}
                  name="maxPlayers"
                  id={`radio-maxPlayers-${index + 1}`}
                  type="radio"
                  className={`radio__maxPlayers hidden ${styles.radio__maxPlayers}`}
                  checked={roomForm.maxPlayers === index + 1}
                  onChange={handleChangeMaxplayers}
                  disabled={
                    (currentGame && index + 1 > currentGame.maxPlayers) ||
                    (currentGame && index + 1 < currentGame.minPlayers)
                  }
                />
                <label
                  htmlFor={`radio-maxPlayers-${index + 1}`}
                  className="flex items-center justify-center h-[34px] w-[45px] border-[#1E1F22] border rounded-[10px] text-base cursor-pointer hover:border-[#2F88FF] hover:border-2 transition-colors"
                >
                  {index + 1}人
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex">
          <span className="inline-block min-w-[145px]">請選擇房間類型</span>
          <div className="flex gap-[21px] lg:gap-[42px] lg:mx-auto flex-col lg:flex-row">
            <div>
              <input
                id="radio-isPublic-public"
                name="isPublic"
                type="radio"
                value="public"
                className={`hidden ${styles.radio__isPublic}`}
                checked={isPublic}
                onChange={handleChangeIsPublic}
              />
              <label
                htmlFor="radio-isPublic-public"
                className="block label__container w-[200px] h-[133px] rounded-[10px] border border-[#1E1F22] pt-[14px] px-6 text-center text-base cursor-pointer"
              >
                公開房間
                <div className="text-sm mt-[14px] flex flex-col">
                  <span>不須輸入密碼</span>
                  <span>任何人都能加入此房間</span>
                </div>
              </label>
            </div>
            <div>
              <input
                id="radio-isPublic-private"
                name="isPublic"
                type="radio"
                value="private"
                className={`hidden ${styles.radio__isPublic}`}
                checked={!isPublic}
                onChange={handleChangeIsPublic}
              />

              <label
                htmlFor="radio-isPublic-private"
                className="block label__container w-[200px] h-[133px] rounded-[10px] border border-[#1E1F22] pt-[14px] px-6 text-center text-base cursor-pointer"
              >
                私人房間
                <div className="text-sm mt-[14px] flex flex-col">
                  <span>請輸入此房間密碼</span>
                </div>
                <div
                  className="flex gap-[5px] mt-[7px]"
                  onClick={() => setIsPublic(false)}
                >
                  {passwords.map((password, index) => (
                    <div key={index}>
                      <input
                        id={`input-password-${index}`}
                        type="text"
                        maxLength={1}
                        className="bg-[#1E1F22] w-[34px] aspect-square rounded-[10px] text-[#2F88FF] focus:outline focus:outline-[#2F88FF] focus:outline-2 text-center cursor-default caret-transparent"
                        value={password}
                        onKeyUp={(e) => handlePasswordKeyUp(e, index)}
                        onChange={(e) =>
                          handlePasswordChange(e.target.value, index)
                        }
                      />
                    </div>
                  ))}
                </div>
              </label>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          onClick={handleCreateRoom}
          className="w-[446px] flex justify-center text-white bg-[#2F88FF] rounded-[21px] self-center lg:mt-9"
        >
          開設新房間
        </Button>
      </form>
      {showPickGameModal && (
        <GamePickModal
          activeGameId={roomForm.gameId}
          gameList={gameList}
          onGameChange={handleChangeGame}
          onClose={() => setShowPickGameModal(false)}
        />
      )}
    </>
  );
}
