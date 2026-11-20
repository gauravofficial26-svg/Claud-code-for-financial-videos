import { Outro } from "../Outro";
import { StepCards } from "../StepCards";
import type { Episode } from "../types";
import { ChatScene, FrozenScene, HookScene, JusticeScene, MoneyFlowScene, NeverShareScene } from "./visuals";

const SOURCE = "स्रोत: RBI जागरूकता चेतावनी, मनी म्यूल (RBI कहता है) · शिकायत: 1930 या cybercrime.gov.in";

export const ep1: Episode = {
  id: "ScamEp1-MuleAccount",
  number: 1,
  title: "म्यूल अकाउंट",
  source: SOURCE,
  caption:
    "खाता किराए पर देना यानी खुद को ठगी में फँसाना। आसान कमाई के ऑफ़र से बचें, और अनजान लोगों के पैसे अपने खाते से आगे न भेजें। #MuleAccount #ScamAlert #CyberFraud #1930 #पैसेकीसुरक्षा",
  scenes: [
    {
      from: 0, to: 2,
      voiceover: "अपना बैंक अकाउंट किराए पर देकर कमीशन कमा रहे हैं? आप जेल जा सकते हैं!",
      onScreen: "अकाउंट किराए पर = खतरा",
      Visual: HookScene,
    },
    {
      from: 2, to: 8,
      voiceover: "सोशल मीडिया, मैसेज या कॉल पर कोई कहता है, आपके खाते में पैसे आएँगे, बस आगे भेज दो, बदले में कमीशन मिलेगा।",
      onScreen: "\"पैसा आगे भेज दो, कमीशन तुम्हारा\"",
      Visual: ChatScene,
    },
    {
      from: 8, to: 15,
      voiceover: "आपका खाता बस बीच का रास्ता बनता है। असल में यह ठगी का पैसा होता है, जो आपके खाते से घूमकर आगे निकल जाता है।",
      onScreen: "आपका खाता = बीच का रास्ता",
      Visual: MoneyFlowScene,
    },
    {
      from: 15, to: 22,
      voiceover: "जाँच शुरू हुई तो सबसे पहले आपका खाता फ्रीज़ होगा। पुलिस पूछताछ आपसे होगी, ठग से नहीं।",
      onScreen: "खाता फ्रीज़ + पूछताछ",
      Visual: FrozenScene,
    },
    {
      from: 22, to: 29,
      voiceover: "और \"मुझे पता नहीं था\" कहने से बचाव नहीं होता। RBI के अनुसार, अनजाने में भी जाँच हो सकती है, और गंभीर मामलों में जेल तक हो सकती है।",
      onScreen: "अनजाने में भी जाँच हो सकती है",
      Visual: JusticeScene,
    },
    {
      from: 29, to: 36,
      voiceover: "अपना खाता, डेबिट कार्ड, OTP और PIN किसी को मत दीजिए, चाहे कितना भी कमीशन मिले। बैंक और RBI कभी OTP या PIN नहीं माँगते।",
      onScreen: "खाता, कार्ड, OTP, PIN: किसी को नहीं",
      Visual: NeverShareScene,
    },
    {
      from: 36, to: 42,
      voiceover: "अनजान से पैसे लेकर आगे मत भेजिए, ऑफ़र ठुकराइए, और बैंक को बताइए। ठगी का शक हो तो 1930 पर कॉल कीजिए।",
      Visual: () => <StepCards title="क्या करें?" steps={["ऑफ़र ठुकराओ", "पैसे आगे मत भेजो", "बैंक को बताओ + 1930"]} />,
    },
    {
      from: 42, to: 48,
      voiceover: "यह वीडियो उन सबको भेजिए जिन्हें \"आसान कमाई\" का ऑफ़र मिलता है, खासकर स्टूडेंट्स को। ऐसे नए स्कैम से बचने के लिए हमें फॉलो कीजिए।",
      onScreen: "शेयर करें। फॉलो करें।",
      Visual: () => (
        <Outro source={SOURCE} audiences={[{ label: "स्टूडेंट्स", cap: true, color: "#60A5FA" }, { label: "माता-पिता", count: 2, color: "#F9A8D4" }]} />
      ),
    },
  ],
};
