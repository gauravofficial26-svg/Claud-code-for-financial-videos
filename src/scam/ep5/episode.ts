import { makeEpisode } from "../makeEpisode";
import script from "./script.json";
import voice from "./voice.json";
import * as V from "./visuals";

export const ep5 = makeEpisode({
  id: "ScamEp5-CallMerge", number: 5, title: "कॉल मर्ज ट्रैप", script, voice, source: V.SOURCE,
  visuals: { hook: V.HookScene, intro: V.IntroScene, merge: V.MergeScene, listen: V.ListenScene, loot: V.LootScene, rule: V.RuleScene, steps: V.Steps, outro: V.Outro },
  onScreen: { hook: "कॉल मर्ज मत करो!" },
  caption: "अनजान कॉलर कोई दूसरा कॉल मर्ज करने को कहे तो मत करें। वो कॉल आपके बैंक का OTP कॉल हो सकता है। किसी को OTP, PIN या CVV न बताएं। #CallMerging #OTPScam #ScamAlert #1930 #पैसेकीसुरक्षा",
});
