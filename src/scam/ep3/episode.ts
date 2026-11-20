import { makeEpisode } from "../makeEpisode";
import script from "./script.json";
import voice from "./voice.json";
import * as V from "./visuals";

export const ep3 = makeEpisode({
  id: "ScamEp3-UnclaimedMoney", number: 3, title: "\"आपके पैसे पड़े हैं\"", script, voice, source: V.SOURCE,
  visuals: { hook: V.HookScene, intro: V.IntroScene, call: V.CallScene, bonus: V.BonusScene, pressure: V.PressureScene, trap: V.TrapScene, save: V.SaveScene, steps: V.Steps, outro: V.Outro },
  onScreen: { hook: "\"आपके पैसे पड़े हैं\" = जाल" },
  caption: "\"अनक्लेम्ड पैसा\" या \"पॉलिसी बोनस\" के नाम पर पैसे माँगने वाला हर कॉल शक के घेरे में है। पैसे देखने के लिए सिर्फ़ udgam.rbi.org.in, और पॉलिसी के लिए बीमा कंपनी का आधिकारिक नंबर इस्तेमाल करें। #UDGAM #InsuranceScam #ScamAlert #1930 #पैसेकीसुरक्षा",
});
