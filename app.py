import os
import streamlit as st
import re
try:
    import docx
except ImportError:
    # Fallback to prevent app crash if python-docx is not installed locally
    docx = None

# -------------------------------------------------------------
# 1. PAGE CONFIGURATION & PREMIUM STYLING
# -------------------------------------------------------------
st.set_page_config(
    page_title="Mishkath Fara'id Inheritance AI",
    page_icon="⚖️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for Gold & Charcoal brand parity
st.markdown("""
<style>
    /* Main App Background and text color */
    .stApp {
        background-color: #0a0b0d;
        color: #e2e8f0;
    }
    
    /* Headers */
    h1, h2, h3 {
        color: #ffffff !important;
        font-family: 'Montserrat', sans-serif !important;
        font-weight: 700 !important;
    }
    .text-accent {
        color: #F1B434 !important;
    }
    
    /* Buttons */
    div.stButton > button {
        background: linear-gradient(135deg, #F1B434 0%, #D4AF37 100%) !important;
        color: #0a0b0d !important;
        font-weight: bold !important;
        border-radius: 30px !important;
        border: none !important;
        padding: 10px 24px !important;
        box-shadow: 0 4px 15px rgba(241, 180, 52, 0.2) !important;
        transition: all 0.3s ease !important;
    }
    div.stButton > button:hover {
        transform: translateY(-2px) scale(1.02) !important;
        box-shadow: 0 6px 20px rgba(241, 180, 52, 0.4) !important;
        color: #0a0b0d !important;
    }
    
    /* Sidebar styling */
    section[data-testid="stSidebar"] {
        background-color: #15181c !important;
        border-right: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    /* Input Fields */
    div[data-baseweb="input"] {
        background-color: rgba(0, 0, 0, 0.3) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 12px !important;
    }
    div[data-baseweb="input"]:focus-within {
        border-color: #F1B434 !important;
    }
    
    /* Metric Card / Result Card styling */
    .result-card {
        background: rgba(42, 47, 53, 0.2);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 18px;
        padding: 24px;
        margin: 15px 0;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }
    .result-title {
        color: #F1B434;
        font-weight: bold;
        font-size: 1.1rem;
        margin-bottom: 15px;
        border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
        padding-bottom: 8px;
    }
    
    /* Horizontal Share Bar */
    .share-bar-container {
        height: 14px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 7px;
        display: flex;
        overflow: hidden;
        margin: 18px 0;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    /* Chat Bubbles */
    .stChatMessage {
        border-radius: 16px !important;
        padding: 12px 18px !important;
        margin-bottom: 12px !important;
    }
    div[data-testid="chatAvatarIcon-user"] {
        background-color: #F1B434 !important;
    }
</style>
""", unsafe_allow_html=True)

# -------------------------------------------------------------
# 2. DYNAMIC DOCX PARSER & SEARCH ENGINE (THE RAG INDEX)
# -------------------------------------------------------------
DOCX_FILE = "Islamic Law of Inheritance.docx"

@st.cache_resource
def load_and_index_document(file_path):
    if not os.path.exists(file_path):
        return None
    
    if docx is None:
        # Return none to trigger static backup if docx library is missing
        return None
    
    try:
        doc = docx.Document(file_path)
        sections = []
        current_section = {"heading": "Publication Details & Committee", "paragraphs": []}
        
        # Read paragraph by paragraph
        for para in doc.paragraphs:
            text = para.text.strip()
            if not text:
                continue
            
            # Simple heuristic for section heading detection
            is_heading = False
            if para.style.name.startswith('Heading') or text.startswith(('Chapter', 'Page', 'Section', 'Case', 'Example')):
                is_heading = True
            elif any(run.bold for run in para.runs) and len(text) < 120 and not text.endswith(('.', '?', '!')):
                is_heading = True
                
            if is_heading:
                if current_section["paragraphs"]:
                    sections.append(current_section)
                current_section = {"heading": text, "paragraphs": []}
            else:
                current_section["paragraphs"].append(text)
                
        if current_section["paragraphs"]:
            sections.append(current_section)
            
        return sections
    except Exception as e:
        st.error(f"Error reading document: {e}")
        return None

# Load document
document_sections = load_and_index_document(DOCX_FILE)

# Static fallback Q&As (Directly from DOCX) if the file fails to read or load
STATIC_FAQ = {}
try:
    import json
    faq_file = os.path.join(os.path.dirname(__file__), "faqs.json")
    if not os.path.exists(faq_file):
        faq_file = "faqs.json"
    if os.path.exists(faq_file):
        with open(faq_file, "r", encoding="utf-8") as f:
            STATIC_FAQ = json.load(f)
except Exception as e:
    st.error(f"Error loading faqs.json: {e}")

# Fallback to basic list if JSON load failed or is empty
if not STATIC_FAQ:
    STATIC_FAQ = {
        "en": [
            {
                "keys": ["epf", "etf", "pension", "welfare", "provident"],
                "heading": "EPF, ETF, and Pension Guidelines (Chapter 6, Point 14)",
                "ans": "Contemporary scholars differ, but the **most appropriate view is that EPF and ETF funds cannot be considered standard inheritance assets/earnings of the deceased**. They are government employee welfare arrangements.\n\n- **Rule**: EPF/ETF must be **used for the maintenance of the deceased's dependents** (wife, children, and parents) rather than divided as normal inheritance.\n- **Pension**: Pension must follow the government's legal regulations since they do not contradict Islamic definitions."
            },
            {
                "keys": ["nominee", "nomination", "bank nominee", "representative"],
                "heading": "EPF, ETF, and Bank Nomination Status (Chapter 6, Point 14 & 16)",
                "ans": "Appointing a nominee to receive bank savings or provident funds after death constitutes the appointment of a **representative or trustee (Wakil)**, not a transfer of legal ownership.\n\n- **Ruling**: **It is strictly haram (forbidden) for a nominee to keep the funds for themselves**.\n- **Duty**: The nominee must receive the funds and distribute bank savings among all appropriate heirs in Fara'id order, and utilize EPF/ETF funds for dependent maintenance."
            }
        ],
        "ta": [
            {
                "keys": ["epf", "etf", "pension", "ஓய்வூதியம்", "நலன்புரி நிதி"],
                "heading": "EPF, ETF மற்றும் ஓய்வூதியம் (அத்தியாயம் 6, கேள்வி 14)",
                "ans": "தற்கால அறிஞர்களிடையே கருத்து வேறுபாடுகள் இருந்தாலும், **EPF மற்றும் ETF நிதியை மரணமடைந்தவரின் சொந்த உழைப்பு அல்லது வாரிசுரிமைச் சொத்தாகக் கருத முடியாது** என்பதே மிகவும் பொருத்தமான முடிவாகும். இது தொழிலாளர் நலனுக்கான சிறப்பு ஏற்பாடாகும்.\n\n- **விளக்கம்**: EPF/ETF நிதி மரணமடைந்தவரின் **மனைவி, பிள்ளைகள் மற்றும் பெற்றோரின் வாழ்வாதாரப் பராமரிப்பிற்காக மட்டுமே முழுமையாகப் பயன்படுத்தப்பட வேண்டும்**, இதனை சாதாரண வாரிசுரிமைச் சொத்து போல் பிரிக்கக் கூடாது.\n- **ஓய்வூதியம் (Pension)**: ஓய்வூதியம் தொடர்பான அரசாங்கத்தின் சட்ட விதிமுறைகள் இஸ்லாமிய வரையறைகளுக்கு முரணாக இல்லாததால், அரசு விதிமுறைகளின்படி செயல்பட வேண்டும்."
            }
        ]
    }


def search_knowledge_base(query, lang):
    query_lower = query.lower()
    
    # 1. If we successfully indexed the Docx document, search it dynamically
    if document_sections:
        best_section = None
        max_matches = 0
        words = [w for w in query_lower.split() if len(w) > 3]
        if not words:
            words = [query_lower]
            
        for section in document_sections:
            matches = 0
            heading_lower = section["heading"].lower()
            
            # Heavy weight for heading match
            for word in words:
                if word in heading_lower:
                    matches += 12
                    
            # Paragraph match
            full_text = "\n".join(section["paragraphs"]).lower()
            for word in words:
                if word in full_text:
                    matches += 1
                    
            if matches > max_matches:
                max_matches = matches
                best_section = section
                
        if max_matches > 3:
            # Renders found section
            heading = best_section["heading"]
            paragraphs = best_section["paragraphs"]
            
            # Format nicely
            ans = f"⚖️ **Source Document Segment: {heading}**\n\n"
            ans += "\n\n".join(paragraphs[:5])
            
            if len(paragraphs) > 5:
                ans += f"\n\n*(Note: This section contains {len(paragraphs) - 5} more paragraphs in the document.)*"
            return ans

    # 2. Fall back to compiled static FAQ database if dynamic search fails or matches weakly
    db = STATIC_FAQ.get(lang, STATIC_FAQ["en"])
    for item in db:
        if any(key in query_lower for key in item["keys"]):
            ans = f"⚖️ **Verified Source Segment: {item['heading']}**\n\n"
            ans += item["ans"]
            return ans
            
    # 3. Not found fallback
    if lang == 'ta':
        return "மிஷ்காத் ஆய்வு நிறுவனத்தின் வெளியீடான **'இஸ்லாமிய வாரிசுரிமைச் சட்டம்: விளக்கமும் இலங்கையில் அதன் நடைமுறையும்'** என்ற நூலின் அடிப்படையில் மட்டுமே கேள்விகளுக்குப் பதிலளிக்க நான் திட்டமிடப்பட்டுள்ளேன். உங்கள் கேள்வி இந்த ஆவணத்தில் இல்லை.\n\n*தேடக்கூடிய சொற்கள்:* \"EPF\", \"Nominee\", \"வஸிய்யா வாஜிபா\", \"சீதனம்\", \"தத்தெடுத்தல்\".\n\nஅல்லது பங்கு கணக்கீடு செய்ய விவரங்களை உள்ளிடவும் (e.g. \"மனைவி, தாய், 2 மகன்கள், சொத்து 500000\")."
    else:
        return "I am programmed to answer questions strictly based on the Mishkath Research Institute's publication **\"Islamic Law of Inheritance: Explanation and its Practice in Sri Lanka\"**. Your question is not covered in this document.\n\n*Suggested terms to search:* \"EPF\", \"Nominee\", \"Wasiyya Wajiba\", \"Hiba\", \"Adoption\", \"Sri Lankan courts\", \"Neglected parents\".\n\nOr enter a case to calculate (e.g. \"Calculate wife, mother, 2 sons, estate 100000\")."

# -------------------------------------------------------------
# 3. NATURAL LANGUAGE FARA'ID STATEMENT PARSER
# -------------------------------------------------------------
def parse_faraid_query(text):
    lower = text.lower()
    
    relative_keywords = ["wife", "wives", "husband", "son", "sons", "daughter", "daughters", "father", "mother", "brother", "brothers", "sister", "sisters", "மனைவி", "கணவர்", "மகன்", "மகள்", "தந்தை", "தாய்", "சகோதர"]
    has_relatives = any(k in lower for k in relative_keywords)
    
    if not has_relatives:
        return None
        
    calc_data = {
        "deceasedGender": "male",
        "spouseAlive": "no",
        "wivesCount": 0,
        "sonsCount": 0,
        "daughtersCount": 0,
        "fatherAlive": "no",
        "motherAlive": "no",
        "siblingsActive": False,
        "brothersCount": 0,
        "sistersCount": 0,
        "estateValue": 0
    }
    
    def extract_count(eng_keys, tam_keys):
        num_map = {
            "zero": 0, "no": 0, "none": 0, "0": 0, "இல்லை": 0, "பூஜ்யம்": 0,
            "one": 1, "a": 1, "an": 1, "1": 1, "ஒரு": 1,
            "two": 2, "2": 2, "இரண்டு": 2, "இரு": 2,
            "three": 3, "3": 3, "மூன்று": 3,
            "four": 4, "4": 4, "நான்கு": 4,
            "five": 5, "5": 5, "ஐந்து": 5
        }
        
        count = 0
        matched = False
        all_keys = eng_keys + tam_keys
        
        for kw in all_keys:
            if kw in lower:
                matched = True
                escaped = re.escape(kw)
                
                before_regex = rf"\b(zero|no|none|\d+|one|two|three|four|five|ஒரு|இரண்டு|இரு|மூன்று|நான்கு|ஐந்து)\s*(?:of\s+)?{escaped}\b"
                after_regex = rf"\b{escaped}\s*(?:[:=]|\s)?\s*(zero|no|none|\d+|one|two|three|four|five|ஒரு|இரண்டு|இரு|மூன்று|நான்கு|ஐந்து)\b"
                
                match_before = re.search(before_regex, lower, re.UNICODE)
                match_after = re.search(after_regex, lower, re.UNICODE)
                
                if match_before:
                    num_str = match_before.group(1)
                    count = num_map.get(num_str, int(num_str) if num_str.isdigit() else 1)
                    break
                elif match_after:
                    num_str = match_after.group(1)
                    count = num_map.get(num_str, int(num_str) if num_str.isdigit() else 1)
                    break
                else:
                    negatives = ["no " + kw, kw + " இல்லை", kw + " count is 0", "without " + kw]
                    count = 0 if any(neg in lower for neg in negatives) else 1
                    
        return matched, count

    wife_match, wife_cnt = extract_count(["wife", "wives"], ["மனைவி", "மனைவிகள்", "மனைவியின்"])
    husband_match, husband_cnt = extract_count(["husband"], ["கணவர்", "கணவன்", "கணவனின்"])
    sons_match, sons_cnt = extract_count(["son", "sons"], ["மகன்", "மகன்கள்", "ஆண் பிள்ளை", "ஆண் பிள்ளைகள்", "மகனின்"])
    daughters_match, daughters_cnt = extract_count(["daughter", "daughters"], ["மகள்", "மகள்கள்", "பெண் பிள்ளை", "பெண் பிள்ளைகள்", "மகளின்"])
    father_match, father_cnt = extract_count(["father"], ["தந்தை", "தகப்பன்", "அப்பா", "தந்தையின்"])
    mother_match, mother_cnt = extract_count(["mother"], ["தாய்", "அம்மா", "தாயின்"])
    brothers_match, brothers_cnt = extract_count(["brother", "brothers"], ["சகோதரன்", "சகோதரர்கள்"])
    sisters_match, sisters_cnt = extract_count(["sister", "sisters"], ["சகோதரி", "சகோதரிகள்"])
    
    # Exclude Q&A queries that mention only one heir
    heirs_count = sum([1 for m in [wife_match or husband_match, sons_match, daughters_match, father_match, mother_match, brothers_match or sisters_match] if m])
    question_words = ["what", "how", "why", "who", "define", "explain", "rule", "verses", "பங்கு என்ன", "விளக்கம்", "யார்", "என்ன"]
    is_question = any(qw in lower for qw in question_words) or "?" in lower
    
    if heirs_count <= 1 and is_question:
        return None
        
    if husband_match and husband_cnt > 0:
        calc_data["spouseAlive"] = "yes"
        calc_data["deceasedGender"] = "female"
        calc_data["wivesCount"] = 0
    elif wife_match and wife_cnt > 0:
        calc_data["spouseAlive"] = "yes"
        calc_data["deceasedGender"] = "male"
        calc_data["wivesCount"] = wife_cnt
        
    if sons_match: calc_data["sonsCount"] = sons_cnt
    if daughters_match: calc_data["daughtersCount"] = daughters_cnt
    if father_match and father_cnt > 0: calc_data["fatherAlive"] = "yes"
    if mother_match and mother_cnt > 0: calc_data["motherAlive"] = "yes"
    
    if brothers_match or sisters_match:
        calc_data["siblingsActive"] = True
        calc_data["brothersCount"] = brothers_cnt
        calc_data["sistersCount"] = sisters_cnt
        
    # Estate Value
    estate_regexes = [
        r"(?:estate|wealth|value|assets|property|சொத்து|ரூபாய்|rs|\$|val)\s*(?:is|of|=)?\s*([$£€]?\d+[\d,.]*)",
        r"(\d+[\d,.]*)\s*(?:rupees|rs|usd|dollars|ரூபாய்|சொத்து மதிப்பு)"
    ]
    
    estate_value = 0
    for regex in estate_regexes:
        match = re.search(regex, lower, re.IGNORECASE)
        if match:
            cleaned = re.sub(r"[^\d.]", "", match.group(1))
            estate_value = float(cleaned) if cleaned else 0
            if estate_value > 0: break
            
    if estate_value == 0:
        numbers = re.findall(r"\b\d+[\d,.]*\b", lower)
        for num_str in numbers:
            cleaned = re.sub(r"[^\d.]", "", num_str)
            num = float(cleaned) if cleaned else 0
            if num >= 100:
                estate_value = num
                break
                
    calc_data["estateValue"] = estate_value
    return calc_data

# -------------------------------------------------------------
# 4. FARA'ID MATHEMATICAL CALCULATION ENGINE
# -------------------------------------------------------------
def calculate_faraid_math(data, estate_val=0, lang='en'):
    heirs = []
    has_children = (data["sonsCount"] > 0 or data["daughtersCount"] > 0)
    palette = ['#F1B434', '#E29B12', '#FCD382', '#A67C1E', '#9E2A2B', '#3F5E5A', '#2E8B57', '#4682B4']
    color_idx = 0
    
    # Exclusions
    if data["sonsCount"] > 0 or data["fatherAlive"] == 'yes':
        data["siblingsActive"] = False
        data["brothersCount"] = 0
        data["sistersCount"] = 0
        
    # 1. Spouse Share
    spouse_share = 0
    if data["spouseAlive"] == 'yes':
        if data["deceasedGender"] == 'male':
            spouse_share = 0.125 if has_children else 0.25
            fraction_text = "1/8" if has_children else "1/4"
            share_per_wife = spouse_share / data["wivesCount"]
            share_per_wife_text = f"{fraction_text} shared by {data['wivesCount']} wives ({(share_per_wife * 100):.2f}% each)" if data["wivesCount"] > 1 else fraction_text
            
            heirs.append({
                "nameEn": f"Wives ({data['wivesCount']})" if data["wivesCount"] > 1 else "Wife",
                "nameTa": f"மனைவிகள் ({data['wivesCount']})" if data["wivesCount"] > 1 else "மனைவி",
                "baseFraction": spouse_share,
                "finalFraction": spouse_share,
                "fractionText": share_per_wife_text if data["wivesCount"] > 1 else fraction_text,
                "explanationEn": f"Wife receives {fraction_text} because deceased has descendants (children). [Quran 4:12]",
                "explanationTa": f"மரணமடைந்தவருக்கு பிள்ளைகள் இருப்பதால் மனைவிக்கு {fraction_text} கட்டாயப் பங்காகும். [அல்குர்ஆன் 4:12]",
                "color": palette[color_idx]
            })
            color_idx += 1
        else:
            spouse_share = 0.25 if has_children else 0.5
            fraction_text = "1/4" if has_children else "1/2"
            heirs.append({
                "nameEn": "Husband",
                "nameTa": "கணவர்",
                "baseFraction": spouse_share,
                "finalFraction": spouse_share,
                "fractionText": fraction_text,
                "explanationEn": f"Husband receives {fraction_text} because deceased has descendants (children). [Quran 4:12]",
                "explanationTa": f"மரணமடைந்தவருக்கு பிள்ளைகள் இருப்பதால் கணவருக்கு {fraction_text} கட்டாயப் பங்காகும். [அல்குர்ஆன் 4:12]",
                "color": palette[color_idx]
            })
            color_idx += 1
            
    # 2. Mother Share
    mother_share = 0
    is_umariyyat = False
    if data["motherAlive"] == 'yes':
        only_spouse_parents = (data["spouseAlive"] == 'yes' and data["fatherAlive"] == 'yes' and data["sonsCount"] == 0 and data["daughtersCount"] == 0 and not data["siblingsActive"])
        
        if only_spouse_parents:
            is_umariyyat = True
            mother_share = (1 - spouse_share) / 3
            heirs.append({
                "nameEn": "Mother",
                "nameTa": "தாய்",
                "baseFraction": mother_share,
                "finalFraction": mother_share,
                "fractionText": f"1/3 of Remainder ({'1/4' if data['deceasedGender'] == 'male' else '1/6'} of Total)",
                "explanationEn": "Mother receives 1/3 of the remainder after Spouse share (Umariyyat rule established by Umar RA). [Quran 4:11]",
                "explanationTa": "மரணமடைந்தவருக்கு பெற்றோர் மற்றும் துணைவர் மாத்திரம் இருக்கும் உமரிய்யா வழக்கின்படி, தாய்க்கு துணைவரின் பங்கு போக எஞ்சியதில் 1/3 கட்டாயப் பங்காகும். [அல்குர்ஆன் 4:11]",
                "color": palette[color_idx]
            })
            color_idx += 1
        else:
            mother_share = 1/6 if has_children else 1/3
            fraction_text = "1/6" if has_children else "1/3"
            heirs.append({
                "nameEn": "Mother",
                "nameTa": "தாய்",
                "baseFraction": mother_share,
                "finalFraction": mother_share,
                "fractionText": fraction_text,
                "explanationEn": f"Mother receives {fraction_text} because deceased {'has' if has_children else 'has no'} descendants. [Quran 4:11]",
                "explanationTa": f"மரணமடைந்தவருக்கு பிள்ளைகள் {'இருப்பதால் தாய்க்கு 1/6' if has_children else 'இல்லாததால் தாய்க்கு 1/3'} கட்டாயப் பங்காகும். [அல்குர்ஆன் 4:11]",
                "color": palette[color_idx]
            })
            color_idx += 1
            
    # 3. Father Share (Fixed part - only if there are descendants)
    father_fixed_share = 0
    father_is_pure_residuary = False
    if data["fatherAlive"] == 'yes':
        if data["sonsCount"] > 0:
            father_fixed_share = 1/6
            heirs.append({
                "nameEn": "Father",
                "nameTa": "தந்தை",
                "baseFraction": 1/6,
                "finalFraction": 1/6,
                "fractionText": "1/6",
                "explanationEn": "Father receives 1/6 fixed because deceased has a surviving son. [Quran 4:11]",
                "explanationTa": "மரணமடைந்தவருக்கு மகன் இருப்பதால் தந்தைக்கு கட்டாயப் பங்கான 1/6 மாத்திரம் கிடைக்கும். [அல்குர்ஆன் 4:11]",
                "color": palette[color_idx]
            })
            color_idx += 1
        elif data["daughtersCount"] > 0:
            father_fixed_share = 1/6
            heirs.append({
                "nameEn": "Father (Fixed + Residuary)",
                "nameTa": "தந்தை (கட்டாயம் + மீதி)",
                "baseFraction": 1/6,
                "finalFraction": 1/6,
                "fractionText": "1/6 + Residue",
                "explanationEn": "Father receives 1/6 fixed plus any remaining residue because deceased has only daughters. [Quran 4:11]",
                "explanationTa": "மரணமடைந்தவருக்கு பெண் பிள்ளைகள் மாத்திரம் இருப்பதால் தந்தைக்கு 1/6 கட்டாயப் பங்குடன் மீதமுள்ள பகுதியும் கிடைக்கும். [அல்குர்ஆன் 4:11]",
                "color": palette[color_idx]
            })
            color_idx += 1
        else:
            father_is_pure_residuary = True
            
    # 4. Daughters Share (Fixed - only if NO sons exist)
    daughters_fixed_share = 0
    if data["daughtersCount"] > 0 and data["sonsCount"] == 0:
        daughters_fixed_share = 0.5 if data["daughtersCount"] == 1 else (2/3)
        fraction_text = "1/2" if data["daughtersCount"] == 1 else "2/3"
        heirs.append({
            "nameEn": "Daughters" if data["daughtersCount"] > 1 else "Daughter",
            "nameTa": "மகள்கள்" if data["daughtersCount"] > 1 else "மகள்",
            "baseFraction": daughters_fixed_share,
            "finalFraction": daughters_fixed_share,
            "fractionText": fraction_text,
            "explanationEn": f"Daughter(s) receive {fraction_text} because there are no surviving sons. [Quran 4:11]",
            "explanationTa": f"ஆண் பிள்ளைகள் இல்லாத நிலையில், {'ஒரு மகளுக்கு 1/2' if data['daughtersCount'] == 1 else 'மகள்களுக்கு கூட்டாக 2/3'} கட்டாயப் பங்காகும். [அல்குர்ஆன் 4:11]",
            "color": palette[color_idx]
        })
        color_idx += 1
        
    # 5. Sisters Share (Fixed - only if no children, no father, no brothers exist)
    sisters_fixed_share = 0
    if data["siblingsActive"] and data["sistersCount"] > 0 and data["brothersCount"] == 0 and data["sonsCount"] == 0 and data["daughtersCount"] == 0 and data["fatherAlive"] == 'no':
        sisters_fixed_share = 0.5 if data["sistersCount"] == 1 else (2/3)
        fraction_text = "1/2" if data["sistersCount"] == 1 else "2/3"
        heirs.append({
            "nameEn": "Sisters" if data["sistersCount"] > 1 else "Sister",
            "nameTa": "சகோதரிகள்" if data["sistersCount"] > 1 else "சகோதரி",
            "baseFraction": sisters_fixed_share,
            "finalFraction": sisters_fixed_share,
            "fractionText": fraction_text,
            "explanationEn": f"Sister(s) receive {fraction_text} because there are no surviving descendants, father, or brothers. [Quran 4:176]",
            "explanationTa": f"பெற்றோர், பிள்ளைகள் மற்றும் ஆண் உடன்பிறப்புகள் இல்லாத நிலையில், {'ஒரு சகோதரிக்கு 1/2' if data['sistersCount'] == 1 else 'சகோதரிகளுக்கு 2/3'} கட்டாயப் பங்காகும். [அல்குர்ஆன் 4:176]",
            "color": palette[color_idx]
        })
        color_idx += 1

    # Math adjustments
    sum_fixed = sum(h["baseFraction"] for h in heirs)
    has_residuary = (data["sonsCount"] > 0) or (data["fatherAlive"] == 'yes' and data["sonsCount"] == 0) or (data["siblingsActive"] and data["brothersCount"] > 0)
    
    aul_applied = False
    radd_applied = False
    
    if sum_fixed > 1:
        aul_applied = True
        for h in heirs:
            h["finalFraction"] = h["baseFraction"] / sum_fixed
        sum_fixed = 1
    elif sum_fixed < 1 and not has_residuary:
        radd_applied = True
        spouse_record = next((h for h in heirs if h["nameEn"] in ["Husband", "Wife"] or h["nameEn"].startswith("Wives")), None)
        spouse_amt = spouse_record["baseFraction"] if spouse_record else 0
        remaining_to_distrib = 1 - spouse_amt
        sum_others_fixed = sum_fixed - spouse_amt
        
        if sum_others_fixed > 0:
            for h in heirs:
                if h != spouse_record:
                    h["finalFraction"] = h["baseFraction"] * remaining_to_distrib / sum_others_fixed
        sum_fixed = 1
        
    remainder = 1 - sum_fixed
    
    if remainder > 0.00001 and has_residuary:
        if data["sonsCount"] > 0:
            total_portions = (data["sonsCount"] * 2) + data["daughtersCount"]
            portion_val = remainder / total_portions
            
            if data["sonsCount"] > 0:
                total_sons_share = portion_val * 2 * data["sonsCount"]
                per_son_share = portion_val * 2
                heirs.append({
                    "nameEn": f"Sons ({data['sonsCount']})" if data["sonsCount"] > 1 else "Son",
                    "nameTa": f"மகன்கள் ({data['sonsCount']})" if data["sonsCount"] > 1 else "மகன்",
                    "baseFraction": total_sons_share,
                    "finalFraction": total_sons_share,
                    "fractionText": f"Residue ({(per_son_share*100):.2f}% each)" if data["sonsCount"] > 1 else "Residue",
                    "explanationEn": "Son(s) receive remaining residue after fixed shares, at a 2:1 ratio to daughters. [Quran 4:11]",
                    "explanationTa": "பிள்ளைகள் இருக்கும்போது மகன்கள் கட்டாயப் பங்கின் பின் எஞ்சியதை (Asabah) மகள்களை விட இரண்டு மடங்கு என்ற (2:1) விகிதத்தில் பெறுவர். [அல்குர்ஆன் 4:11]",
                    "color": palette[color_idx % len(palette)]
                })
                color_idx += 1
            if data["daughtersCount"] > 0:
                total_daughters_share = portion_val * data["daughtersCount"]
                per_daughter_share = portion_val
                heirs.append({
                    "nameEn": f"Daughters ({data['daughtersCount']}) [Residuary]" if data["daughtersCount"] > 1 else "Daughter [Residuary]",
                    "nameTa": f"மகள்கள் ({data['daughtersCount']}) [உரிமைப் பங்கு]" if data["daughtersCount"] > 1 else "மகள் [உரிமைப் பங்கு]",
                    "baseFraction": total_daughters_share,
                    "finalFraction": total_daughters_share,
                    "fractionText": f"Residue ({(per_daughter_share*100):.2f}% each)" if data["daughtersCount"] > 1 else "Residue",
                    "explanationEn": "Daughter(s) inherit residue alongside sons in a 1:2 ratio. [Quran 4:11]",
                    "explanationTa": "மகன்கள் இருக்கும்போது மகள்கள் கட்டாயப் பங்கிற்குப் பதிலாக, ஆண் பிள்ளைகளோடு இணைந்து எஞ்சியதை 1:2 விகிதத்தில் பெறுவர். [அல்குர்ஆன் 4:11]",
                    "color": palette[color_idx % len(palette)]
                })
                color_idx += 1
        elif data["fatherAlive"] == 'yes':
            father_record = next((h for h in heirs if h["nameEn"].startswith("Father")), None)
            if father_record:
                father_record["finalFraction"] += remainder
                father_record["fractionText"] = f"1/6 + Residue ({(father_record['finalFraction']*100):.2f}% total)"
            else:
                heirs.append({
                    "nameEn": "Father",
                    "nameTa": "தந்தை",
                    "baseFraction": remainder,
                    "finalFraction": remainder,
                    "fractionText": "Residue",
                    "explanationEn": "Father inherits remaining residue as Asabah since there are no surviving children. [Quran 4:11]",
                    "explanationTa": "மரணமடைந்தவருக்கு வாரிசுப் பிள்ளைகள் இல்லாததால் தந்தை எஞ்சிய சொத்தை முழுமையாகப் பெறுவார். [அல்குர்ஆன் 4:11]",
                    "color": palette[color_idx % len(palette)]
                })
                color_idx += 1
        elif data["siblingsActive"] and data["brothersCount"] > 0:
            total_portions = (data["brothersCount"] * 2) + data["sistersCount"]
            portion_val = remainder / total_portions
            
            total_brothers_share = portion_val * 2 * data["brothersCount"]
            per_brother_share = portion_val * 2
            heirs.append({
                "nameEn": f"Brothers ({data['brothersCount']})" if data["brothersCount"] > 1 else "Brother",
                "nameTa": f"சகோதரர்கள் ({data['brothersCount']})" if data["brothersCount"] > 1 else "சகோதரன்",
                "baseFraction": total_brothers_share,
                "finalFraction": total_brothers_share,
                "fractionText": f"Residue ({(per_brother_share*100):.2f}% each)" if data["brothersCount"] > 1 else "Residue",
                "explanationEn": "Brother(s) inherit remainder after fixed shares, at a 2:1 ratio to sisters. [Quran 4:176]",
                "explanationTa": "உடன்பிறந்த சகோதரர்கள் கட்டாயப் பங்குகளுக்குப் பின் எஞ்சியதை சகோதரிகளை விட இரண்டு மடங்கு (2:1) என்ற விகிதத்தில் பெறுவர். [அல்குர்ஆன் 4:176]",
                "color": palette[color_idx % len(palette)]
            })
            color_idx += 1
            if data["sistersCount"] > 0:
                total_sisters_share = portion_val * data["sistersCount"]
                per_sister_share = portion_val
                heirs.append({
                    "nameEn": f"Sisters ({data['sistersCount']}) [Residuary]" if data["sistersCount"] > 1 else "Sister [Residuary]",
                    "nameTa": f"சகோதரிகள் ({data['sistersCount']}) [உரிமைப் பங்கு]" if data["sistersCount"] > 1 else "சகோதரி [உரிமைப் பங்கு]",
                    "baseFraction": total_sisters_share,
                    "finalFraction": total_sisters_share,
                    "fractionText": f"Residue ({(per_sister_share*100):.2f}% each)" if data["sistersCount"] > 1 else "Residue",
                    "explanationEn": "Sister(s) inherit residue alongside brothers in a 1:2 ratio. [Quran 4:176]",
                    "explanationTa": "சகோதரர்கள் இருக்கும்போது சகோதரிகள் கட்டாயப் பங்கிற்குப் பதிலாக, எஞ்சியதை 1:2 என்ற விகிதத்தில் பெறுவர். [அல்குர்ஆன் 4:176]",
                    "color": palette[color_idx % len(palette)]
                })
                color_idx += 1

    return heirs, aul_applied, radd_applied, is_umariyyat, sum_fixed

# -------------------------------------------------------------
# 5. STREAMLIT APPLICATION VIEW & MAIN INTERACTION
# -------------------------------------------------------------

# Title banner
st.markdown("<h1 style='text-align: center;'>Mishkath <span class='text-accent'>Fara'id Inheritance AI</span></h1>", unsafe_allow_html=True)
st.markdown("<p style='text-align: center; font-size: 1.1rem; color: #94a3b8;'>Strictly verified Q&A and Calculations on the Sri Lankan Islamic Law of Inheritance</p>", unsafe_allow_html=True)
st.markdown("---")

# Session States
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []
if "language" not in st.session_state:
    st.session_state.language = "en"
if "wizard_active" not in st.session_state:
    st.session_state.wizard_active = False

# Sidebar Controls
with st.sidebar:
    st.image("media__1777652469688.png", use_container_width=True)
    st.markdown("### Assistant Controls")
    
    # Language switch
    lang_label = "Switch to தமிழ்" if st.session_state.language == "en" else "Switch to English"
    if st.button(lang_label, use_container_width=True):
        st.session_state.language = "ta" if st.session_state.language == "en" else "en"
        st.rerun()
        
    st.markdown("---")
    st.markdown("### Document Status")
    if document_sections:
        st.success(f"Loaded: **{DOCX_FILE}**\n\n*(Parsed {len(document_sections)} chapters/sections)*")
    else:
        st.warning("Running in static FAQ database fallback mode.")
        
    st.markdown("---")
    
    # Toggle Guided Wizard
    if st.button("Launch Guided Wizard 🧮", use_container_width=True):
        st.session_state.wizard_active = not st.session_state.wizard_active
        st.rerun()

# -------------------------------------------------------------
# A. STEP-BY-STEP CALCULATION WIZARD (IF ACTIVE)
# -------------------------------------------------------------
if st.session_state.wizard_active:
    st.markdown("### 🧮 Interactive Fara'id Calculation Wizard")
    st.info("Fill out the details below to compute the shares immediately.")
    
    col1, col2 = st.columns(2)
    with col1:
        gender = st.radio("Gender of Deceased:", ["Male (Husband has died)", "Female (Wife has died)"])
        deceased_gender = "male" if "Male" in gender else "female"
        
        spouse_alive = st.checkbox("Surviving Spouse?")
        wives_count = 1
        if spouse_alive and deceased_gender == "male":
            wives_count = st.number_input("How many surviving wives?", min_value=1, max_value=4, value=1)
            
        sons = st.number_input("Number of surviving Sons:", min_value=0, max_value=10, value=0)
        daughters = st.number_input("Number of surviving Daughters:", min_value=0, max_value=10, value=0)
        
    with col2:
        father = st.checkbox("Is the Father alive?")
        mother = st.checkbox("Is the Mother alive?")
        
        # Sibling calculations if no children and father is dead
        siblings_active = False
        brothers = 0
        sisters = 0
        if sons == 0 and daughters == 0 and not father:
            siblings_active = st.checkbox("Are there surviving Brothers or Sisters?")
            if siblings_active:
                brothers = st.number_input("Surviving Full Brothers:", min_value=0, max_value=10, value=0)
                sisters = st.number_input("Surviving Full Sisters:", min_value=0, max_value=10, value=0)
                
        estate_val = st.number_input("Total value of estate (Optional, enter 0 to skip):", min_value=0.0, value=0.0, step=1000.0)

    if st.button("Calculate Shares Now"):
        wizard_data = {
            "deceasedGender": deceased_gender,
            "spouseAlive": "yes" if spouse_alive else "no",
            "wivesCount": wives_count,
            "sonsCount": int(sons),
            "daughtersCount": int(daughters),
            "fatherAlive": "yes" if father else "no",
            "motherAlive": "yes" if mother else "no",
            "siblingsActive": siblings_active,
            "brothersCount": int(brothers),
            "sistersCount": int(sisters)
        }
        
        # Perform calculations
        heirs, aul, radd, umar, sum_fix = calculate_faraid_math(wizard_data, estate_val, st.session_state.language)
        
        # Display Results Card
        st.markdown("<div class='result-card'>", unsafe_allow_html=True)
        st.markdown(f"<div class='result-title'>⚖️ {locales[st.session_state.language]['resultsTitle']}</div>", unsafe_allow_html=True)
        
        # HTML segmented bar chart
        bar_segments = ""
        table_rows = ""
        total_allocated = 0
        
        for h in heirs:
            pct = h['finalFraction'] * 100
            bar_segments += f"<div class='share-bar-segment' style='width: {pct}%; background: {h['color']};' title='{h['nameEn'] if st.session_state.language=='en' else h['nameTa']}: {pct:.2f}%'></div>"
            
            amt_col = ""
            if estate_val > 0:
                allocated = estate_val * h['finalFraction']
                total_allocated += allocated
                amt_col = f"<td>{allocated:,.2f}</td>"
                
            table_rows += f"""
            <tr>
                <td><strong>{h['nameEn'] if st.session_state.language=='en' else h['nameTa']}</strong></td>
                <td>{h['fractionText']}</td>
                <td>{pct:.2f}%</td>
                {amt_col}
            </tr>
            """
            
        # Draw segmented bar
        st.markdown(f"<div class='share-bar-container'>{bar_segments}</div>", unsafe_allow_html=True)
        
        # Render table
        headers = f"<th>{locales[st.session_state.language]['heir']}</th><th>{locales[st.session_state.language]['shareFraction']}</th><th>{locales[st.session_state.language]['percentage']}</th>"
        if estate_val > 0:
            headers += f"<th>{locales[st.session_state.language]['amount']}</th>"
            
        table_html = f"""
        <table class='share-table'>
            <thead><tr>{headers}</tr></thead>
            <tbody>
                {table_rows}
                {'<tr style="font-weight:bold; color:#F1B434;"><td colspan="3">Total</td><td>{total_allocated:,.2f}</td></tr>' if estate_val > 0 else ''}
            </tbody>
        </table>
        """
        st.markdown(table_html, unsafe_allow_html=True)
        
        # Render Explanations
        st.markdown("### 📚 Juridical & Quranic Explanations:")
        for h in heirs:
            name = h['nameEn'] if st.session_state.language=='en' else h['nameTa']
            explanation = h['explanationEn'] if st.session_state.language=='en' else h['explanationTa']
            st.write(f"• **{name}**: {explanation}")
            
        # Notes
        t = locales[st.session_state.language]
        if aul:
            st.error(t["aulApplied"].replace("{sum}", f"{sum_fix:.3f}"))
        if radd:
            st.info(t["raddApplied"].replace("{sum}", f"{sum_fix:.3f}"))
        if umar:
            st.warning(t["umariyyatApplied"])
            
        st.markdown("</div>", unsafe_allow_html=True)
        
        # Reset and close wizard panel
        st.session_state.wizard_active = False
        st.markdown("---")

# -------------------------------------------------------------
# B. UNIFIED FREE-FORM CHAT INTERFACE
# -------------------------------------------------------------
st.markdown("### 💬 Conversational Assistant")
st.write("Type a question about inheritance rules or describe your heirs to perform a calculation.")

# Render previous messages
for msg in st.session_state.chat_history:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"], unsafe_allow_html=True)

# User input
user_query = st.chat_input(locales[st.session_state.language]["placeholder"])

if user_query:
    # 1. User Message bubble
    with st.chat_message("user"):
        st.write(user_query)
    st.session_state.chat_history.append({"role": "user", "content": user_query})
    
    # 2. Assistant response routing
    with st.chat_message("assistant"):
        # Check if the user is asking for a calculation
        parsed_data = parse_faraid_query(user_query)
        
        if parsed_data:
            st.write(locales[st.session_state.language]["calculating"])
            
            # Print parsed configuration
            t = locales[st.session_state.language]
            brief = t["parsedBrief"] \
                .replace('{gender}', 'Male (Husband)' if parsed_data["deceasedGender"] == 'male' else 'Female (Wife)') \
                .replace('{spouse}', f"{parsed_data['wivesCount']} Wife/Wives" if parsed_data["spouseAlive"] == 'yes' and parsed_data["deceasedGender"] == 'male' else ('Husband' if parsed_data["spouseAlive"] == 'yes' else 'No')) \
                .replace('{sons}', str(parsed_data["sonsCount"])) \
                .replace('{daughters}', str(parsed_data["daughtersCount"])) \
                .replace('{father}', 'Alive' if parsed_data["fatherAlive"] == 'yes' else 'Dead') \
                .replace('{mother}', 'Alive' if parsed_data["motherAlive"] == 'yes' else 'Dead') \
                .replace('{brothers}', str(parsed_data["brothersCount"])) \
                .replace('{sisters}', str(parsed_data["sistersCount"])) \
                .replace('{estate}', f"{parsed_data['estateValue']:,}" if parsed_data["estateValue"] > 0 else 'Fractions only')
            st.info(brief)
            
            # Perform calculations
            heirs, aul, radd, umar, sum_fix = calculate_faraid_math(parsed_data, parsed_data["estateValue"], st.session_state.language)
            
            # Draw visual breakdown card
            result_card_html = f"<div class='result-card'><div class='result-title'>⚖️ {t['resultsTitle']}</div>"
            bar_segments = ""
            table_rows = ""
            total_allocated = 0
            
            for h in heirs:
                pct = h['finalFraction'] * 100
                bar_segments += f"<div class='share-bar-segment' style='width: {pct}%; background: {h['color']};' title='{h['nameEn'] if st.session_state.language=='en' else h['nameTa']}: {pct:.2f}%'></div>"
                
                amt_col = ""
                if parsed_data["estateValue"] > 0:
                    allocated = parsed_data["estateValue"] * h['finalFraction']
                    total_allocated += allocated
                    amt_col = f"<td>{allocated:,.2f}</td>"
                    
                table_rows += f"""
                <tr>
                    <td><strong>{h['nameEn'] if st.session_state.language=='en' else h['nameTa']}</strong></td>
                    <td>{h['fractionText']}</td>
                    <td>{pct:.2f}%</td>
                    {amt_col}
                </tr>
                """
                
            result_card_html += f"<div class='share-bar-container'>{bar_segments}</div>"
            
            headers = f"<th>{t['heir']}</th><th>{t['shareFraction']}</th><th>{t['percentage']}</th>"
            if parsed_data["estateValue"] > 0:
                headers += f"<th>{t['amount']}</th>"
                
            result_card_html += f"""
            <table class='share-table'>
                <thead><tr>{headers}</tr></thead>
                <tbody>
                    {table_rows}
                    {'<tr style="font-weight:bold; color:#F1B434;"><td colspan="3">Total</td><td>{total_allocated:,.2f}</td></tr>' if parsed_data["estateValue"] > 0 else ''}
                </tbody>
            </table>
            """
            
            # Add citations
            result_card_html += "<br><strong>📚 Legal & Quranic Explanations:</strong><ul class='share-details-list'>"
            for h in heirs:
                name = h['nameEn'] if st.session_state.language=='en' else h['nameTa']
                explanation = h['explanationEn'] if st.session_state.language=='en' else h['explanationTa']
                result_card_html += f"<li><strong>{name}</strong>: {explanation}</li>"
            result_card_html += "</ul>"
            
            if aul:
                result_card_html += f"<p style='font-size:0.8rem; color:#f87171;'>{t['aulApplied'].replace('{sum}', f'{sum_fix:.3f}')}</p>"
            if radd:
                result_card_html += f"<p style='font-size:0.8rem; color:#60a5fa;'>{t['raddApplied'].replace('{sum}', f'{sum_fix:.3f}')}</p>"
            if umar:
                result_card_html += f"<p style='font-size:0.8rem; color:#fbbf24;'>{t['umariyyatApplied']}</p>"
                
            result_card_html += "</div>"
            
            st.markdown(result_card_html, unsafe_allow_html=True)
            st.session_state.chat_history.append({"role": "assistant", "content": result_card_html})
            
        else:
            # Q&A route: search the knowledge base strictly
            response = search_knowledge_base(user_query, st.session_state.language)
            st.markdown(response)
            st.session_state.chat_history.append({"role": "assistant", "content": response})
