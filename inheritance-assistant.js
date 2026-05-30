/**
 * Mishkath Inheritance AI Assistant & Calculator
 * A premium, fully client-side Fara'id (Islamic Inheritance Law) Chatbot & Calculator.
 * Matches the Mishkath brand aesthetic (charcoal, gold highlights, glassmorphism).
 * Supports English and Tamil (bilingual).
 */

(function () {
    // -------------------------------------------------------------
    // 1. STYLES & DYNAMIC INJECTION
    // -------------------------------------------------------------
    const styles = `
        /* Floating Chat Button */
        #mishkath-chat-trigger {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #F1B434 0%, #D4AF37 100%);
            color: #0a0b0d;
            box-shadow: 0 10px 30px rgba(241, 180, 52, 0.4), inset 0 2px 5px rgba(255,255,255,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 99999;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            border: none;
            outline: none;
        }
        #mishkath-chat-trigger:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 15px 40px rgba(241, 180, 52, 0.6);
        }
        #mishkath-chat-trigger .pulse {
            position: absolute;
            inset: -5px;
            border-radius: 50%;
            border: 2px solid #F1B434;
            opacity: 0.5;
            animation: trigger-pulse 2s infinite;
            pointer-events: none;
        }
        @keyframes trigger-pulse {
            0% { transform: scale(1); opacity: 0.5; }
            100% { transform: scale(1.3); opacity: 0; }
        }

        /* Chat Container */
        #mishkath-chat-container {
            position: fixed;
            bottom: 105px;
            right: 30px;
            width: 420px;
            height: 650px;
            max-height: calc(100vh - 140px);
            max-width: calc(100vw - 60px);
            background: rgba(21, 24, 28, 0.95);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            z-index: 99998;
            opacity: 0;
            transform: translateY(30px) scale(0.95);
            pointer-events: none;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        #mishkath-chat-container.active {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: all;
        }

        /* Header */
        .mishkath-chat-header {
            padding: 20px 24px;
            background: rgba(42, 47, 53, 0.3);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .mishkath-chat-meta {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .mishkath-chat-logo {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background: #2A2F35;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .mishkath-chat-title {
            font-family: 'Montserrat', sans-serif;
            font-weight: 700;
            font-size: 1rem;
            color: #ffffff;
            margin: 0;
            line-height: 1.2;
        }
        .mishkath-chat-subtitle {
            font-family: 'Inter', sans-serif;
            font-size: 0.75rem;
            color: #F1B434;
            margin: 0;
        }
        .mishkath-chat-controls {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .lang-switch-btn {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: #94a3b8;
            padding: 4px 10px;
            border-radius: 30px;
            font-size: 0.75rem;
            font-family: 'Montserrat', sans-serif;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .lang-switch-btn:hover, .lang-switch-btn.active {
            background: #F1B434;
            color: #0a0b0d;
            border-color: #F1B434;
        }
        .chat-close-btn {
            background: transparent;
            border: none;
            color: #94a3b8;
            font-size: 1.2rem;
            cursor: pointer;
            transition: color 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .chat-close-btn:hover {
            color: #ffffff;
        }

        /* Message Log */
        .mishkath-chat-body {
            flex-grow: 1;
            padding: 24px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 16px;
            scrollbar-width: thin;
            scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .mishkath-chat-body::-webkit-scrollbar {
            width: 6px;
        }
        .mishkath-chat-body::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.1);
            border-radius: 3px;
        }

        /* Bubbles */
        .chat-msg {
            display: flex;
            flex-direction: column;
            max-width: 85%;
            animation: message-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes message-in {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .chat-msg.bot {
            align-self: flex-start;
        }
        .chat-msg.user {
            align-self: flex-end;
        }
        .msg-bubble {
            padding: 12px 18px;
            border-radius: 18px;
            font-family: 'Inter', sans-serif;
            font-size: 0.925rem;
            line-height: 1.5;
        }
        .chat-msg.bot .msg-bubble {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            color: #e2e8f0;
            border-top-left-radius: 4px;
        }
        .chat-msg.user .msg-bubble {
            background: rgba(241, 180, 52, 0.15);
            border: 1px solid rgba(241, 180, 52, 0.3);
            color: #ffffff;
            border-top-right-radius: 4px;
        }
        .msg-time {
            font-size: 0.65rem;
            color: #64748b;
            margin-top: 5px;
            align-self: flex-end;
        }
        .chat-msg.bot .msg-time {
            align-self: flex-start;
        }

        /* Buttons and Option Chips */
        .option-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 8px;
        }
        .option-btn {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            color: #e2e8f0;
            padding: 8px 16px;
            border-radius: 30px;
            font-size: 0.85rem;
            font-family: 'Inter', sans-serif;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .option-btn:hover {
            border-color: #F1B434;
            color: #F1B434;
            background: rgba(241, 180, 52, 0.05);
            transform: translateY(-2px);
        }

        /* Share Chart and Results Styling */
        .result-card {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 16px;
            padding: 18px;
            margin-top: 10px;
            width: 100%;
        }
        .result-title {
            color: #F1B434;
            font-family: 'Montserrat', sans-serif;
            font-weight: 700;
            font-size: 0.95rem;
            margin-bottom: 12px;
            border-bottom: 1px dashed rgba(255,255,255,0.1);
            padding-bottom: 8px;
        }
        .share-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.85rem;
            color: #cbd5e1;
            margin-bottom: 15px;
        }
        .share-table th, .share-table td {
            padding: 8px 10px;
            text-align: left;
            border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .share-table th {
            color: #94a3b8;
            font-weight: 600;
        }
        .share-bar-container {
            height: 12px;
            background: rgba(255,255,255,0.05);
            border-radius: 6px;
            display: flex;
            overflow: hidden;
            margin: 15px 0;
            border: 1px solid rgba(255,255,255,0.05);
        }
        .share-bar-segment {
            height: 100%;
            transition: width 0.6s ease;
        }
        .share-details-list {
            list-style: none;
            padding: 0;
            margin: 10px 0 0 0;
            font-size: 0.8rem;
            color: #94a3b8;
            line-height: 1.5;
        }
        .share-details-list li {
            margin-bottom: 8px;
            padding-left: 12px;
            position: relative;
        }
        .share-details-list li::before {
            content: '•';
            color: #F1B434;
            position: absolute;
            left: 0;
            top: 0;
        }

        /* Footer Input Area */
        .mishkath-chat-footer {
            padding: 16px 24px 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            background: rgba(10, 11, 13, 0.9);
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .chat-input-row {
            display: flex;
            gap: 12px;
            align-items: center;
        }
        .chat-input-field {
            flex-grow: 1;
            padding: 12px 18px;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 30px;
            color: #ffffff;
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            outline: none;
            transition: all 0.3s ease;
        }
        .chat-input-field:focus {
            border-color: #F1B434;
            box-shadow: 0 0 15px rgba(241, 180, 52, 0.1);
        }
        .chat-send-btn {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: #F1B434;
            color: #0a0b0d;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            flex-shrink: 0;
        }
        .chat-send-btn:hover {
            transform: scale(1.05);
            background: #ffffff;
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
        }
        .chat-send-btn svg {
            width: 18px;
            height: 18px;
        }

        /* Chips Carousel */
        .chat-chips-carousel {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding-bottom: 5px;
            scrollbar-width: none;
        }
        .chat-chips-carousel::-webkit-scrollbar {
            display: none;
        }
        .chip-item {
            flex-shrink: 0;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            color: #94a3b8;
            padding: 5px 12px;
            border-radius: 12px;
            font-size: 0.75rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .chip-item:hover {
            color: #F1B434;
            border-color: rgba(241, 180, 52, 0.3);
            background: rgba(241, 180, 52, 0.03);
        }
    `;

    // -------------------------------------------------------------
    // 2. TEXT DICTIONARIES & BILINGUAL CONTENT
    // -------------------------------------------------------------
    const locales = {
        en: {
            title: "Mishkath AI Assistant",
            subtitle: "Fara'id (Inheritance) Expert",
            placeholder: "Ask a question (e.g. Wife share?)...",
            welcome: "Assalamu Alaikum! Welcome to the **Mishkath Research Institute Inheritance Assistant**. I can help you with questions about Islamic Inheritance Law (Ilm al-Fara'id) or guide you through a step-by-step calculation.",
            optCalculate: "Calculate Shares 🧮",
            optQuestion: "Ask a Question 💬",
            optRestart: "Start Over 🔄",
            calculatingWelcome: "Let's calculate the legal shares of the heirs step-by-step. First, what was the **gender of the deceased**?",
            deceasedMale: "Male (Husband) 👨",
            deceasedFemale: "Female (Wife) 👩",
            askSpouseMale: "Is there a surviving **Wife**? If yes, select how many (up to 4):",
            askSpouseFemale: "Is there a surviving **Husband**?",
            askSons: "How many **Sons** are there?",
            askDaughters: "How many **Daughters** are there?",
            askFather: "Is the deceased's **Father** alive?",
            askMother: "Is the deceased's **Mother** alive?",
            askSiblings: "Since there are no children or surviving father, siblings may inherit. Are there surviving brothers or sisters?",
            askBrothers: "How many surviving **Full Brothers**?",
            askSisters: "How many surviving **Full Sisters**?",
            askEstate: "What is the **total value of the estate**? (Optional, enter a number or press Skip to see fractions only)",
            yes: "Yes",
            no: "No",
            skip: "Skip ➔",
            calculating: "Calculating shares...",
            resultsTitle: "Islamic Inheritance Share Division",
            heir: "Heir",
            shareFraction: "Fractional Share",
            percentage: "Percentage",
            amount: "Amount",
            aulApplied: "⚠️ **Note on Aul (Increase)**: The total fixed shares exceeded 1 (sum = {sum}). Shares have been scaled down proportionally as per classical jurisprudence.",
            raddApplied: "ℹ️ **Note on Radd (Return)**: The total fixed shares were less than 1 (sum = {sum}) and there were no residuaries. The remainder has been returned to the eligible fixed heirs in proportion to their shares.",
            umariyyatApplied: "⚖️ **Note on Umariyyat Case**: The Mother's share has been adjusted to 1/3 of the remainder after spouse division, since only spouse and both parents exist.",
            totalText: "Total",
            errNumber: "Please enter a valid positive number or 0.",
            noHeirs: "No surviving primary heirs were entered. The residue goes to the treasury (Bayt al-Mal) or general relatives (Arham).",
            faq: [
                {
                    keys: ["what is faraid", "faraid definition", "inheritance law", "வாரிசுரிமைச் சட்டம் என்றால் என்ன", "பாராயிழ்"],
                    ans: "The **Islamic Law of Inheritance (Fara'id)** is a set of precise rules based primarily on the Quran (Surah An-Nisa, Verses 11, 12, and 176) and Prophetic traditions. It designates fixed heirs (Zawil Furud) who have guaranteed shares in a deceased person's estate, and residuaries (Asabah) who inherit the remainder. It ensures a highly structured and equitable distribution of wealth."
                },
                {
                    keys: ["wife share", "share of wife", "மனைவியின் பங்கு", "மனைவிக்கு எவ்வளவு"],
                    ans: "A **Wife** (or wives collectively) receives:\n- **1/8** (12.5%) of the estate if the deceased husband has children or grandchildren.\n- **1/4** (25%) of the estate if the deceased husband has no children or grandchildren.\nIf there are multiple wives (up to 4), they share the 1/4 or 1/8 equally. This is explicitly based on Quran 4:12."
                },
                {
                    keys: ["husband share", "share of husband", "கணவனின் பங்கு", "கணவனுக்கு எவ்வளவு"],
                    ans: "A **Husband** receives:\n- **1/4** (25%) of the estate if the deceased wife has children or grandchildren.\n- **1/2** (50%) of the estate if the deceased wife has no children or grandchildren.\nThis is explicitly based on Quran 4:12."
                },
                {
                    keys: ["daughter share", "share of daughter", "மகளின் பங்கு", "மகளுக்கு எவ்வளவு"],
                    ans: "A **Daughter** receives:\n- **1/2** (50%) of the estate if she is an only child and there are no sons.\n- **2/3** (66.67% shared equally) if there are 2 or more daughters and no sons.\n- If there are sons, daughters do not get fixed shares; instead, they become residuaries (Asabah) with the sons, where each **son receives twice the share of a daughter (2:1 ratio)**. Based on Quran 4:11."
                },
                {
                    keys: ["mother share", "share of mother", "தாயின் பங்கு", "தாய்க்கு எவ்வளவு"],
                    ans: "A **Mother** receives:\n- **1/6** (16.67%) if the deceased has children, grandchildren, or 2 or more siblings of any kind.\n- **1/3** (33.33%) if the deceased has no children, grandchildren, and at most 1 sibling.\n- In the special *Umariyyat* cases (only spouse and both parents survive), she gets **1/3 of the remainder** after the spouse's share is deducted. Based on Quran 4:11."
                },
                {
                    keys: ["father share", "share of father", "தந்தையின் பங்கு", "தந்தைக்கு எவ்வளவு"],
                    ans: "A **Father** receives:\n- **1/6** (16.67%) fixed share if there is a surviving son or grandson.\n- **1/6 plus Asabah (residue)** if there are only daughters or granddaughters.\n- If there are no children or grandchildren at all, the Father inherits purely as a **Residuary (Asabah)**, taking whatever remains after fixed shares are paid."
                },
                {
                    keys: ["aul", "increase", "அவ்ல்", "கூடுதல்"],
                    ans: "In Fara'id, **Aul (Increase)** occurs when the sum of the fixed fractional shares of all heirs exceeds 1 (e.g. Husband [1/2] + 2 Sisters [2/3] = 7/6). To resolve this, the denominator of the shares is increased to match the sum, which proportionally reduces the share of each heir fairly. This practice was established during the caliphate of Umar ibn al-Khattab (RA)."
                },
                {
                    keys: ["radd", "return", "ரத்", "மீதி"],
                    ans: "In Fara'id, **Radd (Return)** is the reverse of Aul. It occurs when the sum of the fixed fractional shares is less than 1, and there are no residuaries (Asabah) to take the remainder. The remaining portion is returned to the fixed heirs in proportion to their shares. In classical Sunni jurisprudence, **the spouse (husband/wife) does not receive Radd**; it is divided exclusively among other fixed heirs."
                }
            ],
            notFound: "I could not find a specific match for your question. You can ask about shares (e.g., 'Wife share', 'Mother share') or type '/calculate' to calculate shares interactively!"
        },
        ta: {
            title: "மிஷ்காத் AI உதவியாளர்",
            subtitle: "வாரிசுரிமைச் சட்டம் (பாராயிழ்) நிபுணர்",
            placeholder: "கேள்வி கேளுங்கள் (உதாரணமாக: மனைவியின் பங்கு?)...",
            welcome: "அஸ்ஸலாமு அலைக்கும்! **மிஷ்காத் ஆய்வு நிறுவன வாரிசுரிமைச் சட்டம் (Fara'id) உதவியாளருக்கு** உங்களை அன்போடு வரவேற்கிறோம். வாரிசுரிமைச் சட்டத்தின் அடிப்படைகளை விளக்க அல்லது கணக்கீடு செய்ய நான் தயாராக உள்ளேன்.",
            optCalculate: "பங்கு கணக்கீடு 🧮",
            optQuestion: "கேள்வி கேட்க 💬",
            optRestart: "மீண்டும் ஆரம்பிக்க 🔄",
            calculatingWelcome: "வாரிசுரிமைப் பங்குகளை படிப்படியாகக் கணக்கிடுவோம். முதலாவதாக, **மரணமடைந்தவரின் பாலினம்** என்ன?",
            deceasedMale: "ஆண் (கணவர்) 👨",
            deceasedFemale: "பெண் (மனைவி) 👩",
            askSpouseMale: "உயிருடன் இருக்கும் **மனைவி** இருக்கிறாரா? ஆம் எனில், எத்தனை பேர் என்பதைத் தேர்ந்தெடுக்கவும் (4 வரை):",
            askSpouseFemale: "உயிருடன் இருக்கும் **கணவர்** இருக்கிறாரா?",
            askSons: "மரணமடைந்தவருக்கு எத்தனை **மகன்கள்** உள்ளனர்?",
            askDaughters: "மரணமடைந்தவருக்கு எத்தனை **மகள்கள்** உள்ளனர்?",
            askFather: "மரணமடைந்தவரின் **தந்தை** உயிருடன் இருக்கிறாரா?",
            askMother: "மரணமடைந்தவரின் **தாய்** உயிருடன் இருக்கிறாரா?",
            askSiblings: "குழந்தைகளோ அல்லது உயிருடன் இருக்கும் தந்தையோ இல்லாததால், உடன்பிறப்புகள் பங்கைப் பெறலாம். உடன்பிறப்புகள் யாராவது இருக்கிறார்களா?",
            askBrothers: "உயிருடன் இருக்கும் **சொந்த சகோதரர்கள்** எத்தனை பேர்?",
            askSisters: "உயிருடன் இருக்கும் **சொந்த சகோதரிகள்** எத்தனை பேர்?",
            askEstate: "பகிர்ந்தளிக்கப்பட வேண்டிய **சொத்தின் மொத்த மதிப்பு** எவ்வளவு? (விருப்பத்திற்குரியது, தொகையை உள்ளிடவும் அல்லது சொத்தின் பின்னங்களை மட்டும் காண Skip செய்யவும்)",
            yes: "ஆம்",
            no: "இல்லை",
            skip: "Skip ➔",
            calculating: "பங்குகள் கணக்கிடப்படுகின்றன...",
            resultsTitle: "இஸ்லாமிய வாரிசுரிமைப் பங்கீடு",
            heir: "வாரிசுதாரர்",
            shareFraction: "பாகத்தின் பின்னம்",
            percentage: "சதவீதம்",
            amount: "மதிப்பு/தொகை",
            aulApplied: "⚠️ **அவ்ல் (Aul - கூடுதல்) குறிப்பு**: வாரிசுகளின் மொத்தப் பங்கின் கூட்டுத்தொகை 1 ஐ விட அதிகமாகியுள்ளது (கூட்டு = {sum}). எனவே, பாரம்பரிய இஸ்லாமிய சட்ட முறைப்படி அனைத்து பங்குகளும் விகிதாசாரப்படி குறைக்கப்பட்டுள்ளன.",
            raddApplied: "ℹ️ **ரத் (Radd - மீளளிப்பு) குறிப்பு**: வாரிசுகளின் மொத்தப் பங்கின் கூட்டுத்தொகை 1 ஐ விட குறைவாக உள்ளது (கூட்டு = {sum}) மற்றும் மீதியைப் பெற வேறு வாரிசுகள் இல்லை. எனவே, கணவன்/மனைவி தவிர்ந்த ஏனைய வாரிசுகளுக்கு விகிதாசாரப்படி மீதிப் பங்கு வழங்கப்பட்டுள்ளது.",
            umariyyatApplied: "⚖️ **உமரிய்யா (Umariyyat) குறிப்பு**: மரணமடைந்தவருக்கு கணவர்/மனைவி மற்றும் பெற்றோர் மாத்திரம் இருக்கும் நிலையில், தாயின் பங்கு கணவன்/மனைவியின் பங்கு வழங்கப்பட்ட பின் மீதமுள்ள தொகையில் 1/3 ஆக மாற்றியமைக்கப்பட்டுள்ளது.",
            totalText: "மொத்தம்",
            errNumber: "தயவுசெய்து சரியான நேர்மறை எண்ணை அல்லது 0 ஐ உள்ளிடவும்.",
            noHeirs: "உயிருடன் இருக்கும் முதன்மை வாரிசுகள் யாரும் குறிப்பிடப்படவில்லை. இந்த சொத்து பொதுச் சொத்தாக (பைதுல் மால்) அல்லது உறவினர்களுக்குச் சென்றடையும்.",
            faq: [
                {
                    keys: ["what is faraid", "faraid definition", "inheritance law", "வாரிசுரிமைச் சட்டம் என்றால் என்ன", "பாராயிழ்", "வாரிசுரிமை"],
                    ans: "இஸ்லாமிய **வாரிசுரிமைச் சட்டம் (Fara'id)** என்பது புனித குர்ஆன் (சூரா அன்னிஸா, வசனங்கள் 11, 12, 176) மற்றும் நபிவழிகளின் அடிப்படையில் அமைந்த துல்லியமான சட்டமாகும். இதில் சில உறவினர்களுக்குக் கட்டாயப் பங்குகளும் (அஸ்ஹாபுல் புரூழ்), மீதமுள்ள சொத்துக்களைப் பெறும் உறவினர்களும் (அஸபா) திட்டவட்டமாக வகுக்கப்பட்டுள்ளனர். இது சொத்துப் பங்கீட்டை மிக நேர்மையாகவும் சமூக ஒழுங்கோடும் உறுதி செய்கிறது."
                },
                {
                    keys: ["wife share", "share of wife", "மனைவியின் பங்கு", "மனைவிக்கு எவ்வளவு", "மனைவி"],
                    ans: "மரணமடைந்தவரின் **மனைவி** (அல்லது மனைவிகள் கூட்டாக) பெறும் பங்குகள்:\n- கணவருக்கு பிள்ளைகள் அல்லது பேரப்பிள்ளைகள் இருந்தால் சொத்தில் **1/8** (12.5%) பங்கு.\n- கணவருக்கு பிள்ளைகள் அல்லது பேரப்பிள்ளைகள் இல்லாவிடின் சொத்தில் **1/4** (25%) பங்கு.\nஒன்றுக்கும் மேற்பட்ட மனைவிகள் இருந்தால், அவர்கள் இந்த 1/4 அல்லது 1/8 பங்கை சமமாகப் பகிர்ந்து கொள்வர். (ஆதாரம்: குர்ஆன் 4:12)."
                },
                {
                    keys: ["husband share", "share of husband", "கணவனின் பங்கு", "கணவனுக்கு எவ்வளவு", "கணவர்"],
                    ans: "மரணமடைந்தவரின் **கணவர்** பெறும் பங்குகள்:\n- மனைவிக்கு பிள்ளைகள் அல்லது பேரப்பிள்ளைகள் இருந்தால் சொத்தில் **1/4** (25%) பங்கு.\n- மனைவிக்கு பிள்ளைகள் அல்லது பேரப்பிள்ளைகள் இல்லாவிடின் சொத்தில் **1/2** (50%) பங்கு. (ஆதாரம்: குர்ஆன் 4:12)."
                },
                {
                    keys: ["daughter share", "share of daughter", "மகளின் பங்கு", "மகளுக்கு எவ்வளவு", "மகள்"],
                    ans: "மரணமடைந்தவரின் **மகள்** பெறும் பங்குகள்:\n- ஆண் பிள்ளைகள் இல்லாத நிலையில், ஒரேயொரு மகள் மாத்திரம் இருந்தால் சொத்தில் **1/2** (50%) பங்கு.\n- ஆண் பிள்ளைகள் இல்லாத நிலையில், இரண்டு அல்லது அதற்கு மேற்பட்ட மகள்கள் இருந்தால் அவர்கள் கூட்டாக சொத்தில் **2/3** (66.67%) பங்கைச் சமமாகப் பகிர்வர்.\n- ஆண் பிள்ளைகள் இருந்தால், மகள்கள் கட்டாயப் பங்கை பெறமாட்டார்கள். மாறாக, அவர்களோடு இணைந்து சொத்தின் மீதியை பங்குபெறுவர் (அஸபா). இதன்போது **ஒரு ஆணுக்கு இரண்டு பெண்களின் பங்கு (2:1 விகிதம்)** என்ற அடிப்படையில் பகிர்வு நிகழும். (ஆதாரம்: குர்ஆன் 4:11)."
                },
                {
                    keys: ["mother share", "share of mother", "தாயின் பங்கு", "தாய்க்கு எவ்வளவு", "தாய்"],
                    ans: "மரணமடைந்தவரின் **தாய்** பெறும் பங்குகள்:\n- மரணமடைந்தவருக்கு பிள்ளைகள், பேரப்பிள்ளைகள் அல்லது இரண்டு அல்லது அதற்கு மேற்பட்ட சகோதர/சகோதரிகள் இருந்தால் சொத்தில் **1/6** (16.67%) பங்கு.\n- பிள்ளைகள், பேரப்பிள்ளைகள் அல்லது சகோதரர்கள் இல்லையெனில் சொத்தில் **1/3** (33.33%) பங்கு.\n- கணவன்/மனைவி மற்றும் பெற்றோர் மாத்திரம் இருக்கும் *உமரிய்யா* வழக்குகளில், கணவன்/மனைவியின் பங்கு போக **மீதமுள்ள தொகையில் 1/3** பங்கு. (ஆதாரம்: குர்ஆன் 4:11)."
                },
                {
                    keys: ["father share", "share of father", "தந்தையின் பங்கு", "தந்தைக்கு எவ்வளவு", "தந்தை"],
                    ans: "மரணமடைந்தவரின் **தந்தை** பெறும் பங்குகள்:\n- உயிருடன் ஆண் பிள்ளைகள் (மகன்/பேரன்) இருந்தால், தந்தைக்கு கட்டாயப் பங்கான **1/6** (16.67%) கிடைக்கும்.\n- பெண் பிள்ளைகள் மாத்திரம் இருந்தால், கட்டாயப் பங்கான **1/6 உடன் மீதமுள்ள சொத்தின் பகுதியும் (அஸபா)** கிடைக்கும்.\n- பிள்ளைகள் அல்லது பேரப்பிள்ளைகள் யாரும் இல்லாதபோது, தந்தை முழுமையாக எஞ்சிய சொத்தைப் பெறும் **உரிமையாளராக (Asabah)** மாறுவார்."
                },
                {
                    keys: ["aul", "increase", "அவ்ல்", "கூடுதல்", "பங்கு கூடல்"],
                    ans: "பாராயிழ் சட்டத்தில் **அவ்ல் (Aul)** என்பது வாரிசுகளின் மொத்தக் கட்டாயப் பங்கின் கூட்டுத்தொகை 1 ஐ விட அதிகரிக்கும் போது நிகழும் திருத்தமாகும். (உதாரணமாக: கணவர் [1/2] + 2 சகோதரிகள் [2/3] = 7/6). இதைச் சரிசெய்ய, பங்குகளின் பகுதி எண் (Denominator) கூட்டுத்தொகைக்கு ஏற்ப அதிகரிக்கப்பட்டு, அனைத்து வாரிசுகளின் பங்குகளும் சமமாக, விகிதாசாரப்படி குறைக்கப்படும். இது உமர் (ரலி) அவர்களின் காலத்தில் நடைமுறைக்கு வந்தது."
                },
                {
                    keys: ["radd", "return", "ரத்", "மீதி", "மீளளிப்பு"],
                    ans: "பாராயிழ் சட்டத்தில் **ரத் (Radd)** என்பது அவ்ல்-இன் தலைகீழ் மாற்றமாகும். சொத்துப் பங்கீட்டின் பின் கூட்டுத்தொகை 1 ஐ விடக் குறைவாக இருந்து, மீதியை எடுக்க அஸபா (மீதிப் பங்கு பெறுவோர்) இல்லாதபோது இது நிகழும். எஞ்சிய சொத்து மீண்டும் கட்டாயப் பங்கு வாரிசுகளுக்கே விகிதாசாரப்படி வழங்கப்படும். இதன்போது **கணவன் அல்லது மனைவிக்கு இந்த மீளளிப்புப் பங்கு (Radd) வழங்கப்பட மாட்டாது**. ஏனைய வாரிசுகளுக்கே வழங்கப்படும்."
                }
            ],
            notFound: "மன்னிக்கவும், உங்கள் கேள்விக்குரிய பதிலை என்னால் கண்டறிய முடியவில்லை. தயவுசெய்து 'மனைவியின் பங்கு', 'தாயின் பங்கு' என சுருக்கமாகக் கேளுங்கள் அல்லது பங்கு கணக்கீடு செய்ய '/calculate' என்று டைப் செய்யுங்கள்!"
        }
    };

    // -------------------------------------------------------------
    // 3. UI GENERATION AND INJECTION
    // -------------------------------------------------------------
    const activeLang = 'en';

    // Inject CSS
    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);

    // Create Widget DOM Elements
    const triggerBtn = document.createElement('button');
    triggerBtn.id = 'mishkath-chat-trigger';
    triggerBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 16 16" style="transform: translateY(1px);">
            <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9 9 0 0 0 8 15"/>
        </svg>
        <div class="pulse"></div>
    `;
    document.body.appendChild(triggerBtn);

    const chatContainer = document.createElement('div');
    chatContainer.id = 'mishkath-chat-container';
    chatContainer.innerHTML = `
        <div class="mishkath-chat-header">
            <div class="mishkath-chat-meta">
                <div class="mishkath-chat-logo">
                    <img src="media__1777652469688.png" alt="Logo" style="height: 22px; filter: drop-shadow(0 0 2px rgba(255,255,255,0.3));" onerror="this.style.display='none'">
                </div>
                <div>
                    <h3 class="mishkath-chat-title" id="mishkath-widget-title">Mishkath AI Assistant</h3>
                    <p class="mishkath-chat-subtitle" id="mishkath-widget-subtitle">Fara'id (Inheritance) Expert</p>
                </div>
            </div>
            <div class="mishkath-chat-controls">
                <button class="lang-switch-btn" id="mishkath-lang-toggle">தமிழ்</button>
                <button class="chat-close-btn" id="mishkath-chat-close" aria-label="Close Chat">✕</button>
            </div>
        </div>
        <div class="mishkath-chat-body" id="mishkath-chat-messages"></div>
        <div class="mishkath-chat-footer">
            <div class="chat-chips-carousel" id="mishkath-chat-chips"></div>
            <div class="chat-input-row">
                <input type="text" class="chat-input-field" id="mishkath-chat-input" placeholder="Ask a question...">
                <button class="chat-send-btn" id="mishkath-chat-send" aria-label="Send Message">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(chatContainer);

    // Grab elements
    const chatBody = document.getElementById('mishkath-chat-messages');
    const chatInput = document.getElementById('mishkath-chat-input');
    const sendBtn = document.getElementById('mishkath-chat-send');
    const langBtn = document.getElementById('mishkath-lang-toggle');
    const closeBtn = document.getElementById('mishkath-chat-close');
    const chipsContainer = document.getElementById('mishkath-chat-chips');

    // -------------------------------------------------------------
    // 4. CHATSTATE & CONTROL MACHINE
    // -------------------------------------------------------------
    let state = {
        lang: 'en', // 'en' or 'ta'
        mode: 'free', // 'free' or 'calc'
        calcStep: 0,
        calcData: {
            deceasedGender: '', // 'male' or 'female'
            spouseAlive: '', // 'yes' or 'no'
            wivesCount: 1,
            sonsCount: 0,
            daughtersCount: 0,
            fatherAlive: '', // 'yes' or 'no'
            motherAlive: '', // 'yes' or 'no'
            siblingsActive: false,
            brothersCount: 0,
            sistersCount: 0,
            estateValue: 0
        }
    };

    // Toggle Chat visibility
    triggerBtn.addEventListener('click', () => {
        chatContainer.classList.toggle('active');
        if (chatContainer.classList.contains('active')) {
            chatInput.focus();
            if (chatBody.children.length === 0) {
                renderWelcomeMessage();
            }
        }
    });

    closeBtn.addEventListener('click', () => {
        chatContainer.classList.remove('active');
    });

    // Language Toggle
    langBtn.addEventListener('click', () => {
        if (state.lang === 'en') {
            state.lang = 'ta';
            langBtn.textContent = 'English';
        } else {
            state.lang = 'en';
            langBtn.textContent = 'தமிழ்';
        }
        updateWidgetUIStrings();
        // Reset and show welcoming in the new language if in free text
        if (state.mode === 'free') {
            chatBody.innerHTML = '';
            renderWelcomeMessage();
        } else {
            addBotMessage(state.lang === 'en' ? "Language changed. Let's continue the calculation in English." : "மொழி மாற்றப்பட்டது. வாரிசுரிமைக் கணக்கீட்டைத் தமிழில் தொடருவோம்.");
            renderCurrentCalcStep();
        }
    });

    // Handle Navbar integration
    document.addEventListener('DOMContentLoaded', () => {
        const navLink = document.getElementById('nav-inheritance-assistant');
        if (navLink) {
            navLink.addEventListener('click', (e) => {
                e.preventDefault();
                chatContainer.classList.add('active');
                chatInput.focus();
                if (chatBody.children.length === 0) {
                    renderWelcomeMessage();
                }
            });
        }
    });

    function updateWidgetUIStrings() {
        const t = locales[state.lang];
        document.getElementById('mishkath-widget-title').textContent = t.title;
        document.getElementById('mishkath-widget-subtitle').textContent = t.subtitle;
        chatInput.placeholder = t.placeholder;
        renderChips();
    }

    // Render Suggested Chips
    function renderChips() {
        chipsContainer.innerHTML = '';
        const t = locales[state.lang];
        const suggestions = state.lang === 'en' ? 
            ["Calculate Shares", "Wife Share?", "Mother Share?", "What is Aul?", "Primary Heirs?"] :
            ["பங்கு கணக்கீடு", "மனைவியின் பங்கு?", "தாயின் பங்கு?", "அவ்ல் என்றால் என்ன?", "முக்கிய வாரிசுகள் யார்?"];

        suggestions.forEach(s => {
            const chip = document.createElement('div');
            chip.className = 'chip-item';
            chip.textContent = s;
            chip.addEventListener('click', () => {
                if (s.includes("Calculate") || s.includes("பங்கு கணக்கீடு")) {
                    startCalculationWizard();
                } else {
                    handleUserText(s);
                }
            });
            chipsContainer.appendChild(chip);
        });
    }

    // Render Welcome
    function renderWelcomeMessage() {
        updateWidgetUIStrings();
        const t = locales[state.lang];
        addBotMessage(t.welcome);
        renderOptions([
            { text: t.optCalculate, action: () => startCalculationWizard() },
            { text: t.optQuestion, action: () => addBotMessage(state.lang === 'en' ? "Please type your question below! You can ask about wives, daughters, parents, Aul, Radd etc." : "கீழே உங்கள் கேள்வியை டைப் செய்யுங்கள்! மனைவி, மகள், பெற்றோர் ஆகியோரின் பங்குகள் அல்லது அவ்ல், ரத் குறித்துக் கேட்கலாம்.") }
        ]);
    }

    // Helper to add chat bubbles
    function addBotMessage(html) {
        const msg = document.createElement('div');
        msg.className = 'chat-msg bot';
        
        // Format bold markdown (**text** to <strong>text</strong>)
        let formatted = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Handle newlines
        formatted = formatted.replace(/\n/g, '<br>');

        msg.innerHTML = `
            <div class="msg-bubble">${formatted}</div>
            <div class="msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        `;
        chatBody.appendChild(msg);
        scrollToBottom();
    }

    function addUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'chat-msg user';
        msg.innerHTML = `
            <div class="msg-bubble">${text}</div>
            <div class="msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        `;
        chatBody.appendChild(msg);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Render Quick Action Button Options
    function renderOptions(options) {
        const container = document.createElement('div');
        container.className = 'option-container';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt.text;
            btn.addEventListener('click', () => {
                // Clear the active option buttons from this container to prevent double clicks
                container.innerHTML = '';
                opt.action();
            });
            container.appendChild(btn);
        });
        chatBody.appendChild(container);
        scrollToBottom();
    }

    // -------------------------------------------------------------
    // 5. CALCULATOR FLOW ENGINE (THE WIZARD)
    // -------------------------------------------------------------
    function startCalculationWizard() {
        state.mode = 'calc';
        state.calcStep = 0;
        state.calcData = {
            deceasedGender: '',
            spouseAlive: '',
            wivesCount: 1,
            sonsCount: 0,
            daughtersCount: 0,
            fatherAlive: '',
            motherAlive: '',
            siblingsActive: false,
            brothersCount: 0,
            sistersCount: 0,
            estateValue: 0
        };
        addBotMessage(locales[state.lang].calculatingWelcome);
        renderCurrentCalcStep();
    }

    function renderCurrentCalcStep() {
        const t = locales[state.lang];
        switch (state.calcStep) {
            case 0: // Deceased Gender
                renderOptions([
                    { text: t.deceasedMale, action: () => selectDeceasedGender('male') },
                    { text: t.deceasedFemale, action: () => selectDeceasedGender('female') }
                ]);
                break;
            case 1: // Spouse Details
                if (state.calcData.deceasedGender === 'male') {
                    addBotMessage(t.askSpouseMale);
                    renderOptions([
                        { text: t.no, action: () => selectSpouse('no', 0) },
                        { text: "1 Wife", action: () => selectSpouse('yes', 1) },
                        { text: "2 Wives", action: () => selectSpouse('yes', 2) },
                        { text: "3 Wives", action: () => selectSpouse('yes', 3) },
                        { text: "4 Wives", action: () => selectSpouse('yes', 4) }
                    ]);
                } else {
                    addBotMessage(t.askSpouseFemale);
                    renderOptions([
                        { text: t.yes, action: () => selectSpouse('yes', 1) },
                        { text: t.no, action: () => selectSpouse('no', 0) }
                    ]);
                }
                break;
            case 2: // Sons
                addBotMessage(t.askSons);
                renderOptions([
                    { text: "0", action: () => selectSons(0) },
                    { text: "1", action: () => selectSons(1) },
                    { text: "2", action: () => selectSons(2) },
                    { text: "3", action: () => selectSons(3) },
                    { text: "4+", action: () => selectSons(4) }
                ]);
                break;
            case 3: // Daughters
                addBotMessage(t.askDaughters);
                renderOptions([
                    { text: "0", action: () => selectDaughters(0) },
                    { text: "1", action: () => selectDaughters(1) },
                    { text: "2", action: () => selectDaughters(2) },
                    { text: "3", action: () => selectDaughters(3) },
                    { text: "4+", action: () => selectDaughters(4) }
                ]);
                break;
            case 4: // Father
                addBotMessage(t.askFather);
                renderOptions([
                    { text: t.yes, action: () => selectFather('yes') },
                    { text: t.no, action: () => selectFather('no') }
                ]);
                break;
            case 5: // Mother
                addBotMessage(t.askMother);
                renderOptions([
                    { text: t.yes, action: () => selectMother('yes') },
                    { text: t.no, action: () => selectMother('no') }
                ]);
                break;
            case 6: // Siblings (Conditional)
                // Ask ONLY if there are no children (sons=0, daughters=0) AND father is dead
                if (state.calcData.sonsCount === 0 && state.calcData.daughtersCount === 0 && state.calcData.fatherAlive === 'no') {
                    addBotMessage(t.askSiblings);
                    renderOptions([
                        { text: t.yes, action: () => { state.calcData.siblingsActive = true; selectSiblingsFlow(true); } },
                        { text: t.no, action: () => { state.calcData.siblingsActive = false; selectSiblingsFlow(false); } }
                    ]);
                } else {
                    // Skip siblings step
                    state.calcStep = 8; 
                    renderCurrentCalcStep();
                }
                break;
            case 7: // Brothers / Sisters count if siblingsActive
                addBotMessage(t.askBrothers);
                renderOptions([
                    { text: "0", action: () => { state.calcData.brothersCount = 0; askSistersWizard(); } },
                    { text: "1", action: () => { state.calcData.brothersCount = 1; askSistersWizard(); } },
                    { text: "2", action: () => { state.calcData.brothersCount = 2; askSistersWizard(); } },
                    { text: "3+", action: () => { state.calcData.brothersCount = 3; askSistersWizard(); } }
                ]);
                break;
            case 8: // Estate Value
                addBotMessage(t.askEstate);
                renderOptions([
                    { text: t.skip, action: () => runCalculations(0) }
                ]);
                break;
        }
    }

    function selectDeceasedGender(gender) {
        addUserMessage(gender === 'male' ? locales[state.lang].deceasedMale : locales[state.lang].deceasedFemale);
        state.calcData.deceasedGender = gender;
        state.calcStep = 1;
        renderCurrentCalcStep();
    }

    function selectSpouse(alive, count) {
        addUserMessage(alive === 'yes' ? (state.lang === 'en' ? `${count} spouse(s)` : `${count} துணைவர்(கள்)`) : locales[state.lang].no);
        state.calcData.spouseAlive = alive;
        state.calcData.wivesCount = count;
        state.calcStep = 2;
        renderCurrentCalcStep();
    }

    function selectSons(count) {
        addUserMessage(count.toString());
        state.calcData.sonsCount = count;
        state.calcStep = 3;
        renderCurrentCalcStep();
    }

    function selectDaughters(count) {
        addUserMessage(count.toString());
        state.calcData.daughtersCount = count;
        state.calcStep = 4;
        renderCurrentCalcStep();
    }

    function selectFather(alive) {
        addUserMessage(alive === 'yes' ? locales[state.lang].yes : locales[state.lang].no);
        state.calcData.fatherAlive = alive;
        state.calcStep = 5;
        renderCurrentCalcStep();
    }

    function selectMother(alive) {
        addUserMessage(alive === 'yes' ? locales[state.lang].yes : locales[state.lang].no);
        state.calcData.motherAlive = alive;
        state.calcStep = 6;
        renderCurrentCalcStep();
    }

    function selectSiblingsFlow(active) {
        addUserMessage(active ? locales[state.lang].yes : locales[state.lang].no);
        if (active) {
            state.calcStep = 7;
            renderCurrentCalcStep();
        } else {
            state.calcStep = 8;
            renderCurrentCalcStep();
        }
    }

    function askSistersWizard() {
        addUserMessage(`${state.calcData.brothersCount} brothers`);
        addBotMessage(locales[state.lang].askSisters);
        renderOptions([
            { text: "0", action: () => { state.calcData.sistersCount = 0; finishSiblingsFlow(); } },
            { text: "1", action: () => { state.calcData.sistersCount = 1; finishSiblingsFlow(); } },
            { text: "2", action: () => { state.calcData.sistersCount = 2; finishSiblingsFlow(); } },
            { text: "3+", action: () => { state.calcData.sistersCount = 3; finishSiblingsFlow(); } }
        ]);
    }

    function finishSiblingsFlow() {
        addUserMessage(`${state.calcData.sistersCount} sisters`);
        state.calcStep = 8;
        renderCurrentCalcStep();
    }

    // -------------------------------------------------------------
    // 6. FARA'ID MATHEMATICS CALCULATION ENGINE
    // -------------------------------------------------------------
    function runCalculations(estateVal = 0) {
        addBotMessage(locales[state.lang].calculating);
        
        const data = state.calcData;
        let heirs = []; // { nameEn, nameTa, type: 'fard'|'asabah', baseFraction, finalFraction, explanationEn, explanationTa, color }
        
        const hasChildren = (data.sonsCount > 0 || data.daughtersCount > 0);
        
        // Color palette for the visual gradient segmented bar
        const palette = ['#F1B434', '#E29B12', '#FCD382', '#A67C1E', '#9E2A2B', '#3F5E5A', '#2E8B57', '#4682B4'];
        let colorIdx = 0;
        
        // --------------------------------------------------
        // A. Primary Zawil Furud (Fixed Shares) Calculations
        // --------------------------------------------------
        
        // 1. Spouse Share
        let spouseShare = 0;
        if (data.spouseAlive === 'yes') {
            if (data.deceasedGender === 'male') {
                // Wife/Wives share
                spouseShare = hasChildren ? 0.125 : 0.25; // 1/8 or 1/4
                const fractionText = hasChildren ? "1/8" : "1/4";
                const sharePerWife = spouseShare / data.wivesCount;
                const sharePerWifeText = data.wivesCount > 1 ? `${fractionText} shared by ${data.wivesCount} wives (${(sharePerWife * 100).toFixed(2)}% each)` : fractionText;
                
                heirs.push({
                    nameEn: data.wivesCount > 1 ? `Wives (${data.wivesCount})` : "Wife",
                    nameTa: data.wivesCount > 1 ? `மனைவிகள் (${data.wivesCount})` : "மனைவி",
                    type: 'fard',
                    baseFraction: spouseShare,
                    finalFraction: spouseShare,
                    fractionText: sharePerWifeText,
                    explanationEn: `Wife receives ${fractionText} because deceased has descendants (children). [Quran 4:12]`,
                    explanationTa: `மரணமடைந்தவருக்கு பிள்ளைகள் இருப்பதால் மனைவிக்கு 1/8 கட்டாயப் பங்காகும். [அல்குர்ஆன் 4:12]`,
                    color: palette[colorIdx++ % palette.length]
                });
            } else {
                // Husband share
                spouseShare = hasChildren ? 0.25 : 0.5; // 1/4 or 1/2
                const fractionText = hasChildren ? "1/4" : "1/2";
                heirs.push({
                    nameEn: "Husband",
                    nameTa: "கணவர்",
                    type: 'fard',
                    baseFraction: spouseShare,
                    finalFraction: spouseShare,
                    fractionText: fractionText,
                    explanationEn: `Husband receives ${fractionText} because deceased has descendants (children). [Quran 4:12]`,
                    explanationTa: `மரணமடைந்தவருக்கு பிள்ளைகள் இருப்பதால் கணவருக்கு 1/4 கட்டாயப் பங்காகும். [அல்குர்ஆன் 4:12]`,
                    color: palette[colorIdx++ % palette.length]
                });
            }
        }
        
        // 2. Mother Share
        let motherShare = 0;
        let isUmariyyat = false;
        
        if (data.motherAlive === 'yes') {
            // Check Umariyyat Case: Surviving heirs are strictly ONLY (Spouse + Mother + Father)
            const onlySpouseAndParents = (data.spouseAlive === 'yes' && data.fatherAlive === 'yes' && data.sonsCount === 0 && data.daughtersCount === 0 && !data.siblingsActive);
            
            if (onlySpouseAndParents) {
                isUmariyyat = true;
                motherShare = (1 - spouseShare) / 3; // 1/3 of the remainder
                heirs.push({
                    nameEn: "Mother",
                    nameTa: "தாய்",
                    type: 'fard',
                    baseFraction: motherShare,
                    finalFraction: motherShare,
                    fractionText: `1/3 of Remainder (${data.deceasedGender === 'male' ? '1/4' : '1/6'} of Total)`,
                    explanationEn: `Mother receives 1/3 of the remainder after Spouse share (Umariyyat rule established by Caliph Umar). [Quran 4:11]`,
                    explanationTa: `கணவன்/மனைவி மற்றும் பெற்றோர் மாத்திரம் இருக்கும் உமரிய்யா வழக்கின்படி, தாய்க்கு கணவன்/மனைவியின் பங்கு போக எஞ்சியதில் 1/3 கட்டாயப் பங்காகும். [அல்குர்ஆன் 4:11]`,
                    color: palette[colorIdx++ % palette.length]
                });
            } else {
                motherShare = hasChildren ? (1/6) : (1/3); // 1/6 or 1/3
                const fractionText = hasChildren ? "1/6" : "1/3";
                heirs.push({
                    nameEn: "Mother",
                    nameTa: "தாய்",
                    type: 'fard',
                    baseFraction: motherShare,
                    finalFraction: motherShare,
                    fractionText: fractionText,
                    explanationEn: `Mother receives ${fractionText} because deceased ${hasChildren ? 'has descendants' : 'has no descendants'}. [Quran 4:11]`,
                    explanationTa: `மரணமடைந்தவருக்கு ${hasChildren ? 'பிள்ளைகள் இருப்பதால் தாய்க்கு 1/6' : 'பிள்ளைகள் இல்லாததால் தாய்க்கு 1/3'} கட்டாயப் பங்காகும். [அல்குர்ஆன் 4:11]`,
                    color: palette[colorIdx++ % palette.length]
                });
            }
        }
        
        // 3. Father Share (Fixed part - only if there are descendants)
        let fatherFixedShare = 0;
        let fatherIsPureResiduary = false;
        
        if (data.fatherAlive === 'yes') {
            if (data.sonsCount > 0) {
                // If there's a son, Father gets ONLY fixed 1/6
                fatherFixedShare = 1/6;
                heirs.push({
                    nameEn: "Father",
                    nameTa: "தந்தை",
                    type: 'fard',
                    baseFraction: 1/6,
                    finalFraction: 1/6,
                    fractionText: "1/6",
                    explanationEn: "Father receives 1/6 fixed because deceased has a surviving son. [Quran 4:11]",
                    explanationTa: "மரணமடைந்தவருக்கு மகன் இருப்பதால் தந்தைக்கு கட்டாயப் பங்கான 1/6 மாத்திரம் கிடைக்கும். [அல்குர்ஆன் 4:11]",
                    color: palette[colorIdx++ % palette.length]
                });
            } else if (data.daughtersCount > 0) {
                // If daughters only, Father gets fixed 1/6 PLUS residuary (Asabah)
                fatherFixedShare = 1/6;
                heirs.push({
                    nameEn: "Father (Fixed + Residuary)",
                    nameTa: "தந்தை (கட்டாயம் + மீதி)",
                    type: 'fard_asabah',
                    baseFraction: 1/6,
                    finalFraction: 1/6,
                    fractionText: "1/6 + Residue",
                    explanationEn: "Father receives 1/6 fixed plus any remaining residue because deceased has only daughters. [Quran 4:11]",
                    explanationTa: "மரணமடைந்தவருக்கு பெண் பிள்ளைகள் மாத்திரம் இருப்பதால் தந்தைக்கு 1/6 கட்டாயப் பங்குடன் மீதமுள்ள பகுதியும் கிடைக்கும். [அல்குர்ஆன் 4:11]",
                    color: palette[colorIdx++ % palette.length]
                });
            } else {
                // Father is purely residuary (Asabah)
                fatherIsPureResiduary = true;
            }
        }
        
        // 4. Daughters Share (Fixed - only if NO sons exist)
        let daughtersFixedShare = 0;
        if (data.daughtersCount > 0 && data.sonsCount === 0) {
            daughtersFixedShare = data.daughtersCount === 1 ? 0.5 : (2/3); // 1/2 or 2/3
            const fractionText = data.daughtersCount === 1 ? "1/2" : "2/3";
            heirs.push({
                nameEn: data.daughtersCount > 1 ? `Daughters (${data.daughtersCount})` : "Daughter",
                nameTa: data.daughtersCount > 1 ? `மகள்கள் (${data.daughtersCount})` : "மகள்",
                type: 'fard',
                baseFraction: daughtersFixedShare,
                finalFraction: daughtersFixedShare,
                fractionText: fractionText,
                explanationEn: `Daughter(s) receive ${fractionText} because there are no surviving sons. [Quran 4:11]`,
                explanationTa: `ஆண் பிள்ளைகள் இல்லாத நிலையில், ${data.daughtersCount === 1 ? 'ஒரு மகளுக்கு 1/2' : `${data.daughtersCount} மகள்களுக்கு கூட்டாக 2/3`} கட்டாயப் பங்காகும். [அல்குர்ஆன் 4:11]`,
                color: palette[colorIdx++ % palette.length]
            });
        }
        
        // 5. Sisters Share (Fixed - only if no children, no father, no brothers exist)
        let sistersFixedShare = 0;
        if (data.siblingsActive && data.sistersCount > 0 && data.brothersCount === 0 && data.sonsCount === 0 && data.daughtersCount === 0 && data.fatherAlive === 'no') {
            sistersFixedShare = data.sistersCount === 1 ? 0.5 : (2/3); // 1/2 or 2/3
            const fractionText = data.sistersCount === 1 ? "1/2" : "2/3";
            heirs.push({
                nameEn: data.sistersCount > 1 ? `Sisters (${data.sistersCount})` : "Sister",
                nameTa: data.sistersCount > 1 ? `சகோதரிகள் (${data.sistersCount})` : "சகோதரி",
                type: 'fard',
                baseFraction: sistersFixedShare,
                finalFraction: sistersFixedShare,
                fractionText: fractionText,
                explanationEn: `Sister(s) receive ${fractionText} because there are no surviving descendants, father, or brothers. [Quran 4:176]`,
                explanationTa: `பெற்றோர், பிள்ளைகள் மற்றும் ஆண் உடன்பிறப்புகள் இல்லாத நிலையில், ${data.sistersCount === 1 ? 'ஒரு சகோதரிக்கு 1/2' : `${data.sistersCount} சகோதரிகளுக்கு 2/3`} கட்டாயப் பங்காகும். [அல்குர்ஆன் 4:176]`,
                color: palette[colorIdx++ % palette.length]
            });
        }
        
        // --------------------------------------------------
        // B. Evaluating Adjustments (Aul or Radd) & Residuaries
        // --------------------------------------------------
        
        // Calculate sum of active fixed shares
        let sumFixed = heirs.reduce((sum, h) => sum + h.baseFraction, 0);
        
        let hasResiduary = (data.sonsCount > 0) || 
                            (data.fatherAlive === 'yes' && data.sonsCount === 0) || 
                            (data.siblingsActive && data.brothersCount > 0);
        
        let aulApplied = false;
        let raddApplied = false;
        
        if (sumFixed > 1) {
            // Aul Case: Proportional Reduction
            aulApplied = true;
            heirs.forEach(h => {
                h.finalFraction = h.baseFraction / sumFixed;
            });
            sumFixed = 1;
        } else if (sumFixed < 1 && !hasResiduary) {
            // Radd Case: Return to Eligible Fixed Heirs (except Spouse)
            raddApplied = true;
            
            // Spouse does NOT receive Radd
            const spouseRecord = heirs.find(h => h.nameEn === "Husband" || h.nameEn === "Wife" || h.nameEn.startsWith("Wives"));
            const spouseAmt = spouseRecord ? spouseRecord.baseFraction : 0;
            const remainingToDistribute = 1 - spouseAmt;
            const sumOthersFixed = sumFixed - spouseAmt;
            
            if (sumOthersFixed > 0) {
                heirs.forEach(h => {
                    if (h !== spouseRecord) {
                        h.finalFraction = h.baseFraction * remainingToDistribute / sumOthersFixed;
                    }
                });
            }
            sumFixed = 1;
        }
        
        // If there's remainder and there are residuaries, allocate Asabah
        let remainder = 1 - sumFixed;
        
        if (remainder > 0.00001 && hasResiduary) {
            if (data.sonsCount > 0) {
                // Sons & Daughters inherit remainder as Asabah in 2:1 ratio
                // Since daughters were NOT counted in fixed shares if sons exist, they are purely in Asabah
                const totalPortions = (data.sonsCount * 2) + data.daughtersCount;
                const portionValue = remainder / totalPortions;
                
                if (data.sonsCount > 0) {
                    const totalSonsShare = portionValue * 2 * data.sonsCount;
                    const perSonShare = portionValue * 2;
                    heirs.push({
                        nameEn: data.sonsCount > 1 ? `Sons (${data.sonsCount})` : "Son",
                        nameTa: data.sonsCount > 1 ? `மகன்கள் (${data.sonsCount})` : "மகன்",
                        type: 'asabah',
                        baseFraction: totalSonsShare,
                        finalFraction: totalSonsShare,
                        fractionText: data.sonsCount > 1 ? `Residue (${(perSonShare*100).toFixed(2)}% each)` : "Residue",
                        explanationEn: `Son(s) receive remaining residue after fixed shares, at a 2:1 ratio to daughters. [Quran 4:11]`,
                        explanationTa: `பிள்ளைகள் இருக்கும்போது மகன்கள் கட்டாயப் பங்கின் பின் எஞ்சியதை (Asabah) மகள்களை விட இரண்டு மடங்கு என்ற (2:1) விகிதத்தில் பெறுவர். [அல்குர்ஆன் 4:11]`,
                        color: palette[colorIdx++ % palette.length]
                    });
                }
                
                if (data.daughtersCount > 0) {
                    const totalDaughtersShare = portionValue * data.daughtersCount;
                    const perDaughterShare = portionValue;
                    heirs.push({
                        nameEn: data.daughtersCount > 1 ? `Daughters (${data.daughtersCount}) [Residuary]` : "Daughter [Residuary]",
                        nameTa: data.daughtersCount > 1 ? `மகள்கள் (${data.daughtersCount}) [உரிமைப் பங்கு]` : "மகள் [உரிமைப் பங்கு]",
                        type: 'asabah',
                        baseFraction: totalDaughtersShare,
                        finalFraction: totalDaughtersShare,
                        fractionText: data.daughtersCount > 1 ? `Residue (${(perDaughterShare*100).toFixed(2)}% each)` : "Residue",
                        explanationEn: `Daughter(s) inherit residue alongside sons in a 1:2 ratio. [Quran 4:11]`,
                        explanationTa: `மகன்கள் இருக்கும்போது மகள்கள் கட்டாயப் பங்கிற்குப் பதிலாக, ஆண் பிள்ளைகளோடு இணைந்து எஞ்சியதை 1:2 விகிதத்தில் பெறுவர். [அல்குர்ஆன் 4:11]`,
                        color: palette[colorIdx++ % palette.length]
                    });
                }
            } else if (data.fatherAlive === 'yes') {
                // Father inherits remainder as Asabah (since no sons survive)
                const fatherRecord = heirs.find(h => h.nameEn.startsWith("Father"));
                if (fatherRecord) {
                    fatherRecord.finalFraction += remainder;
                    fatherRecord.fractionText = `1/6 + Residue (${(fatherRecord.finalFraction*100).toFixed(2)}% total)`;
                } else {
                    heirs.push({
                        nameEn: "Father",
                        nameTa: "தந்தை",
                        type: 'asabah',
                        baseFraction: remainder,
                        finalFraction: remainder,
                        fractionText: "Residue",
                        explanationEn: "Father inherits remaining residue as Asabah since there are no surviving children. [Quran 4:11]",
                        explanationTa: "மரணமடைந்தவருக்கு வாரிசுப் பிள்ளைகள் இல்லாததால் தந்தை எஞ்சிய சொத்தை முழுமையாகப் பெறுவார். [அல்குர்ஆன் 4:11]",
                        color: palette[colorIdx++ % palette.length]
                    });
                }
            } else if (data.siblingsActive && data.brothersCount > 0) {
                // Brothers & Sisters divide residue 2:1
                const totalPortions = (data.brothersCount * 2) + data.sistersCount;
                const portionValue = remainder / totalPortions;
                
                const totalBrothersShare = portionValue * 2 * data.brothersCount;
                const perBrotherShare = portionValue * 2;
                heirs.push({
                    nameEn: data.brothersCount > 1 ? `Brothers (${data.brothersCount})` : "Brother",
                    nameTa: data.brothersCount > 1 ? `சகோதரர்கள் (${data.brothersCount})` : "சகோதரன்",
                    type: 'asabah',
                    baseFraction: totalBrothersShare,
                    finalFraction: totalBrothersShare,
                    fractionText: data.brothersCount > 1 ? `Residue (${(perBrotherShare*100).toFixed(2)}% each)` : "Residue",
                    explanationEn: `Brother(s) inherit remainder after fixed shares, at a 2:1 ratio to sisters. [Quran 4:176]`,
                    explanationTa: `உடன்பிறந்த சகோதரர்கள் கட்டாயப் பங்குகளுக்குப் பின் எஞ்சியதை சகோதரிகளை விட இரண்டு மடங்கு (2:1) என்ற விகிதத்தில் பெறுவர். [அல்குர்ஆன் 4:176]`,
                    color: palette[colorIdx++ % palette.length]
                });
                
                if (data.sistersCount > 0) {
                    const totalSistersShare = portionValue * data.sistersCount;
                    const perSisterShare = portionValue;
                    heirs.push({
                        nameEn: data.sistersCount > 1 ? `Sisters (${data.sistersCount}) [Residuary]` : "Sister [Residuary]",
                        nameTa: data.sistersCount > 1 ? `சகோதரிகள் (${data.sistersCount}) [உரிமைப் பங்கு]` : "சகோதரி [உரிமைப் பங்கு]",
                        type: 'asabah',
                        baseFraction: totalSistersShare,
                        finalFraction: totalSistersShare,
                        fractionText: data.sistersCount > 1 ? `Residue (${(perSisterShare*100).toFixed(2)}% each)` : "Residue",
                        explanationEn: `Sister(s) inherit residue alongside brothers in a 1:2 ratio. [Quran 4:176]`,
                        explanationTa: `சகோதரர்கள் இருக்கும்போது சகோதரிகள் கட்டாயப் பங்கிற்குப் பதிலாக, எஞ்சியதை 1:2 என்ற விகிதத்தில் பெறுவர். [அல்குர்ஆன் 4:176]`,
                        color: palette[colorIdx++ % palette.length]
                    });
                }
            }
        }
        
        // --------------------------------------------------
        // C. Formatting and Rendering HTML Results
        // --------------------------------------------------
        const t = locales[state.lang];
        
        if (heirs.length === 0) {
            addBotMessage(t.noHeirs);
            resetToFreeMode();
            return;
        }
        
        // Render Result Table
        let tableRows = '';
        let shareBarHTML = '';
        let explanationList = '';
        let totalValAllocated = 0;
        
        heirs.forEach(h => {
            const pct = (h.finalFraction * 100).toFixed(2);
            let amtCol = '';
            if (estateVal > 0) {
                const allocatedAmt = estateVal * h.finalFraction;
                totalValAllocated += allocatedAmt;
                amtCol = `<td>${allocatedAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>`;
            }
            
            tableRows += `
                <tr>
                    <td><strong>${state.lang === 'en' ? h.nameEn : h.nameTa}</strong></td>
                    <td>${h.fractionText}</td>
                    <td>${pct}%</td>
                    ${estateVal > 0 ? amtCol : ''}
                </tr>
            `;
            
            shareBarHTML += `
                <div class="share-bar-segment" style="width: ${pct}%; background: ${h.color};" title="${state.lang === 'en' ? h.nameEn : h.nameTa}: ${pct}%"></div>
            `;
            
            explanationList += `
                <li><strong>${state.lang === 'en' ? h.nameEn : h.nameTa}</strong>: ${state.lang === 'en' ? h.explanationEn : h.explanationTa}</li>
            `;
        });
        
        // Special adjustment notes
        let specialNotes = '';
        if (aulApplied) {
            specialNotes += `<p style="font-size: 0.8rem; color: #f87171; margin-top: 10px;">${t.aulApplied.replace('{sum}', sumFixed.toFixed(3))}</p>`;
        }
        if (raddApplied) {
            specialNotes += `<p style="font-size: 0.8rem; color: #60a5fa; margin-top: 10px;">${t.raddApplied.replace('{sum}', sumFixed.toFixed(3))}</p>`;
        }
        if (isUmariyyat) {
            specialNotes += `<p style="font-size: 0.8rem; color: #fbbf24; margin-top: 10px;">${t.umariyyatApplied}</p>`;
        }
        
        const resultCardHTML = `
            <div class="result-card">
                <div class="result-title">${t.resultsTitle}</div>
                <table class="share-table">
                    <thead>
                        <tr>
                            <th>${t.heir}</th>
                            <th>${t.shareFraction}</th>
                            <th>${t.percentage}</th>
                            ${estateVal > 0 ? `<th>${t.amount}</th>` : ''}
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                        ${estateVal > 0 ? `
                        <tr style="border-top: 1px solid rgba(255,255,255,0.1); font-weight: bold; color: #F1B434;">
                            <td colspan="3">${t.totalText}</td>
                            <td>${totalValAllocated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>` : ''}
                    </tbody>
                </table>
                
                <div class="share-bar-container">
                    ${shareBarHTML}
                </div>
                
                <ul class="share-details-list">
                    ${explanationList}
                </ul>
                
                ${specialNotes}
            </div>
        `;
        
        addBotMessage(resultCardHTML);
        resetToFreeMode();
    }

    function resetToFreeMode() {
        state.mode = 'free';
        state.calcStep = 0;
        renderChips();
    }

    // -------------------------------------------------------------
    // 7. INPUT HANDLING AND SMART NLP ENGINE
    // -------------------------------------------------------------
    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;
        chatInput.value = '';
        
        if (state.mode === 'calc') {
            // Calculator expects estate value in the final step, else option button clicks are used
            if (state.calcStep === 8) {
                const val = parseFloat(text);
                if (isNaN(val) || val < 0) {
                    addBotMessage(locales[state.lang].errNumber);
                } else {
                    addUserMessage(val.toLocaleString());
                    runCalculations(val);
                }
            } else {
                addUserMessage(text);
                addBotMessage(state.lang === 'en' ? "Please click one of the suggested options below to proceed!" : "கீழே உள்ள பட்டன்களில் ஒன்றைக் கிளிக் செய்து தொடரவும்!");
                renderCurrentCalcStep();
            }
        } else {
            handleUserText(text);
        }
    }

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    function handleUserText(text) {
        addUserMessage(text);
        
        // Check for manual command to calculate
        const lower = text.toLowerCase();
        if (lower === '/calculate' || lower === 'calculate' || lower.includes("கணக்கீடு") || lower.includes("கணக்கிடு")) {
            startCalculationWizard();
            return;
        }
        
        if (lower === 'restart' || lower.includes("start over") || lower.includes("மீண்டும்")) {
            chatBody.innerHTML = '';
            resetToFreeMode();
            renderWelcomeMessage();
            return;
        }

        // Smart local Q&A search
        const db = locales[state.lang].faq;
        let matchedAns = null;
        
        for (let i = 0; i < db.length; i++) {
            const match = db[i].keys.some(k => lower.includes(k.toLowerCase()) || k.toLowerCase().includes(lower));
            if (match) {
                matchedAns = db[i].ans;
                break;
            }
        }
        
        setTimeout(() => {
            if (matchedAns) {
                addBotMessage(matchedAns);
                renderChips();
            } else {
                addBotMessage(locales[state.lang].notFound);
                renderOptions([
                    { text: locales[state.lang].optCalculate, action: () => startCalculationWizard() },
                    { text: locales[state.lang].optRestart, action: () => { chatBody.innerHTML = ''; resetToFreeMode(); renderWelcomeMessage(); } }
                ]);
            }
        }, 400);
    }
})();
