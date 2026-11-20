import type { Episode, VoiceMeta } from "../types";
import script from "./script.json";
import voice from "./voice.json";
import {
  ChatScene, EasyMoneyScene, FrozenScene, HookScene, OutroScene, RevealScene, RightWayScene, RoomScene, StationScene, StepsScene,
} from "./visuals";

const SOURCE = "स्रोत: RBI जागरूकता चेतावनी, मनी म्यूल (RBI कहता है) · शिकायत: 1930 या cybercrime.gov.in · कहानी काल्पनिक है";

const visuals: Record<string, React.FC<{ dur: number }>> = {
  hook: HookScene,
  room: RoomScene,
  chat: ChatScene,
  easyMoney: EasyMoneyScene,
  reveal: RevealScene,
  frozen: FrozenScene,
  station: StationScene,
  rightWay: RightWayScene,
  steps: StepsScene,
  outro: ({ dur }) => <OutroScene dur={dur} source={SOURCE} />,
};

const onScreen: Record<string, string> = {
  hook: "खाता किराए पर = जेल का खतरा",
};

export const ep1: Episode = {
  id: "ScamEp1-MuleAccount",
  number: 1,
  title: "म्यूल अकाउंट",
  source: SOURCE,
  caption:
    "खाता किराए पर देना यानी खुद को ठगी में फँसाना। आसान कमाई के ऑफ़र से बचें, और अनजान लोगों के पैसे अपने खाते से आगे न भेजें। #MuleAccount #ScamAlert #CyberFraud #1930 #पैसेकीसुरक्षा",
  voice: voice as VoiceMeta,
  scenes: script.scenes.map((s) => ({ ...s, onScreen: onScreen[s.id], Visual: visuals[s.id] })),
};
