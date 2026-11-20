import { makeEpisode } from "../makeEpisode";
import script from "./script.json";
import voice from "./voice.json";
import * as V from "./visuals";

export const ep4 = makeEpisode({
  id: "ScamEp4-FakeIPO", number: 4, title: "फर्जी IPO ग्रुप", script, voice, source: V.SOURCE,
  visuals: { hook: V.HookScene, intro: V.IntroScene, group: V.GroupScene, words: V.WordsScene, app: V.AppScene, withdraw: V.WithdrawScene, check: V.CheckScene, steps: V.Steps, outro: V.Outro },
  onScreen: { hook: "\"गारंटीड IPO\" = खतरा" },
  caption: "\"गारंटीड IPO\", \"इंस्टीट्यूशनल अकाउंट\" और \"सस्ते में ब्लॉक डील\" वाले ग्रुप से दूर रहें। निवेश से पहले SEBI की वेबसाइट पर रजिस्ट्रेशन जाँचें। (यह निवेश सलाह नहीं, सुरक्षा जानकारी है।) #FakeIPO #SEBIAlert #ScamAlert #1930 #पैसेकीसुरक्षा",
});
