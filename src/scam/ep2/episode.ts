import { makeEpisode } from "../makeEpisode";
import script from "./script.json";
import voice from "./voice.json";
import * as V from "./visuals";

export const ep2 = makeEpisode({
  id: "ScamEp2-AePS", number: 2, title: "उँगली से चोरी", script, voice, source: V.SOURCE,
  visuals: { hook: V.HookScene, intro: V.IntroScene, leak: V.LeakScene, clone: V.CloneScene, match: V.MatchScene, lock: V.LockScene, unlock: V.UnlockScene, steps: V.Steps, outro: V.Outro },
  onScreen: { hook: "OTP नहीं। कार्ड नहीं। फिर भी पैसे गायब!" },
  caption: "आपके उँगली के निशान से भी पैसे निकल सकते हैं। आज ही आधार बायोमेट्रिक लॉक करें (uidai.gov.in या mAadhaar ऐप)। पैसे कटें तो तुरंत 1930 पर बताएँ। #AePS #AadhaarFraud #ScamAlert #1930 #पैसेकीसुरक्षा",
});
