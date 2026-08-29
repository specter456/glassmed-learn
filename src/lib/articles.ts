/**
 * The Research library — advanced clinical topics for doctors, senior students,
 * and healthcare professionals. Covers surgical procedures, critical care,
 * clinical case studies, and medical news.
 *
 * Educational content only — not a substitute for professional medical care.
 * In an emergency, call your local emergency number first.
 */

export type CalloutKind = "danger" | "warning" | "tip";

export interface ArticleCallout {
  kind: CalloutKind;
  title: string;
  text: string;
}

export interface ArticleSection {
  heading: string;
  /** Paragraphs of prose. */
  body?: string[];
  /** Ordered step-by-step instructions. */
  steps?: string[];
  /** Unordered list. */
  bullets?: string[];
  /** A highlighted box (red-flag / caution / pro tip). */
  callout?: ArticleCallout;
}

/** A tab within a tabbed article (e.g. Basics / In-Depth). */
export interface ArticleTab {
  id: string;
  label: string;
  icon?: string;
  sections: ArticleSection[];
  keyPoints: string[];
}

export interface Article {
  slug: string;
  title: string;
  emoji: string;
  category: string;
  summary: string;
  readMinutes: number;
  sections: ArticleSection[];
  /** Bullet summary shown at the end of the article. */
  keyPoints: string[];
  /** Red flags that mean "call emergency services now". */
  whenToCall: string[];
  /** Optional tabbed content — when present, replaces sections/keyPoints/whenToCall with tab UI. */
  tabs?: ArticleTab[];
}

export const ARTICLES: Article[] = [
  {
    slug: "cpr-basics",
    title: "CPR Basics: How to Perform CPR Correctly",
    emoji: "🫀",
    category: "Critical Care & Emergencies",
    summary:
      "When the heart stops, every minute without compressions cuts the chance of survival. Learn to recognize cardiac arrest, deliver high-quality compressions, and use an AED like it's second nature.",
    readMinutes: 6,
    sections: [
      {
        heading: "Recognize cardiac arrest",
        body: [
          "Cardiac arrest is not the same as a heart attack — it means the heart has stopped pumping effectively, and the person is unresponsive and not breathing normally (or only gasping). That gasping is not breathing; treat it as arrest.",
          "Time is the enemy. Brain cells begin dying within minutes without circulation, so the goal of bystander CPR is to keep blood — and oxygen — moving until the emergency team arrives.",
        ],
        steps: [
          "Make sure the scene is safe before you approach.",
          "Tap the person's shoulders and shout: “Are you OK?” Check for normal breathing for no more than 10 seconds.",
          "If they are unresponsive and not breathing normally: call your emergency number (or send someone to call) and have someone fetch the nearest AED.",
          "Start chest compressions immediately.",
        ],
        callout: {
          kind: "danger",
          title: "Don't delay to check for a pulse",
          text: "Pulse checks waste precious seconds and are unreliable for bystanders. Unresponsive + not breathing normally = start compressions. You cannot make a cardiac arrest worse by doing CPR.",
        },
      },
      {
        heading: "The compressions — the heart of CPR",
        body: [
          "Compressions are the most important part of bystander CPR. The chest is a pump: pressing it squeezes blood out of the heart; letting it fully recoil lets the heart refill. Both halves matter.",
        ],
        steps: [
          "Kneel beside the person. Place the heel of one hand on the center of the chest (lower half of the breastbone).",
          "Place your other hand on top and interlock your fingers. Keep your elbows locked and your shoulders directly over your hands.",
          "Push straight down 5–6 cm (about 2 inches), at a rate of 100–120 compressions per minute — the tempo of the Bee Gees' “Stayin' Alive.”",
          "Let the chest fully recoil after every push. Keep interruptions to under 10 seconds.",
          "Continue until an AED arrives, emergency services take over, or the person starts waking up.",
        ],
        callout: {
          kind: "warning",
          title: "A note on the right rhythm",
          text: "Most untrained rescuers push too slow and too shallow. Count out loud (“1 and 2 and 3 and…”) or hum “Stayin' Alive” — if you can't hum it, you're likely compressing at the right speed.",
        },
      },
      {
        heading: "Rescue breaths (if trained and willing)",
        body: [
          "If you are trained and comfortable giving breaths, use a 30:2 pattern — 30 compressions, then 2 breaths. If you are untrained or unwilling, skip the breaths: continuous high-quality compressions (hands-only CPR) are far better than doing nothing.",
        ],
        steps: [
          "After 30 compressions, tilt the head back and lift the chin to open the airway.",
          "Pinch the nose shut, seal your mouth over theirs, and give a breath over about 1 second — just enough to see the chest rise.",
          "Give a second breath, then immediately return to 30 compressions. Each pair of breaths should take under 10 seconds.",
        ],
      },
      {
        heading: "Using an AED (automated external defibrillator)",
        body: [
          "The AED is a talking machine — it will not shock unless it detects a shockable rhythm. Using it correctly multiplies the value of your compressions.",
        ],
        steps: [
          "Power on the AED and follow its voice prompts.",
          "Expose the chest (cut clothing if needed; the chest should be dry — wipe sweat off).",
          "Apply the pads exactly as pictured: one upper right chest, one on the lower left side of the ribs.",
          "During analysis and when it says “shock,” ensure nobody is touching the person.",
          "After the shock (or if no shock is advised), resume compressions immediately — the AED will re-analyze every 2 minutes.",
        ],
      },
      {
        heading: "When can you stop?",
        bullets: [
          "Emergency services arrive and take over.",
          "The person wakes up, moves, or begins breathing normally.",
          "You are physically exhausted and cannot continue — get a rotation going if someone else can take over.",
          "The scene becomes unsafe.",
        ],
      },
    ],
    keyPoints: [
      "Unresponsive and not breathing normally = cardiac arrest. Start compressions now, check nothing else first.",
      "Push hard (5–6 cm) and fast (100–120/min) in the center of the chest; let it fully recoil.",
      "Hands-only CPR is acceptable and effective for untrained bystanders.",
      "Use an AED the moment it arrives — it guides you, and it will not shock unless it should.",
    ],
    whenToCall: [
      "Any unresponsive, non-breathing person — call your emergency number immediately and start CPR.",
      "If you are alone with a child: give about 1 minute of CPR first, then call.",
      "The moment an AED is available, use it — don't wait for permission.",
    ],
  },
  {
    slug: "choking",
    title: "Choking: The Heimlich Maneuver for Adults and Infants",
    emoji: "😮‍💨",
    category: "Critical Care & Emergencies",
    summary:
      "A blocked airway can kill in minutes. Learn to tell a mild obstruction from a severe one, and master the exact back-blow and thrust sequences for adults, infants, pregnant people — and yourself.",
    readMinutes: 6,
    sections: [
      {
        heading: "Mild or severe? Your first decision",
        body: [
          "What you do depends entirely on whether the airway is partially or fully blocked. Acting on a mild blockage can turn it into a severe one.",
        ],
        bullets: [
          "Mild obstruction — the person is coughing forcefully, can speak, and can breathe: encourage them to keep coughing. Do not hit their back or interfere; a strong cough is the most effective airway-clearing force there is.",
          "Severe obstruction — the person cannot cough, speak, or breathe; they may clutch their throat (the universal choking sign) and turn blue. Act immediately.",
        ],
      },
      {
        heading: "Adults and children over 1 year: the 5-and-5 sequence",
        body: [
          "The classic sequence alternates back blows and abdominal thrusts (the Heimlich maneuver). Each cycle of 5 and 5 must be complete before you switch.",
        ],
        steps: [
          "Give 5 back blows: stand slightly to the side, support the chest with one hand, and strike firmly between the shoulder blades with the heel of your other hand.",
          "Give 5 abdominal thrusts: stand behind the person, wrap your arms around their waist, make a fist just above the navel (well below the ribcage), grasp it with your other hand, and thrust sharply inward and upward.",
          "Alternate 5 back blows and 5 thrusts until the object is expelled or the person becomes unresponsive.",
          "If they become unresponsive: lower them to the ground, call your emergency number, and begin CPR — before each set of breaths, look inside the mouth and remove any object you can clearly see.",
        ],
        callout: {
          kind: "danger",
          title: "Never do a blind finger sweep",
          text: "Sweeping a finger blindly into the throat can push the object deeper. Only remove an object you can actually see at the entrance of the airway.",
        },
      },
      {
        heading: "Infants under 1 year: back blows and chest thrusts",
        body: [
          "Infants have fragile anatomy — abdominal thrusts can injure their internal organs. The correct sequence uses back blows and chest thrusts instead.",
        ],
        steps: [
          "Sit or kneel, and lay the infant face-down along your forearm, head lower than the chest, supported on your thigh.",
          "Give 5 firm back blows between the shoulder blades with the heel of your hand.",
          "Turn the infant face-up along your other arm, still head-low, and give 5 chest thrusts with two fingers placed on the center of the chest (lower half of the breastbone), pushing straight down.",
          "Alternate 5 and 5 until the object comes out or the infant becomes unresponsive — then start infant CPR and call your emergency number.",
        ],
        callout: {
          kind: "warning",
          title: "Pregnant or obese? Use chest thrusts",
          text: "If the person is pregnant or too large to wrap your arms around, skip the abdominal thrusts and perform thrusts on the center of the lower chest instead.",
        },
      },
      {
        heading: "Choking when you're alone",
        steps: [
          "Make a fist and place it just above your navel, thumb side against your belly.",
          "Grasp it with your other hand and thrust sharply inward and upward.",
          "If that fails, lean forward over a firm surface — the back of a chair works — and press your upper abdomen against it with force.",
          "Call your emergency number if you still cannot clear the airway.",
        ],
      },
    ],
    keyPoints: [
      "Mild choking: let them cough. Severe choking: act now — 5 back blows, then 5 abdominal thrusts, alternating.",
      "Infants: back blows + chest thrusts with two fingers — never abdominal thrusts, never a blind finger sweep.",
      "If the person becomes unresponsive, start CPR and check the mouth for visible objects before breaths.",
      "Pregnant or obese people: chest thrusts instead of abdominal thrusts.",
    ],
    whenToCall: [
      "The person becomes unresponsive at any point — call your emergency number and start CPR.",
      "A child or infant is choking and you are alone — perform the sequence for about 1 minute, then call.",
      "After a choking rescue, even a successful one: a medical check is wise to rule out injury from the maneuver.",
    ],
  },
  {
    slug: "severe-bleeding",
    title: "Severe Bleeding: How to Stop It and Apply Pressure",
    emoji: "🩸",
    category: "Critical Care & Emergencies",
    summary:
      "Most bleeding stops with simple physics: pressure. This guide covers direct pressure, when to escalate to a tourniquet, and the shock warning signs that turn a bad scene critical.",
    readMinutes: 6,
    sections: [
      {
        heading: "Assess, protect, then press",
        body: [
          "Bleeding can look terrifying while being very survivable — the body has a remarkable ability to clot once pressure is applied. Your job is to keep the pressure on and not peek.",
        ],
        steps: [
          "Make sure the scene is safe, then put on gloves if you have them (any clean barrier is better than none).",
          "Identify the source: cut or tear clothing away to see the wound. Do not remove anything that is embedded in the wound.",
          "Call your emergency number if the bleeding is severe, spurting, or won't stop — or have someone call while you work.",
        ],
      },
      {
        heading: "Direct pressure — the first and best tool",
        steps: [
          "Place a clean cloth, gauze, or your gloved hand directly over the wound.",
          "Press firmly with the flat of your hand. Hold for at least 10 minutes without lifting to check — every peek restarts the clock.",
          "If blood soaks through, add another layer on top. Never remove the first dressing; removing it tears away the clot that is forming.",
          "Elevate the injured limb above the heart if there is no suspected fracture.",
          "Keep the person still and warm; keep them talking to monitor their level of consciousness.",
        ],
        callout: {
          kind: "tip",
          title: "“Add, don't remove”",
          text: "Soaking through means the pressure is working — it's pushing blood into the dressing. Keep adding layers on top and press harder. Removing the dressing is the single most common reason bleeding restarts.",
        },
      },
      {
        heading: "When to use a tourniquet",
        body: [
          "Tourniquets are for life-threatening bleeding from an arm or leg when direct pressure fails, can't be maintained, or there are multiple casualties. They are safe and limb-saving when applied correctly — the old fear of “losing the limb” is largely outdated.",
        ],
        steps: [
          "Apply a purpose-made tourniquet (commercial is strongly preferred over improvised) 5–7 cm (2–3 inches) above the wound — never directly over a joint.",
          "Tighten until the bleeding stops. It will hurt; that is expected and means it is tight enough.",
          "Note the exact time of application (write it on the person's forehead if you can).",
          "Never loosen or remove it once applied — only emergency or hospital personnel should do that.",
        ],
      },
      {
        heading: "Shock: the silent second emergency",
        body: [
          "Severe blood loss can push the body into shock — a state where organs don't get enough blood. Spot it early and treat it while you control the bleeding.",
        ],
        bullets: [
          "Signs: pale, cool, clammy skin; a rapid, weak pulse; fast shallow breathing; confusion or anxiety; extreme thirst; fainting.",
          "Action: lay the person flat on their back, raise their legs about 30 cm if there is no head or chest injury, keep them warm with a blanket, and give nothing to eat or drink.",
        ],
      },
      {
        heading: "Special cases",
        bullets: [
          "Embedded object (glass, knife): do not remove it. Apply pressure around the object and stabilize it so it doesn't move; the object itself is plugging the wound.",
          "Nosebleed: sit leaning slightly forward and pinch the nostrils shut for 10 minutes, breathing through the mouth. Leaning back makes blood run down the throat, which can cause nausea — and you lose sight of the bleeding.",
          "Internal bleeding (fall, blow to the abdomen): bruising, tenderness, dizziness, or a rigid belly with no external wound — treat for shock and call your emergency number.",
        ],
      },
    ],
    keyPoints: [
      "Press firmly on the wound and hold for at least 10 minutes without peeking.",
      "Blood soaks through? Add layers on top — never remove the first dressing.",
      "Life-threatening limb bleeding that won't stop: apply a tourniquet 2–3 inches above the wound, note the time, never loosen it.",
      "Watch for shock: pale, clammy, rapid pulse, confusion — lay flat, legs raised, keep warm.",
    ],
    whenToCall: [
      "Bleeding that is spurting, or that soaks through dressings despite firm pressure.",
      "Signs of shock, or any suspicion of internal bleeding after a fall or blow.",
      "A limb that looks severely deformed or a wound with an embedded object.",
    ],
  },
  {
    slug: "burns",
    title: "Burns: First-, Second-, and Third-Degree Treatment",
    emoji: "🔥",
    category: "Trauma",
    summary:
      "The single best first move for almost any burn is cool running water. Beyond that, degree-by-degree care — what to apply, what never to apply, and which burns belong in a hospital — is what separates good intentions from good care.",
    readMinutes: 6,
    sections: [
      {
        heading: "Know your degrees",
        bullets: [
          "First degree — red, painful, dry, no blisters (like a mild sunburn). Damages only the outer skin layer; heals in about a week.",
          "Second degree — red, blistered, intensely painful, moist. Reaches the deeper skin layer; medical care is needed for large or sensitive areas.",
          "Third degree — white, waxy, charred, or leathery. Often surprisingly painless because nerve endings have been destroyed. Always a medical emergency.",
        ],
      },
      {
        heading: "The first 20 minutes: cool it",
        body: [
          "Cooling halts the burning process, reduces swelling, and provides pain relief. It is the single most effective first-aid step for thermal burns.",
        ],
        steps: [
          "Remove jewelry, belts, and tight clothing near the burn before swelling starts — but never pull anything stuck to the skin.",
          "Cool the burn under cool (not ice-cold) running water for 10–20 minutes. If running water isn't available, apply a clean, cool, wet cloth and refresh it.",
          "Cover loosely with a clean, dry, non-stick dressing or cloth. Loose means loose — no tight wrapping.",
          "For pain, over-the-counter analgesics are fine. For first-degree burns, a gentle moisturizer after cooling helps.",
        ],
        callout: {
          kind: "danger",
          title: "Never apply ice, butter, oil, toothpaste, or “home remedies”",
          text: "Ice on a burn can cause frostbite on top of the burn. Butter, oils, and creams trap heat and invite infection. Anything sticky or greasy also has to be scrubbed off later — causing more damage. Cool running water is the only thing that belongs on a fresh burn.",
        },
      },
      {
        heading: "Blister care",
        bullets: [
          "Leave blisters intact — they are a natural sterile dressing. Popping them opens the door to infection.",
          "If a blister breaks on its own, wash gently with mild soap and water, apply antibiotic ointment, and cover with a clean dressing.",
          "Watch for infection: increasing redness, warmth, swelling, pus, or fever means see a clinician.",
        ],
      },
      {
        heading: "Third-degree and large burns",
        steps: [
          "Call your emergency number immediately.",
          "Do not remove clothing stuck to the burn — cut around it.",
          "Do not immerse large burned areas in cold water; that can dangerously drop body temperature.",
          "Cover the burn loosely with a clean, dry cloth or sheet to protect it.",
          "Watch for shock (pale, clammy, rapid pulse) and keep the person warm, lying flat with feet raised if possible.",
        ],
      },
      {
        heading: "Chemical, electrical, and eye burns",
        bullets: [
          "Chemical burns: brush off any dry chemical powder first, then rinse the area under running water for at least 20 minutes while removing contaminated clothing. Call poison control or your emergency number for guidance.",
          "Electrical burns: turn off the power source before touching the person. The visible wound may look small, but the internal damage can be severe — and the shock may have caused cardiac arrest, so check breathing and be ready to start CPR.",
          "Eye burns: hold the eyelid open and rinse the eye with lukewarm water for 15–20 minutes, then seek emergency care.",
        ],
      },
    ],
    keyPoints: [
      "Cool any thermal burn under running water for 10–20 minutes — the single best first step.",
      "Never use ice, butter, oils, or home remedies; never pop blisters.",
      "Second-degree burns over large or sensitive areas, and all third-degree burns, need medical care.",
      "For chemical burns: rinse 20 minutes, call poison control. For electrical burns: power off first, then check breathing.",
    ],
    whenToCall: [
      "Any third-degree burn, or second-degree burns larger than the person's palm, or on the face, hands, feet, genitals, or major joints.",
      "Chemical or electrical burns — call your emergency number (or poison control) immediately.",
      "Burns in children, the elderly, or anyone with diabetes or a weakened immune system — even moderate burns warrant a clinician.",
    ],
  },
  {
    slug: "fractures",
    title: "Fractures: How to Immobilize and When to Seek Help",
    emoji: "🦴",
    category: "Trauma",
    summary:
      "A suspected fracture needs immobilization, not diagnosis. Learn how to splint what you can, what absolutely not to do, and the red flags that demand emergency transport.",
    readMinutes: 5,
    sections: [
      {
        heading: "Recognize a fracture",
        bullets: [
          "Sharp pain that worsens with movement or touch — often with a snapping or grinding sensation at the moment of injury.",
          "Swelling, bruising, or visible deformity (a limb bent where it shouldn't be).",
          "Inability to bear weight, use, or straighten the limb.",
          "An open wound with bone visible through the skin (an open fracture — a true emergency).",
        ],
      },
      {
        heading: "First, handle the bigger emergencies",
        steps: [
          "Check responsiveness and breathing before anything else. Start CPR if needed.",
          "Control any bleeding first — direct pressure around the injury. Do not press directly on protruding bone.",
          "If you suspect a head, neck, or back injury — or the person has numbness or tingling — do not move them. Wait for emergency services.",
        ],
      },
      {
        heading: "Immobilize: splint what you can",
        body: [
          "Immobilization stops the bone ends from moving, which reduces pain and prevents further damage to blood vessels and nerves.",
        ],
        steps: [
          "Splint the joint above and the joint below the suspected fracture. A rigid item (rolled magazine, board, folded blanket) padded with cloth works.",
          "Secure the splint with bandages, cloth strips, or tape — snug enough to hold, loose enough to slide a finger underneath. Check distal circulation: the skin below shouldn't turn pale or blue, and sensation should be intact.",
          "Apply a cold pack wrapped in a cloth over the injury for 15–20 minutes at a time (never ice directly on skin).",
          "Elevate the injured limb above the heart if it doesn't cause pain.",
        ],
        callout: {
          kind: "warning",
          title: "Check “the three Cs” below the injury",
          text: "Every few minutes, check Color, Circulation, and Sensation in the fingers or toes beyond the splint. Pale, cold, numb, or blue means the splint is too tight or circulation is compromised — loosen it and seek urgent care.",
        },
      },
      {
        heading: "Open fractures (bone through the skin)",
        steps: [
          "Call your emergency number — an open fracture is a surgical emergency.",
          "Cover the wound with a clean, sterile dressing and control bleeding with pressure around the wound.",
          "Do not push the bone back in, and do not try to wash the wound out.",
          "Immobilize as best you can without moving the limb more than necessary.",
        ],
      },
      {
        heading: "What NOT to do",
        bullets: [
          "Don't try to straighten, realign, or “pop” the bone back into place.",
          "Don't test the injury by asking the person to move or put weight on it.",
          "Don't massage the area or apply heat.",
          "Don't ignore numbness, tingling, or loss of pulse beyond the injury — these mean urgent care, not “wait and see.”",
        ],
      },
    ],
    keyPoints: [
      "Splint the joint above and below the injury; snug, not tight — check color and sensation beyond it.",
      "Control bleeding first; never push protruding bone back in.",
      "Don't straighten, test, massage, or apply heat to a suspected fracture.",
      "Head, neck, or back injuries: don't move the person — call emergency services.",
    ],
    whenToCall: [
      "Open fractures, severe deformity, or injuries to the head, neck, or back.",
      "Numbness, tingling, pallor, or a cold limb beyond the injury — possible nerve or circulation damage.",
      "Any suspected fracture in a child, or if the pain is severe and weight-bearing is impossible.",
    ],
  },
  {
    slug: "heart-attack",
    title: "Heart Attack: Recognizing Symptoms and Acting Fast",
    emoji: "❤️‍🩹",
    category: "Critical Care & Emergencies",
    summary:
      "Chest pain is the headline, but heart attacks often whisper — especially in women, the elderly, and people with diabetes. Recognition plus a five-step response buys the heart muscle the time it needs.",
    readMinutes: 6,
    sections: [
      {
        heading: "The classic symptoms",
        bullets: [
          "Pressure, squeezing, fullness, or pain in the center of the chest lasting more than a few minutes — or that comes and goes.",
          "Pain radiating to the left arm, both arms, jaw, neck, back, or upper stomach.",
          "Shortness of breath — with or without chest discomfort.",
          "Cold sweat, nausea, vomiting, or lightheadedness.",
        ],
      },
      {
        heading: "The atypical presentation — especially women, the elderly, and diabetics",
        body: [
          "Many heart attacks never produce dramatic chest pain. In women, the elderly, and people with diabetes, the presentation is often subtle: unusual fatigue that comes on suddenly, shortness of breath, indigestion-like discomfort, pain between the shoulder blades, or nausea.",
          "Diabetics may feel little or no chest pain at all because nerve damage blunts the warning signals. When in doubt, take the symptoms seriously — a “silent” heart attack is still a heart attack.",
        ],
        callout: {
          kind: "warning",
          title: "“It's probably just gas” is a dangerous sentence",
          text: "Indigestion that won't go away, unusual fatigue, or back pain that appeared out of nowhere — especially with any of the other signs — deserves a 911 call, not an antacid. Let the emergency department rule it out.",
        },
      },
      {
        heading: "Immediate action — the five steps",
        steps: [
          "Call your emergency number immediately. Do not drive yourself — EMS can begin treatment in the ambulance and can defibrillate if needed.",
          "Have the person sit down, rest, and loosen any tight clothing. Keep them calm and still.",
          "If they have no aspirin allergy and no bleeding disorder, have them chew and swallow one adult aspirin (325 mg) or 2–4 low-dose (81 mg) tablets. Chewing gets it into the bloodstream faster.",
          "If they have prescribed nitroglycerin, help them take one dose as directed — sit them down first, as it can drop blood pressure.",
          "Note the exact time symptoms began and tell the paramedics. This time matters enormously for treatment decisions.",
        ],
      },
      {
        heading: "If they collapse",
        body: [
          "A heart attack can suddenly become cardiac arrest. If the person becomes unresponsive and stops breathing normally, start CPR immediately (100–120 compressions per minute) and use an AED as soon as one arrives.",
        ],
      },
      {
        heading: "What NOT to do",
        bullets: [
          "Don't “wait and see” — most heart-attack deaths happen within the first hours, often at home.",
          "Don't drive yourself or let them drive.",
          "Don't give food or drink (small sips of water with the aspirin are fine).",
          "Don't let them walk around or exert themselves “to shake it off.”",
        ],
      },
    ],
    keyPoints: [
      "Classic sign: chest pressure or pain that may radiate to the arm, jaw, or back — but women, the elderly, and diabetics often get fatigue, breathlessness, or “indigestion” instead.",
      "Call your emergency number first, always. Never drive yourself.",
      "Chew aspirin (unless allergic or bleeding risk); use prescribed nitroglycerin as directed.",
      "If they collapse: start CPR and use an AED.",
    ],
    whenToCall: [
      "Any chest discomfort that lasts more than a few minutes, or comes and goes — call, don't deliberate.",
      "Sudden unexplained fatigue, breathlessness, or sweating combined with any other sign.",
      "The person collapses at any point — start CPR and get an AED.",
    ],
  },
  {
    slug: "stroke",
    title: "Stroke: The FAST Test and Emergency Response",
    emoji: "🧠",
    category: "Critical Care & Emergencies",
    summary:
      "Time is brain: nearly two million neurons die every minute a stroke goes untreated. The FAST test turns a bystander into the most important link in the treatment chain.",
    readMinutes: 6,
    sections: [
      {
        heading: "What a stroke is — and why time is brain",
        body: [
          "A stroke happens when blood supply to part of the brain is cut off — by a clot (ischemic stroke, about 87% of cases) or by a bleeding vessel (hemorrhagic stroke). In both types, brain tissue dies without blood, and the treatments that can save it (clot-busting drugs, clot retrieval) are only effective within a narrow time window.",
          "That's why the phrase is “time is brain”: about 1.9 million neurons die every minute. Every delay — including a decision to “wait and see” — reduces the chance of recovery.",
        ],
      },
      {
        heading: "The FAST test",
        body: [
          "FAST is the simplest, fastest way to recognize a stroke. Do it the moment stroke is suspected, then act on the T without further testing.",
        ],
        steps: [
          "F — Face: ask them to smile. Does one side of the face droop?",
          "A — Arms: ask them to raise both arms. Does one arm drift downward or can't rise?",
          "S — Speech: ask them to repeat a simple sentence. Is speech slurred, strange, or absent?",
          "T — Time: if any of these signs are present, call your emergency number immediately and note the time symptoms began.",
        ],
        callout: {
          kind: "tip",
          title: "The extended version: BE FAST",
          text: "Add B — Balance: sudden dizziness, loss of balance or coordination. E — Eyes: sudden vision loss in one or both eyes, or double vision. A sudden, severe “thunderclap” headache is also a red flag. Any one of these deserves a 911 call.",
        },
      },
      {
        heading: "Immediate response while you wait for EMS",
        steps: [
          "Call your emergency number immediately — even if the symptoms seem to be improving or passing.",
          "Note the exact time symptoms started (or the last time the person was known to be normal). Tell the dispatcher.",
          "Keep the person lying flat with the head slightly elevated if possible; loosen tight clothing.",
          "Stay calm, keep them warm, and reassure them. Do not let them walk or move around.",
          "Give nothing to eat or drink — a stroke can impair swallowing, and fluids can go into the lungs.",
        ],
      },
      {
        heading: "What NOT to do",
        bullets: [
          "Don't give aspirin or any medication — if the stroke is hemorrhagic, aspirin makes the bleeding worse. Only hospital staff can determine the type.",
          "Don't give food, drink, or “something sweet” — a stroke is not a sugar problem.",
          "Don't let them drive or be driven by a family member — EMS is faster and starts treatment en route.",
          "Don't “wait to see if it passes” — even symptoms that fully resolve within minutes can be a transient ischemic attack (TIA), a powerful warning of an imminent stroke.",
        ],
      },
      {
        heading: "After the call",
        body: [
          "Keep the person still and comfortable, watch their breathing, and be ready to roll them onto their side (recovery position) if they vomit or become less responsive. Note what you observed — which arm, which side of the face, what they said — and tell the paramedics.",
        ],
      },
    ],
    keyPoints: [
      "FAST: Face droop, Arm drift, Speech slurred — Time to call 911.",
      "Note the exact time symptoms began; it determines treatment options.",
      "Never give aspirin or anything to eat or drink to a suspected stroke patient.",
      "Symptoms that resolve on their own are still a medical emergency (TIA warning).",
    ],
    whenToCall: [
      "Any single FAST sign — call your emergency number immediately.",
      "Sudden severe headache, sudden vision loss, or sudden loss of balance with no clear cause.",
      "Symptoms that appear to pass quickly — still call; it may be a TIA.",
    ],
  },
  {
    slug: "allergic-reactions",
    title: "Allergic Reactions: Anaphylaxis and EpiPen Use",
    emoji: "💉",
    category: "Critical Care & Emergencies",
    summary:
      "Anaphylaxis can escalate from hives to airway collapse in minutes. Learn to spot it, use an epinephrine auto-injector correctly, and understand why the hospital trip is non-negotiable.",
    readMinutes: 6,
    sections: [
      {
        heading: "Mild reaction or anaphylaxis?",
        body: [
          "Most allergic reactions are mild and localized: a few hives, some itching, a runny nose. Anaphylaxis is different — it is a rapid, whole-body allergic response that can close the airway and collapse blood pressure within minutes.",
        ],
        bullets: [
          "Mild: localized hives or itching, nasal congestion, mild swelling at the contact site. Antihistamines may help — but watch closely, because reactions can escalate.",
          "Anaphylaxis: rapid onset (minutes to a couple of hours) with trouble breathing, swelling of the lips/tongue/throat, wheezing, vomiting, dizziness, or collapse — or any reaction affecting two or more body systems (skin + breathing, skin + gut, etc.).",
        ],
        callout: {
          kind: "danger",
          title: "When in doubt, treat as anaphylaxis",
          text: "If there is any breathing difficulty or swelling of the face, lips, or throat, do not wait for “the full picture.” Epinephrine is the only medication that treats anaphylaxis — antihistamines cannot stop airway swelling or falling blood pressure.",
        },
      },
      {
        heading: "Using an epinephrine auto-injector (EpiPen)",
        body: [
          "Epinephrine is the first-line and life-saving treatment for anaphylaxis. It relaxes airway muscles, tightens blood vessels, and buys the minutes needed for advanced care.",
        ],
        steps: [
          "Call your emergency number — or send someone to call — before or immediately after injecting. State clearly: “Possible anaphylaxis, epinephrine administered.”",
          "Remove the auto-injector from its case. Hold it firmly; the orange (needle) end points down toward the outer thigh.",
          "Pull off the blue safety cap (or follow your device's exact instructions).",
          "Press the device firmly into the outer mid-thigh (it works through clothing) until you hear the click.",
          "Hold it firmly in place for 3 seconds, then remove and massage the injection site for about 10 seconds.",
          "Lie the person flat with legs raised if they are conscious and breathing adequately.",
          "If symptoms don't improve within 5–15 minutes, use the second injector if one is available. Paramedics can give more.",
        ],
        callout: {
          kind: "warning",
          title: "Expected after the injection",
          text: "A racing heart, tremor, paleness, or feeling “wired” after epinephrine is normal and means the medication is working. Tell the emergency team what was given and when.",
        },
      },
      {
        heading: "What NOT to do",
        bullets: [
          "Don't rely on antihistamines alone — they do not treat anaphylaxis.",
          "Don't make the person stand or walk; lying flat with legs raised maximizes blood flow to the heart and brain.",
          "Don't give anything to eat or drink.",
          "Don't skip the hospital “because they feel better” — a second wave of symptoms (biphasic reaction) can occur hours later. Observation is standard.",
        ],
      },
      {
        heading: "Common triggers to know",
        bullets: [
          "Foods: peanuts, tree nuts, shellfish, fish, milk, eggs, wheat, soy.",
          "Stings: bee, wasp, hornet, fire ant.",
          "Medications: antibiotics (especially penicillins), NSAIDs, some biologics; latex.",
          "If the trigger is a stinger, scrape it away with a credit-card edge — never pull it out with tweezers, which squeezes more venom in.",
        ],
      },
    ],
    keyPoints: [
      "Anaphylaxis = rapid, multi-system reaction: breathing trouble, face/throat swelling, vomiting, dizziness, collapse.",
      "Epinephrine is the only treatment — inject into the outer mid-thigh, hold 3 seconds, massage the site.",
      "Call your emergency number first (or immediately after) and use a second dose after 5–15 minutes if needed.",
      "Always go to the hospital afterward — biphasic reactions are real.",
    ],
    whenToCall: [
      "Any difficulty breathing, throat tightness, or swelling of the lips, tongue, or face — treat with epinephrine and call immediately.",
      "Dizziness, fainting, vomiting, or collapse after a known exposure.",
      "Symptoms that return or fail to improve 5–15 minutes after the first dose.",
    ],
  },
  {
    slug: "seizures",
    title: "Seizures: What to Do and What NOT to Do",
    emoji: "⚡",
    category: "Critical Care & Emergencies",
    summary:
      "A seizure looks terrifying and is usually self-limiting — the real danger comes from well-meaning bystanders. This guide separates protective care from harmful interference.",
    readMinutes: 6,
    sections: [
      {
        heading: "What a generalized seizure looks like",
        body: [
          "A generalized (tonic-clonic) seizure typically begins with sudden collapse and stiffening, followed by rhythmic jerking of the arms and legs. The person may turn blue around the lips, bite their tongue, or foam slightly at the mouth. After the jerking stops, they may be deeply confused and sleepy for many minutes.",
          "Most seizures stop on their own within 1–3 minutes. Your job is to keep them safe during it — and to know exactly when to call for help.",
        ],
      },
      {
        heading: "DO: the protective checklist",
        steps: [
          "Start a timer the moment the seizure begins — the duration is the single most important piece of information you'll report.",
          "Clear hard or sharp objects from around the person. Cushion their head with a folded jacket or your hands.",
          "If possible and safe, roll them gently onto their side (recovery position) once the jerking phase ends, or immediately if they vomit or have fluid in the mouth.",
          "Loosen a tight collar or tie. Remove glasses.",
          "Stay with them until they are fully awake and oriented. Reassure them calmly afterward — they may be embarrassed or confused.",
          "Note what happened: which side moved, how long it lasted, what they were doing beforehand.",
        ],
        callout: {
          kind: "tip",
          title: "The recovery position, briefly",
          text: "After the jerking stops, roll them onto their side with the top leg bent and the head resting on an outstretched arm. It keeps the airway open and lets fluids drain — never leave someone post-seizure lying flat on their back.",
        },
      },
      {
        heading: "DON'T: the harm list",
        bullets: [
          "Don't put anything in their mouth — no spoons, no wallets, no “bite blocks.” You cannot stop someone from biting their tongue, and objects cause broken teeth, choking, and jaw fractures. The tongue will not be “swallowed.”",
          "Don't restrain or hold them down. Muscle contractions are beyond their control; restraint causes injury to them and you.",
          "Don't give water, food, or medication until they are fully awake and alert.",
          "Don't splash water on them, use smelling salts, or try to “snap them out of it.”",
          "Don't leave them alone at any point during or after the seizure.",
        ],
        callout: {
          kind: "danger",
          title: "The spoon myth, retired",
          text: "Inserting objects into the mouth of someone seizing is the most common well-intentioned mistake in first aid. It does not protect the tongue — it breaks teeth, damages the jaw, and can push objects into the airway. Your hands and a cushion are the only things that belong near their head.",
        },
      },
      {
        heading: "When to call emergency services",
        body: [
          "Most seizures do not require emergency transport, but several situations absolutely do. When in doubt, call — a seizure is never “routine” to the person having it.",
        ],
        steps: [
          "Call if the seizure lasts longer than 5 minutes, or if a second seizure starts before full recovery.",
          "Call if it is the person's first-ever seizure, or if they are pregnant or have diabetes.",
          "Call if they are injured, if the seizure happens in water, or if they don't regain consciousness or alertness within a few minutes.",
          "Call if the seizure looks different from their usual pattern (if they have epilepsy) or breathing stops for a prolonged period.",
        ],
      },
      {
        heading: "After the seizure",
        body: [
          "Stay in the recovery position, keep them warm, and let them rest — post-seizure sleepiness is normal and can last 30 minutes or more. When they wake, speak calmly, orient them (“you had a seizure; you're safe”), and let them tell you what they need. Never leave them alone until they are fully themselves.",
        ],
      },
    ],
    keyPoints: [
      "Time the seizure, cushion the head, clear hazards, roll onto their side after the jerking stops.",
      "Never put anything in the mouth; never restrain; never give food or water until fully alert.",
      "Call emergency services: seizure > 5 minutes, first-ever seizure, pregnancy, diabetes, injury, water, or failure to wake.",
      "Stay until they are fully awake and oriented — then reassure them.",
    ],
    whenToCall: [
      "Seizure lasting more than 5 minutes, or a second seizure without full recovery in between.",
      "First-ever seizure, or seizure in a pregnant person, a person with diabetes, or in water.",
      "Injury during the seizure, or prolonged confusion/unresponsiveness afterward.",
    ],
  },
  {
    slug: "poisoning",
    title: "Poisoning: What to Do and When to Call Poison Control",
    emoji: "☠️",
    category: "Critical Care & Emergencies",
    summary:
      "In a poisoning, the wrong “help” is often worse than the poison. Call poison control early, never induce vomiting, and know the short list of situations that skip straight to 911.",
    readMinutes: 6,
    sections: [
      {
        heading: "First: identify what happened",
        body: [
          "Poisonings happen through four routes — swallowing, inhaling, skin contact, and eye contact — and the right first aid depends on which one it is and what the substance was. Gather facts before you act.",
        ],
        steps: [
          "Identify the substance: find the container, pill bottle, or plant. Read the label.",
          "Estimate the amount involved and when it happened.",
          "Note the person's age, weight, and any symptoms starting to appear.",
          "Have this information ready before you call — it is exactly what the expert will ask.",
        ],
      },
      {
        heading: "Call poison control — early and often",
        body: [
          "Poison control centers (in the US: 1-800-222-1222) are free, confidential, staffed by specialists, and open 24/7. They will tell you whether to treat at home, go to a hospital, or call emergency services — and they follow up to make sure things don't worsen.",
          "Call even if the exposure seems minor. Many household products and medications are toxic in surprisingly small amounts, and the “looks fine” window can be misleading.",
        ],
        callout: {
          kind: "tip",
          title: "Save the number now",
          text: "Put the poison control number in your phone today — not during the emergency. In many regions it is also reachable by texting POISON to 797979 for a quick reference.",
        },
      },
      {
        heading: "What NOT to do",
        bullets: [
          "Don't induce vomiting. Never use syrup of ipecac (it's off the market for good reason) and don't “stick a finger down the throat.” Caustic substances burn again on the way up, and aspiration into the lungs can be fatal.",
          "Don't follow the “milk or water to dilute” myth unless poison control tells you to — for some substances it speeds absorption, and for others it causes vomiting.",
          "Don't give the person any medication, charcoal, or “home antidotes” on your own.",
          "Don't wait for severe symptoms before calling — by then, time is lost.",
        ],
        callout: {
          kind: "danger",
          title: "Activated charcoal: expert decision only",
          text: "Charcoal is not a general antidote. It only helps specific poisons, must be given within about an hour, and can itself be dangerous if aspirated. Let poison control decide — never administer it from memory.",
        },
      },
      {
        heading: "Route-specific first aid",
        bullets: [
          "Swallowed poison: keep the container, do exactly what poison control says, and do not give anything to eat or drink unless instructed.",
          "Inhaled poison (fumes, smoke, gas): get the person to fresh air immediately — but only if the scene is safe for you. Call emergency services if they're coughing, dizzy, or unconscious.",
          "Skin contact: remove contaminated clothing and rinse the skin under running water for 15–20 minutes. For dry chemical powders, brush off before wetting (water activates some chemicals).",
          "Eye contact: rinse the eye with lukewarm water for 15–20 minutes, holding the eyelid open, then call poison control or seek care.",
        ],
      },
      {
        heading: "When to skip poison control and call 911",
        body: [
          "Some situations are emergencies first and poison-control calls second. If the person is unconscious, seizing, struggling to breathe, or has severe burns around the mouth or throat, call your emergency number immediately — then follow their instructions while help is on the way.",
          "Also call emergency services if you suspect a suicide attempt or an intentionally large overdose — this is a medical and mental-health emergency, and the person should not be left alone for a second.",
        ],
      },
    ],
    keyPoints: [
      "Identify the substance, amount, and time — then call poison control (US: 1-800-222-1222), free and 24/7.",
      "Never induce vomiting; never give milk, water, charcoal, or meds unless poison control says so.",
      "Route matters: fresh air for inhalation, 15–20 minutes of rinsing for skin and eye contact.",
      "Unconscious, seizing, struggling to breathe, or mouth burns: call 911, not just poison control.",
    ],
    whenToCall: [
      "Unconsciousness, seizures, trouble breathing, or severe burns around the mouth — call 911 immediately.",
      "Suspected suicide attempt or large intentional overdose — call 911 and do not leave the person alone.",
      "Any poisoning in a child, or any uncertainty about the substance or amount — call poison control right away.",
    ],
  },
  // =====================================================================
  // CLINICAL ARTICLES — Research section (advanced, professional focus)
  // =====================================================================

  // ---- Critical Care & Emergencies ----

  {
    slug: "rapid-sequence-intubation",
    title: "Rapid Sequence Intubation (RSI)",
    emoji: "🫁",
    category: "Critical Care & Emergencies",
    summary:
      "RSI is the gold-standard technique for securing a definitive airway in emergency settings. Master the pharmacology, equipment, and stepwise approach that keeps oxygen delivery uninterrupted.",
    readMinutes: 8,
    sections: [
      {
        heading: "Indications and contraindications",
        bullets: [
          "Indications: respiratory failure, airway compromise, inability to protect the airway, GCS ≤ 8, severe facial/neck trauma, anticipated clinical deterioration.",
          "Absolute contraindications: none — RSI is life-saving. Relative contraindications include difficult airway history, maxillofacial distortion, and cervical spine instability (requires video laryngoscopy).",
        ],
      },
      {
        heading: "Pre-oxygenation (the most important step)",
        body: [
          "RSI is apnoeic oxygenation: the patient stops breathing after induction. Maximising oxygen reserves before intubation buys time and prevents hypoxia.",
        ],
        steps: [
          "Place the patient in head-elevated position (reverse Trendelenburg if possible).",
          "Deliver 100% oxygen via non-rebreather mask at 15 L/min for at least 3 minutes, or 8 vital capacity breaths via BVM.",
          "Consider nasal cannula at 15 L/min throughout (apnoeic oxygenation) to extend safe apnoea time.",
          "Target end-tidal O₂ > 90% if capnography is available.",
        ],
      },
      {
        heading: "Induction and paralysis",
        body: [
          "The classic RSI sequence is induction agent followed immediately by a neuromuscular blocker — no bag-mask ventilation between drugs.",
        ],
        steps: [
          "Administer induction agent: Ketamine 1–2 mg/kg IV (preferred in haemodynamically unstable patients) or Etomidate 0.3 mg/kg IV (haemodynamic stability) or Propofol 1.5–2.5 mg/kg IV (stable patients).",
          "Administer neuromuscular blocker: Succinylcholine 1–1.5 mg/kg IV (onset 45–60 sec, duration 5–10 min) or Rocuronium 1.2 mg/kg IV (onset 60 sec, duration 45–60 min — reversible with sugammadex).",
          "Wait for full paralysis: 45–60 seconds for succinylcholine, 60–90 seconds for rocuronium.",
          "Apply Sellick's manoeuvre (cricoid pressure) if aspiration risk is high — though this is now debated.",
        ],
        callout: {
          kind: "warning",
          title: "Succinylcholine caution",
          text: "Contraindicated in burns > 24 h old, crush injury > 48 h, spinal cord injury, hyperkalaemia, and personal/family history of malignant hyperthermia. Rocuronium is the safer default in many emergency settings.",
        },
      },
      {
        heading: "Laryngoscopy and tube placement",
        steps: [
          "Position the patient: sniffing the morning airway (ear-to-sternal notch alignment). Use a ramp if obese.",
          "Insert the laryngoscope blade (Macintosh or Miller) and visualise the glottis. Apply the BURP manoeuvre if the view is suboptimal.",
          "If Cormack-Lehane Grade III–IV, immediately switch to video laryngoscopy or a supraglottic airway (LMA) as a rescue device.",
          "Advance the endotracheal tube (7.0–8.0 mm ID) through the vocal cords with the cuff above the glottis.",
          "Inflate the cuff with 5–8 mL of air.",
        ],
      },
      {
        heading: "Confirm placement",
        steps: [
          "Attach end-tidal CO₂ capnography — the gold standard. Persistent waveform for 6 breaths confirms oesophageal intubation is excluded.",
          "Listen for bilateral breath sounds (axillae, not just apices).",
          "Observe chest rise, fogging of the tube, and rising SpO₂.",
          "Check the ETT depth at the teeth: 21 cm in females, 23 cm in males.",
          "If uncertain, use video laryngoscopy to directly visualise the tube through the cords.",
        ],
        callout: {
          kind: "danger",
          title: "Never rely on pulse oximetry alone",
          text: "SpO₂ remains normal for minutes after apnoea in a pre-oxygenated patient. Only capnography confirms tube position in real time. Misplaced tube = death.",
        },
      },
      {
        heading: "Post-intubation care",
        bullets: [
          "Secure the tube with tape or a commercial holder. Document the depth at the teeth.",
          "Obtain a chest X-ray to confirm tip position (2–5 cm above the carina).",
          "Initiate mechanical ventilation with lung-protective settings (tidal volume 6–8 mL/kg IBW, PEEP 5–10 cmH₂O).",
          "Administer post-intubation sedation and analgesia: propofol drip or midazolam + fentanyl infusion.",
          "Monitor for complications: mainstem intubation, pneumothorax, tube dislodgement, aspiration.",
        ],
      },
    ],
    keyPoints: [
      "Pre-oxygenation is the most critical step — 3 minutes of 100% O₂ or 8 vital capacity breaths.",
      "Induction + paralytic (no ventilation between) — ketamine/etomidate + succinylcholine/rocuronium.",
      "Capnography confirms placement — never rely on SpO₂ or auscultation alone.",
      "If the view is Grade III–IV, switch to video laryngoscopy immediately — do not persist with direct laryngoscopy.",
    ],
    whenToCall: [
      "Any patient requiring emergent intubation should have the entire airway team activated before the procedure.",
      "Call anaesthesiology and ENT early if a difficult airway is anticipated.",
    ],
  },

  {
    slug: "chest-decompression",
    title: "Needle Decompression & Chest Tube Insertion",
    emoji: "🔧",
    category: "Critical Care & Emergencies",
    summary:
      "Tension pneumothorax kills in minutes. This guide covers the life-saving needle decompression, the definitive chest tube insertion, and the clinical reasoning behind each step.",
    readMinutes: 8,
    sections: [
      {
        heading: "Tension pneumothorax — recognition",
        body: [
          "Tension pneumothorax is a clinical diagnosis, not a radiographic one. The accumulating air under pressure shifts mediastinal structures, compresses the heart and great vessels, and causes rapid cardiovascular collapse.",
        ],
        bullets: [
          "Classic triad: respiratory distress, hypotension, and absent breath sounds on the affected side.",
          "Tracheal deviation away from the affected side (late sign).",
          "Distended neck veins (unless hypovolaemic, which masks them).",
          "Cyanosis, agitation, altered consciousness.",
        ],
      },
      {
        heading: "Needle decompression (temporary relief)",
        body: [
          "Needle decompression converts a tension pneumothorax into a simple pneumothorax, buying time for definitive chest tube insertion. It is not a definitive treatment.",
        ],
        steps: [
          "Identify the insertion site: 2nd intercostal space, mid-clavicular line on the affected side (or 4th/5th ICS, anterior axillary line in obese patients).",
          "Clean the area with antiseptic.",
          "Insert a 14–16 gauge IV catheter perpendicular to the chest wall, over the upper border of the rib (to avoid the neurovascular bundle).",
          "You should hear/feel a rush of air — confirming the diagnosis.",
          "Leave the cannula in place (remove the needle). The cannula acts as a one-way valve.",
          "Prepare for chest tube insertion immediately.",
        ],
        callout: {
          kind: "danger",
          title: "Over the rib, not under",
          text: "The intercostal neurovascular bundle runs along the lower border of each rib. Always pass the needle or tube over the upper border of the rib below to avoid catastrophic haemorrhage.",
        },
      },
      {
        heading: "Chest tube insertion (definitive treatment)",
        steps: [
          "Position: semi-recumbent (30–45°), arm abducted to 90° on the affected side.",
          "Identify the site: 4th or 5th intercostal space, anterior axillary line — just above the rib.",
          "Prepare the field: wide antiseptic drape, sterile gloves, local anaesthetic (1–2% lidocaine) to skin, subcutaneous tissue, and periosteum.",
          "Make a 2–3 cm horizontal skin incision along the intercostal space.",
          "Bluntly dissect with a curved haemostat through the intercostal muscles until you feel the pleura give way (a 'pop').",
          "Slide your finger into the pleural space to confirm entry and sweep for adhesions.",
          "Advance the chest tube (28–32 Fr for trauma; 20–24 Fr for pneumothorax) over the clamp, directing it posteriorly and superiorly.",
          "Connect to an underwater seal drainage system and apply suction (20–25 cmH₂O).",
          "Suture the tube in place and apply an occlusive dressing.",
        ],
      },
      {
        heading: "Post-insertion monitoring",
        bullets: [
          "Monitor for bubbling in the underwater seal (air leak) — should diminish over 24–48 hours.",
          "Check the fluid character: serous (normal), bloody (haemothorax), or purulent (empyema).",
          "Maintain the tube patency by milking/stripping only when ordered — routine stripping is now discouraged.",
          "Chest X-ray within 1 hour to confirm position and re-expansion.",
          "Watch for complications: re-expansion pulmonary oedema (especially if lung was collapsed > 3 days), infection, tube malposition, subcutaneous emphysema.",
        ],
      },
      {
        heading: "When to remove the chest tube",
        bullets: [
          "No air leak for 24 hours on water seal.",
          "Lung fully expanded on chest X-ray.",
          "Drainage output < 100–200 mL/day (for haemothorax).",
          "Removal is performed on expiration orValsalva to prevent air re-entry.",
        ],
      },
    ],
    keyPoints: [
      "Tension pneumothorax = clinical diagnosis — don't wait for X-ray.",
      "Needle decompression: 2nd ICS, mid-clavicular line, over the rib — temporary only.",
      "Chest tube: 4th/5th ICS, anterior axillary line, blunt dissection, underwater seal.",
      "Always monitor for re-expansion oedema, air leak resolution, and infection.",
    ],
    whenToCall: [
      "Clinical suspicion of tension pneumothorax in a trauma or critically ill patient — decompress immediately.",
      "Persistent air leak or recurrent pneumothorax despite needle decompression.",
    ],
  },

  {
    slug: "central-venous-access",
    title: "Central Venous Catheter Insertion",
    emoji: "💉",
    category: "Critical Care & Emergencies",
    summary:
      "Central venous access is a cornerstone of critical care — from vasopressor delivery to haemodialysis. Master the anatomy, technique, and complications that every intensivist must know.",
    readMinutes: 7,
    sections: [
      {
        heading: "Indications",
        bullets: [
          "Vasopressor or inotropic drug administration (noradrenaline, dopamine, dobutamine).",
          "Rapid fluid resuscitation when peripheral access is inadequate.",
          "Haemodialysis or apheresis access.",
          "Central venous pressure (CVP) monitoring.",
          "Total parenteral nutrition (TPN) or caustic drug administration.",
          "Transvenous pacing wire insertion.",
        ],
      },
      {
        heading: "Site selection",
        body: [
          "The three main sites are the internal jugular vein (IJ), subclavian vein, and femoral vein. Each has distinct risk profiles.",
        ],
        bullets: [
          "Internal jugular (preferred for most): lowest pneumothorax risk, easy ultrasound visualisation. Risk: carotid artery puncture, haematoma.",
          "Subclavian: lowest infection rate, most comfortable long-term. Risk: pneumothorax (2–5%), subclavian artery injury, brachial plexus injury.",
          "Femoral: fastest to access in arrest situations. Highest infection rate. Risk: femoral artery puncture, retroperitoneal haematoma.",
        ],
      },
      {
        heading: "Ultrasound-guided IJ insertion (Seldinger technique)",
        steps: [
          "Place the patient in Trendelenburg position (15–20° head-down) to engorge the IJ and reduce air embolism risk.",
          "Use a high-frequency linear ultrasound probe. Identify the IJ (compressible, non-pulsatile) lateral to the carotid artery (pulsatile, non-compressible).",
          "Prepare the field: full sterile drape, chlorhexidine skin prep, sterile gel for ultrasound.",
          "Infiltrate local anaesthetic (1% lidocaine) to skin and subcutaneous tissue.",
          "Under real-time ultrasound guidance, insert the introducer needle at a 30–45° angle to the skin, directed towards the ipsilateral nipple.",
          "Aspirate venous blood (dark, non-pulsatile).",
          "Thread the J-tip guidewire through the needle under continuous visualisation. The wire should advance easily without resistance.",
          "Remove the needle, maintaining wire position. Dilate the tract with the dilator over the wire (one firm push).",
          "Advance the central venous catheter over the wire to the pre-measured depth (right IJ: 13–15 cm, left IJ: 15–17 cm).",
          "Remove the wire, aspirate all ports, flush with saline, and cap.",
          "Confirm placement with chest X-ray: catheter tip should be at the cavo-atrial junction (T3–T4).",
        ],
      },
      {
        heading: "Complications and prevention",
        bullets: [
          "Pneumothorax: minimise by using ultrasound guidance, especially for subclavian access.",
          "Arterial puncture: always check aspirated blood colour and pulsatility before dilating. If pulsatile → remove and reposition.",
          "Air embolism: keep the patient Trendelenburg during insertion, occlude the needle hub between wire insertion and catheter advancement.",
          "Catheter-related bloodstream infection (CRBSI): strict sterile technique, chlorhexidine skin prep, daily assessment of line necessity.",
          "Malposition: always confirm with CXR — tip in the right atrium risks cardiac perforation.",
        ],
        callout: {
          kind: "danger",
          title: "Never dilate without confirming venous access",
          text: "Dilating into the carotid artery is a catastrophic, preventable error. Always verify: dark blood, low pressure, non-pulsatile, and ideally ultrasound confirmation of the wire in the vein before dilation.",
        },
      },
    ],
    keyPoints: [
      "Ultrasound-guided insertion is the standard of care — never blind stick.",
      "Trendelenburg position during insertion reduces air embolism and increases vein size.",
      "Confirm tip position on CXR: cavo-atrial junction (T3–T4).",
      "Strict sterile technique and daily line necessity review prevent CRBSI.",
    ],
    whenToCall: [
      "Any difficulty accessing the vein, or if the wire encounters resistance — stop and reassess.",
      "Suspected arterial puncture during insertion — apply pressure and switch sites.",
    ],
  },

  // ---- Surgical Procedures ----

  {
    slug: "laparoscopic-cholecystectomy",
    title: "Laparoscopic Cholecystectomy: The Gold Standard",
    emoji: "🔪",
    category: "Surgical Procedures",
    summary:
      "Laparoscopic cholecystectomy is one of the most commonly performed abdominal surgeries worldwide. Understand the critical view of safety, the 'time-out' principles, and how to manage the dreaded bile duct injury.",
    readMinutes: 9,
    sections: [
      {
        heading: "Indications",
        bullets: [
          "Symptomatic gallstones (biliary colic, cholecystitis) — the most common indication.",
          "Complications: empyema, perforation, gallstone ileus, choledocholithiasis.",
          "Porcelain gallbladder (calcified wall — increased cancer risk).",
          "Gallbladder polyps > 1 cm or growing.",
          "Asymptomatic gallstones in high-risk patients (e.g., sickle cell disease, transplant recipients).",
        ],
      },
      {
        heading: "Pre-operative workup",
        bullets: [
          "LFTs, bilirubin, amylase/lipase, CBC, coagulation screen.",
          "Right upper quadrant ultrasound: stones, gallbladder wall thickness, CBD diameter, pericholecystic fluid.",
          "If CBD dilation > 6 mm or LFTs elevated: MRCP or EUS to exclude CBD stones before surgery.",
          "ASA classification and anaesthetic assessment.",
        ],
      },
      {
        heading: "The Critical View of Safety (CVS)",
        body: [
          "The CVS is the single most important step in preventing bile duct injury. It is a deliberate, methodical dissection that definitively identifies the cystic duct and cystic artery before any structure is clipped or divided.",
        ],
        steps: [
          "Dissect Calot's triangle: clear the hepatocystic triangle of fat and fibrous tissue.",
          "Identify the cystic duct and cystic artery — only two structures should enter the gallbladder.",
          "The hepatocystic triangle must be cleared so that the lower third of the gallbladder is separated from the liver bed, exposing the cystic plate.",
          "The CVS is achieved when: (1) the hepatocystic triangle is cleared, (2) the lower third of the gallbladder is dissected off the cystic plate, and (3) only two structures (cystic duct and cystic artery) are seen entering the gallbladder.",
          "If the CVS cannot be achieved (inflammation, fibrosis, unclear anatomy): STOP. Convert to open surgery. Do not proceed with clipping or cutting.",
        ],
        callout: {
          kind: "danger",
          title: "The '30-minute rule'",
          text: "If you cannot achieve the Critical View of Safety within 30 minutes of dissection, convert to open. Bile duct injury risk increases exponentially with prolonged, frustrated dissection. There is no shame in converting — there is shame in injuring the bile duct.",
        },
      },
      {
        heading: "Key surgical steps",
        steps: [
          "General anaesthesia, supine position, left arm tucked. Surgeon stands on the patient's left.",
          "Pneumoperitoneum: Veress needle or Hasson (open) technique. Target IAP: 12–14 mmHg.",
          "4-port technique: 10 mm umbilical (camera), 10 mm epigastric (surgeon's right hand), 5 mm right midclavicular, 5 mm right anterior axillary.",
          "Retract the gallbladder fundus cephalad with the lateral port grasper. Dissect Calot's triangle with the epigastric port.",
          "Achieve the CVS. Clip the cystic duct with 2 clips proximally, 1 distally, and divide. Repeat for the cystic artery.",
          "Remove the gallbladder from the liver bed using electrocautery, staying in the correct plane.",
          "Extract the gallbladder through the umbilical port (use a retrieval bag if the stone burden is large or the gallbladder is gangrenous).",
          "Irrigate the hepatocystic triangle, check the cystic duct stump for leaks, and inspect the liver bed for haemostasis.",
          "Desufflate, close port sites (10 mm ports require fascial closure to prevent hernia).",
        ],
      },
      {
        heading: "Complications",
        bullets: [
          "Bile duct injury (0.3–0.5%): the most feared complication. Classification (Strasberg): Type A (cystic duct leak) to Type E (major duct transection). Managed with ERCP/stenting or Roux-en-Y hepaticojejunostomy.",
          "Bleeding: cystic artery stump, liver bed, or port-site vessels. Usually self-limiting.",
          "Bile leak: from the cystic duct stump or accessory ducts. Managed with ERCP and stenting.",
          "Retained CBD stones: post-op ERCP for extraction.",
          "Port-site hernia: close all 10 mm fascial defects.",
          "Conversion to open: not a complication — it is sound judgement.",
        ],
      },
    ],
    keyPoints: [
      "The Critical View of Safety is non-negotiable — achieve it before clipping anything.",
      "Cannot achieve CVS within 30 minutes? Convert to open. No exceptions.",
      "Clip the cystic duct only after definitive identification — never 'tentatively'.",
      "Bile duct injury risk drops to near-zero with meticulous CVS technique.",
    ],
    whenToCall: [
      "Haemodynamic instability during surgery — convert immediately.",
      "Unclear anatomy or suspected bile duct injury — do not attempt laparoscopic repair without specialist help.",
    ],
  },

  {
    slug: "caesarean-section",
    title: "Caesarean Section: Indications and Technique",
    emoji: "👶",
    category: "Surgical Procedures",
    summary:
      "Caesarean delivery is the most commonly performed major abdominal surgery in the world. Know the indications, the Pfannenstiel approach, and the critical steps that protect both mother and child.",
    readMinutes: 8,
    sections: [
      {
        heading: "Indications",
        bullets: [
          "Elective: breech presentation, placenta praevia, multiple gestation, previous C-section (depending on scar type), maternal request.",
          "Emergency: fetal distress (category 1: delivery within 30 min of decision), failure to progress, cord prolapse, uterine rupture, placental abruption.",
          "Relative: macrosomia, maternal HIV with high viral load, previous difficult vaginal delivery.",
        ],
      },
      {
        heading: "Pre-operative preparation",
        bullets: [
          "Consent, type and cross-match, IV access (14–16 G), bloods (FBC, G&S, coagulation).",
          "Anaesthetic: spinal (preferred for elective) or general (emergency or contraindications to spinal).",
          "Prophylactic antibiotics: single dose IV cephalosporin (cefazolin 2 g) within 60 min of skin incision.",
          "Foley catheter: decompress the bladder to avoid injury during lower-segment incision.",
          "Fetal heart monitoring until draping.",
        ],
      },
      {
        heading: "The Pfannenstiel incision and uterine entry",
        steps: [
          "Skin incision: Pfannenstiel — a curved transverse incision 2–3 cm above the pubic symphysis, approximately 12–15 cm long.",
          "Dissect through the subcutaneous tissue. Identify and incise the rectus sheath transversely.",
          "Separate the rectus muscles in the midline (do not cut them).",
          "Bluntly open the paravesical peritoneum and identify the lower uterine segment.",
          "Make a low transverse uterine incision (Kerr incision) in the lower segment, 1–2 cm above the bladder reflection.",
          "Extend the incision laterally with bandage scissors (if needed) to avoid tearing into the uterine arteries.",
          "Amniotomy: rupture the membranes. Note liquor character (clear, meconium-stained, blood-stained).",
        ],
        callout: {
          kind: "warning",
          title: "Bladder injury prevention",
          text: "The bladder sits directly on the lower uterine segment. Always identify the bladder edge, push it down with a retractor, and ensure a safe distance before making the uterine incision. If adhesions are dense, consider a vertical (classical) uterine incision.",
        },
      },
      {
        heading: "Delivery of the baby",
        steps: [
          "Delivery of the head: introduce the hand under the head, lift it out of the incision. Ask the assistant to apply fundal pressure.",
          "Deliver the shoulders and body. Note the time of delivery.",
          "Cord clamping: immediate (for non-asphyxiated term infants) or delayed (30–60 seconds for preterm infants to improve haemoglobin and blood pressure).",
          "Hand the baby to the paediatric team for assessment.",
          "Administer oxytocin (5–10 IU IV or IM) after delivery of the placenta to reduce haemorrhage.",
        ],
      },
      {
        heading: "Delivery of the placenta and closure",
        steps: [
          "Allow the placenta to separate spontaneously (avoid cord traction, which can cause inversion).",
          "Deliver the placenta by controlled cord traction with counter-pressure on the uterus.",
          "Inspect the placenta for completeness (retained products cause haemorrhage).",
          "Close the uterine incision in two layers with a continuous locking suture (vicryl or chromic catgut).",
          "Check for haemostasis at the incision site, the bladder edge, and the round ligaments.",
          "Close the peritoneum (some surgeons skip this — no proven benefit).",
          "Close the rectus sheath with a continuous suture (PDS or nylon).",
          "Subcuticular skin closure or staples.",
        ],
      },
      {
        heading: "Post-operative care and complications",
        bullets: [
          "Thromboprophylaxis: compression stockings + LMWH (especially if Caesarean was emergency or prolonged immobilisation).",
          "Monitor for post-partum haemorrhage: the leading cause of maternal mortality worldwide.",
          "Wound care: keep dry for 24 hours, then normal hygiene. Remove staples/sutures at 5–7 days.",
          "Encourage early mobilisation and breastfeeding.",
          "Complications: wound infection (3–5%), endometritis, bladder injury, ureter injury, bowel injury (rare), venous thromboembolism.",
          "Subsequent pregnancies: after 1 Caesarean, VBAC (vaginal birth after Caesarean) is attempted in ~60% of cases. Trial of labour after Caesarean (TOLAC) requires informed consent and continuous fetal monitoring.",
        ],
      },
    ],
    keyPoints: [
      "Pfannenstiel incision → transverse rectus sheath → blunt muscle separation → low uterine segment.",
      "Bladder injury is preventable: always identify and retract the bladder before uterine incision.",
      "Two-layer uterine closure with continuous locking suture for haemostasis.",
      "VBAC is an option after one lower-segment Caesarean — discuss risks and benefits with the patient.",
    ],
    whenToCall: [
      "Category 1 Caesarean (fetal distress): decision to delivery within 30 minutes — activate the full team immediately.",
      "Uncontrolled haemorrhage despite uterotonics — consider balloon tamponade, B-Lynch suture, or hysterectomy.",
    ],
  },

  // ---- Clinical Case Studies ----

  {
    slug: "ami-case-study",
    title: "Acute STEMI: A Clinical Case Study",
    emoji: "🏥",
    category: "Clinical Case Studies",
    summary:
      "A 58-year-old male presents with crushing chest pain and diaphoresis. Walk through the complete clinical reasoning — from ECG interpretation to primary PCI — as if you were the attending physician.",
    readMinutes: 7,
    sections: [
      {
        heading: "The presentation",
        body: [
          "Mr. K, a 58-year-old male with hypertension and type 2 diabetes, is brought to the emergency department by ambulance. He describes a sudden onset of crushing, retrosternal chest pain radiating to his left arm, accompanied by profuse sweating and nausea. The pain started 45 minutes ago while climbing stairs.",
          "Vitals: BP 90/60 mmHg, HR 102 bpm (regular), SpO₂ 94% on room air, RR 22/min, temperature 36.8°C.",
        ],
      },
      {
        heading: "Initial assessment and ECG",
        steps: [
          "Obtain a 12-lead ECG within 10 minutes of arrival — this is the single most important diagnostic step.",
          "ECG findings: ST-segment elevation in leads II, III, aVF (inferior leads), with reciprocal ST depression in leads I and aVL. Right ventricular involvement confirmed by ST elevation in V4R.",
          "Interpretation: Inferior STEMI with RV involvement — likely occlusion of the right coronary artery (RCA).",
          "Activate the catheterisation lab for primary PCI (door-to-balloon time goal: < 90 minutes).",
        ],
      },
      {
        heading: "Immediate management (before cath lab)",
        steps: [
          "Aspirin 300 mg chewed immediately.",
          "Ticagrelor 180 mg loading dose (or clopidogrel 300 mg if ticagrelor unavailable).",
          "Heparin 70 IU/kg IV bolus.",
          "Morphine 2–4 mg IV for pain (use cautiously — can cause hypotension and respiratory depression).",
          "IV fluids: cautious fluid bolus (250 mL NS) — RV infarction makes the right ventricle preload-dependent. Aggressive fluids can cause pulmonary oedema.",
          "Avoid nitrates — they reduce preload and can cause catastrophic hypotension in RV infarction.",
        ],
        callout: {
          kind: "danger",
          title: "The inferior STEMI trap",
          text: "Nitroglycerin is contraindicated in inferior STEMI with RV involvement. The right ventricle is entirely preload-dependent; nitrates can cause immediate cardiovascular collapse. Always check V4R before giving nitrates in inferior STEMI.",
        },
      },
      {
        heading: "Primary PCI findings",
        body: [
          "The patient is transferred to the cath lab. Coronary angiography reveals a 100% thrombotic occlusion of the mid-RCA. The left coronary system shows minor disease.",
        ],
        steps: [
          "Wire the occlusion with a 0.014-inch guidewire.",
          "Aspirate thrombus with an export catheter.",
          "Predilate with a 2.0 × 15 mm semi-compliant balloon.",
          "Deploy a 3.0 × 28 mm drug-eluting stent (DES) at 12 atm.",
          "Post-dilate with a 3.5 × 12 mm non-compliant balloon at 16 atm for optimal expansion.",
          "Final angiogram: TIMI 3 flow, no residual stenosis, no dissection.",
        ],
      },
      {
        heading: "Post-PCI care and recovery",
        bullets: [
          "CCU monitoring: continuous telemetry, hourly vitals, daily troponin trending.",
          "Dual antiplatelet therapy (DAPT): aspirin 75 mg lifelong + ticagrelor 90 mg BD for 12 months.",
          "Start beta-blocker (metoprolol) within 24 hours if haemodynamically stable.",
          "Start ACE inhibitor (ramipril) for LV protection.",
          "Statin (atorvastatin 80 mg) for plaque stabilisation.",
          "Echocardiography at 48 hours: inferior wall hypokinesis confirmed, EF 45%.",
          "Cardiac rehabilitation referral before discharge.",
        ],
      },
      {
        heading: "Clinical pearls from this case",
        bullets: [
          "Door-to-ECG: < 10 minutes. Door-to-balloon: < 90 minutes. These time targets save myocardium.",
          "Inferior STEMI? Always check V4R for RV involvement before giving nitrates.",
          "RV infarction = preload-dependent heart. Fluids help; nitrates hurt.",
          "DAPT compliance is the single biggest modifiable risk factor for stent thrombosis.",
          "Diabetic patients often have delayed presentation and atypical symptoms — a high index of suspicion is crucial.",
        ],
      },
    ],
    keyPoints: [
      "ECG within 10 minutes — ST elevation in inferior leads + V4R = inferior STEMI with RV involvement.",
      "No nitrates in RV infarction — preload dependence causes catastrophic hypotension.",
      "Primary PCI: wire, aspirate, predilate, DES, post-dilate. TIMI 3 flow is the goal.",
      "DAPT, beta-blocker, ACE inhibitor, statin, and cardiac rehab are the evidence-based bundle.",
    ],
    whenToCall: [
      "Any STEMI: activate the cath lab immediately — door-to-balloon < 90 minutes.",
      "Hypotension in inferior STEMI: stop nitrates, give fluid bolus, check for RV involvement.",
    ],
  },

  {
    slug: "sepsis-case-study",
    title: "Sepsis Recognition: A Clinical Case Study",
    emoji: "🔬",
    category: "Clinical Case Studies",
    summary:
      "A 72-year-old woman presents with confusion and a fever. Through this case, learn to recognise the subtle signs of sepsis, apply the qSOFA and SOFA scores, and execute the Surviving Sepsis Campaign hour-1 bundle.",
    readMinutes: 7,
    sections: [
      {
        heading: "The presentation",
        body: [
          "Mrs. T, a 72-year-old woman with COPD and type 2 diabetes, is brought in by her daughter who says 'she's just not herself.' The patient has been increasingly confused over the past 12 hours. She had a fever at home (38.9°C) and has been refusing food.",
          "Vitals: BP 88/52 mmHg, HR 118 bpm (regular), RR 24/min, SpO₂ 91% on room air, temperature 39.2°C, GCS 13 (E3 V4 M6).",
        ],
      },
      {
        heading: "Recognising sepsis: qSOFA and SOFA",
        body: [
          "Sepsis is life-threatening organ dysfunction caused by a dysregulated host response to infection. Early recognition is the difference between survival and death.",
        ],
        bullets: [
          "qSOFA (quick SOFA — bedside screening): altered mentation (GCS < 15) ✓, RR ≥ 22 ✓, SBP ≤ 100 mmHg ✓. Score 2/3 = high suspicion for sepsis.",
          "SOFA (Sequential Organ Failure Assessment): a more detailed scoring system assessing PaO₂/FiO₂, platelets, bilirubin, MAP/vasopressors, GCS, and creatinine. A ΔSOFA ≥ 2 = sepsis.",
          "Mrs. T's qSOFA: 3/3. This is sepsis until proven otherwise.",
        ],
      },
      {
        heading: "The hour-1 bundle (Surviving Sepsis Campaign 2021)",
        body: [
          "The hour-1 bundle mandates that the following interventions be initiated within 60 minutes of sepsis recognition. Every hour of delay increases mortality by approximately 4–8%.",
        ],
        steps: [
          "Measure lactate level. Re-measure within 2–4 hours if initially > 2 mmol/L. Lactate > 4 mmol/L = severe sepsis.",
          "Obtain blood cultures (at least 2 sets, different sites) BEFORE antibiotics — but do not delay antibiotics for cultures if obtaining them would cause > 45 min delay.",
          "Administer broad-spectrum IV antibiotics. Empiric choice: piperacillin-tazobactam or meropenem (for suspected intra-abdominal or healthcare-associated infection). Add vancomycin if MRSA risk.",
          "Begin rapid IV crystalloid (30 mL/kg) for hypotension or lactate ≥ 4 mmol/L. Use balanced solutions (Ringer's lactate) over normal saline when possible.",
          "Start vasopressors (noradrenaline) if MAP < 65 mmHg despite fluid resuscitation. Target MAP ≥ 65 mmHg.",
        ],
        callout: {
          kind: "danger",
          title: "The lactate trap",
          text: "A 'normal' lactate (≤ 2 mmol/L) does not exclude sepsis — elderly patients, those on beta-blockers, and those with liver disease may have blunted lactate responses. A rising lactate is more alarming than an absolute value. If clinical suspicion is high, treat regardless of lactate.",
        },
      },
      {
        heading: "Mrs. T's management",
        steps: [
          "Blood cultures drawn from both antecubital fossae.",
          "Lactate: 4.8 mmol/L — severe sepsis.",
          "Meropenem 1 g IV + vancomycin 1 g IV (empiric — awaiting culture results).",
          "30 mL/kg Ringer's lactate initiated (2.1 L for her 70 kg weight).",
          "Noradrenaline infusion started at 0.1 mcg/kg/min to maintain MAP ≥ 65 mmHg.",
          "Source control: urine culture reveals E. coli > 10⁵ CFU/mL — a urinary tract infection. Foley catheter placed for drainage.",
          "Repeat lactate at 4 hours: 2.1 mmol/L — trending down. Good response.",
        ],
      },
      {
        heading: "Post-resuscitation and ICU transfer",
        bullets: [
          "Transfer to ICU for ongoing monitoring and organ support.",
          "De-escalation of antibiotics when sensitivities return (Day 2: switch to ciprofloxacin + nitrofurantoin).",
          "Fluid balance: net negative after initial resuscitation — avoid fluid overload.",
          "Daily SOFA scoring to track organ function recovery.",
          "Glucose control: target 7.8–10 mmol/L (insulin infusion if needed).",
          "DVT prophylaxis (LMWH) and stress ulcer prophylaxis (PPI).",
          "Mrs. T was extubated on Day 3 and discharged to the ward on Day 5. Final diagnosis: urosepsis with transient AKI.",
        ],
      },
    ],
    keyPoints: [
      "qSOFA ≥ 2 at bedside: altered mentation, RR ≥ 22, SBP ≤ 100 — suspect sepsis.",
      "Hour-1 bundle: lactate, cultures, antibiotics, fluids, vasopressors — within 60 minutes.",
      "Lactate > 4 mmol/L = severe sepsis. Rising lactate = worsening. Falling lactate = responding.",
      "Source control is as important as antibiotics — find and treat the source.",
    ],
    whenToCall: [
      "Any patient with suspected sepsis and qSOFA ≥ 2 — activate sepsis protocol immediately.",
      "Lactate > 4 mmol/L or MAP < 65 despite fluids — ICU transfer for vasopressor support.",
    ],
  },

  // ---- Medical News & Updates ----

  {
    slug: "ai-medical-imaging",
    title: "AI in Medical Imaging: Current Applications",
    emoji: "🤖",
    category: "Medical News & Updates",
    summary:
      "Artificial intelligence is transforming radiology, pathology, and dermatology. Explore the FDA-cleared AI tools that are already in clinical use, the evidence behind them, and the limitations every clinician should understand.",
    readMinutes: 6,
    sections: [
      {
        heading: "The landscape of AI in healthcare",
        bullets: [
          "Over 500 AI/ML-enabled medical devices have received FDA clearance as of 2024, with radiology accounting for ~75% of approvals.",
          "AI in medicine is not a future concept — it is a present clinical tool, already improving diagnostic accuracy, reducing workload, and enabling earlier disease detection.",
          "The key distinction: AI augments clinician decision-making. It does not replace it. Every AI output requires clinical interpretation.",
        ],
      },
      {
        heading: "Radiology: the leading edge",
        body: [
          "Radiology has the highest concentration of FDA-cleared AI tools. These systems analyse medical images (X-rays, CTs, MRIs) to detect abnormalities, often with sensitivity matching or exceeding human radiologists.",
        ],
        bullets: [
          "Chest X-ray AI: Tools like Lunit INSIGHT CXR detect 14+ thoracic abnormalities (pneumothorax, pleural effusion, cardiomegaly, pulmonary nodules) with AUC > 0.95. Integrated into PACS as a 'second reader.'",
          "Mammography AI: Systems like Transpara (ScreenPoint Medical) classify mammograms into risk scores (1–10), reducing recall rates by up to 25% while maintaining cancer detection rates.",
          "Head CT AI: Viz.ai automatically detects large vessel occlusion (LVO) strokes and alerts the neurointerventional team, reducing door-to-groin time by 30+ minutes.",
          "CT pulmonary angiography AI: Aidoc detects pulmonary embolism and flags studies for immediate radiologist review, reducing time to diagnosis.",
        ],
      },
      {
        heading: "Pathology and dermatology",
        bullets: [
          "Digital pathology AI: Paige AI (FDA-cleared) detects prostate cancer in needle biopsies with AUC 0.98. Pathologists use it as a screening tool to prioritise cases.",
          "Dermatology AI: SkinVision and DermaSensor help primary care clinicians triage suspicious skin lesions, reducing unnecessary referrals while maintaining sensitivity for melanoma.",
          "Retinal screening AI: IDx-DR (now Digital Diagnostics) was the first FDA-cleared autonomous AI diagnostic — it detects diabetic retinopathy without a clinician interpreting the image, enabling screening in primary care.",
        ],
      },
      {
        heading: "Limitations and ethical considerations",
        bullets: [
          "Bias: AI trained predominantly on one demographic may perform poorly on others. Skin lesion AI trained on lighter skin has lower sensitivity for melanoma on darker skin.",
          "Explainability: many deep learning models are 'black boxes' — they give outputs without reasoning, making it hard for clinicians to understand why a decision was made.",
          "Regulation: FDA clearance evaluates specific intended uses. Off-label use of AI tools is not validated.",
          "Clinical validation: real-world performance often lags behind published trial results. External validation studies are essential before clinical deployment.",
          "Medicolegal liability: if an AI tool misses a diagnosis, who is responsible — the clinician, the hospital, or the AI developer? This remains an evolving legal landscape.",
        ],
        callout: {
          kind: "tip",
          title: "The 'AI-assisted, not AI-dependent' principle",
          text: "AI tools should be treated like a highly sensitive screening test — they flag abnormalities for human review. They are not a substitute for clinical judgement, and they should never be the sole basis for a treatment decision.",
        },
      },
      {
        heading: "What this means for medical students",
        bullets: [
          "Understanding AI in medicine is no longer optional — it is becoming part of the standard curriculum at many medical schools.",
          "You will not need to code AI models, but you will need to understand their outputs, limitations, and appropriate use.",
          "Familiarise yourself with the concept of 'clinical decision support' — AI as an assistant, not a replacement.",
          "Stay informed about FDA clearances in your specialty. Knowing which AI tools are available can improve your clinical practice.",
        ],
      },
      {
        heading: "How to evaluate an AI tool clinically",
        steps: [
          "Identify the specific clinical task: screening, triage, diagnosis, or prognosis.",
          "Check the FDA/CE clearance: is the device cleared for this exact intended use?",
          "Review external validation: has it been tested on a population similar to yours?",
          "Assess integration: does it plug into your PACS or EHR, or require a separate platform?",
          "Audit performance post-deployment: track sensitivity, specificity, and false-positive rates for the first 6 months.",
          "Establish a human-in-the-loop protocol: define how AI outputs will be reviewed, documented, and communicated.",
        ],
        callout: {
          kind: "tip",
          title: "The validation checklist",
          text: "Before deploying any AI tool: (1) peer-reviewed external validation, (2) FDA/CE clearance for the intended use, (3) integration testing with your IT infrastructure, and (4) a 6-month post-deployment audit plan.",
        },
      },
    ],
    keyPoints: [
      "500+ FDA-cleared AI medical devices already exist — this is a present reality, not a future concept.",
      "Radiology leads: chest X-ray, mammography, head CT, and PE detection AI are in clinical use.",
      "AI augments — it does not replace. Every output requires clinical interpretation.",
      "Bias, explainability, and liability are the three critical limitations every clinician should understand.",
    ],
    whenToCall: [
      "AI tools are clinical decision support — they do not replace the need for clinical assessment.",
      "When using AI-assisted diagnostics, always correlate with clinical findings, history, and other investigations.",
    ],
  },

  {
    slug: "mrna-therapeutics",
    title: "mRNA Therapeutics: Beyond COVID-19 Vaccines",
    emoji: "🧬",
    category: "Medical News & Updates",
    summary:
      "The success of mRNA COVID-19 vaccines accelerated a therapeutic platform with enormous potential. Explore how mRNA technology is being applied to cancer, rare diseases, and personalised medicine.",
    readMinutes: 6,
    sections: [
      {
        heading: "The mRNA platform: how it works",
        body: [
          "mRNA therapeutics deliver synthetic messenger RNA into cells, instructing them to produce specific proteins. Unlike traditional vaccines or gene therapies, mRNA does not enter the nucleus and does not alter DNA.",
        ],
        bullets: [
          "Lipid nanoparticles (LNPs) encapsulate the mRNA and protect it from degradation.",
          "Once inside the cell, the mRNA is translated by ribosomes into the target protein.",
          "The protein is displayed on the cell surface (for vaccines) or secreted (for therapeutic proteins).",
          "The mRNA is degraded within hours — the effect is temporary and self-limiting.",
          "Key innovations: nucleoside modifications (N1-methylpseudouridine) reduce immune activation; codon optimisation increases protein yield; LNP engineering improves tissue targeting.",
        ],
      },
      {
        heading: "Oncology: the most advanced non-vaccine application",
        bullets: [
          "Personalised cancer vaccines: BioNTech's autogene cevumeran (BNT122) encodes up to 20 tumour-specific neoantigens. Phase II trial in pancreatic cancer showed 50% recurrence reduction at 18 months.",
          "Moderna's mRNA-4157 (V940) + pembrolizumab: Phase III trial (KEYNOTE-942) in melanoma showed 49% reduction in recurrence or death vs pembrolizumab alone.",
          "Mechanism: the mRNA vaccine trains the patient's immune system to recognise and attack cancer cells bearing the specific neoantigens.",
          "Intratumoral mRNA: injection directly into tumours to stimulate local immune responses (e.g., mRNA-2752 for solid tumours).",
        ],
      },
      {
        heading: "Rare diseases and protein replacement",
        bullets: [
          "Cystic fibrosis: mRNA encoding CFTR protein delivered via inhaled LNPs to the lungs. Early trials show CFTR protein expression in airway epithelial cells.",
          "Propionic acidaemia: mRNA encoding the missing enzyme (PCCB) delivered via IV LNPs. Phase I/II trials show reduced metabolic crises.",
          "Methylmalonic acidaemia: similar approach — mRNA encoding methylmalonyl-CoA mutase.",
          "Key advantage over gene therapy: mRNA is transient, so dosing can be adjusted or stopped without permanent genetic modification.",
        ],
      },
      {
        heading: "Infectious diseases beyond COVID-19",
        bullets: [
          "Influenza: Moderna's mRNA flu vaccine (mRNA-1010) showed superior haemagglutination inhibition titres vs standard flu vaccines in Phase III trials.",
          "RSV: mRNA-1345 (Moderna) showed 83.7% efficacy against RSV lower respiratory tract disease in adults ≥ 60 years.",
          "CMV: Moderna's mRNA-1647 showed 90%+ efficacy in women of childbearing age — the first CMV vaccine candidate to reach Phase III.",
          "Combination vaccines: mRNA-1083 combines COVID-19 and influenza vaccines in a single shot — Phase III results are pending.",
          "HIV, tuberculosis, malaria: early-stage mRNA vaccine candidates are in development, leveraging the platform's speed and adaptability.",
        ],
      },
      {
        heading: "Challenges and future directions",
        bullets: [
          "Cold chain: most mRNA vaccines require ultra-cold storage (–20°C to –80°C), limiting distribution in low-resource settings. Thermostable formulations are in development.",
          "Repeat dosing: mRNA's transient nature means boosters are required. For chronic diseases, this is a logistical challenge.",
          "Immune tolerance: repeated mRNA administration may trigger anti-drug antibodies that reduce efficacy over time.",
          "Tissue targeting: current LNPs primarily target the liver. Targeting other organs (lungs, brain, muscle) is an active area of research.",
          "Cost: mRNA manufacturing is faster and more scalable than traditional biologics, but current per-dose costs remain high for many applications.",
        ],
        callout: {
          kind: "tip",
          title: "The platform advantage",
          text: "The same manufacturing process that produced a COVID-19 vaccine in 11 months can theoretically produce a cancer vaccine in weeks. mRNA's 'plug-and-play' nature — where only the genetic sequence changes — makes it the most adaptable therapeutic platform in modern medicine.",
        },
      },
      {
        heading: "How to evaluate mRNA therapeutics in trials",
        steps: [
          "Identify the target antigen or protein: what is the mRNA encoding, and is it a validated therapeutic target?",
          "Review the LNP delivery system: which lipid nanoparticle formulation is used, and which tissue does it target?",
          "Assess immunogenicity: does the therapeutic elicit neutralising antibodies, T-cell responses, or both?",
          "Evaluate safety: monitor for injection-site reactions, fever, myalgia, and rare events (myocarditis, anaphylaxis).",
          "Consider manufacturing scalability: can the mRNA and LNP components be produced at scale with consistent quality?",
          "Compare against standard of care: does the mRNA therapeutic offer a clinically meaningful advantage over existing treatments?",
        ],
      },
    ],
    keyPoints: [
      "mRNA instructs cells to produce specific proteins — it does not enter the nucleus or alter DNA.",
      "Personalised cancer vaccines (BioNTech, Moderna) are in Phase II/III trials with promising results.",
      "Beyond vaccines: rare disease protein replacement, combination infectious disease vaccines, and intratumoral therapy.",
      "Key challenges: cold chain, repeat dosing, immune tolerance, and tissue targeting beyond the liver.",
    ],
    whenToCall: [
      "mRNA therapeutics are largely investigational — always check clinical trial status before discussing with patients.",
      "For oncology: personalised cancer vaccines are not yet standard of care but are available in clinical trials at major cancer centres.",
    ],
  },
  // ---- Foundations (tabbed educational content, linked from Dashboard/Basics) ----

  {
    slug: "cardiac-cycle",
    title: "The Cardiac Cycle",
    emoji: "💓",
    category: "Foundations",
    summary:
      "The cardiac cycle is the sequence of events that occurs during one complete heartbeat. Understanding it is the foundation of cardiology.",
    readMinutes: 8,
    sections: [],
    keyPoints: [],
    whenToCall: [],
    tabs: [
      {
        id: "basics",
        label: "Basics",
        icon: "📖",
        sections: [
          {
            heading: "What is the cardiac cycle?",
            body: [
              "Every beat of your heart is a perfectly orchestrated event. The cardiac cycle describes the complete sequence of mechanical events that the heart goes through to pump blood.",
            ],
            steps: [
              "Atrial systole: the atria contract, pushing the last 20% of blood into the ventricles.",
              "Ventricular systole: the ventricles contract, the AV valves close (S1 sound), and blood is ejected into the aorta and pulmonary artery.",
              "Complete cardiac diastole: both chambers relax, the semilunar valves close (S2 sound), and the heart refills.",
            ],
          },
          {
            heading: "Heart sounds explained",
            body: [
              "S1 ('lub') is caused by the closure of the AV valves at the start of ventricular systole. S2 ('dub') is caused by the closure of the semilunar valves at the start of diastole.",
            ],
            bullets: [
              "S1 is best heard at the apex; S2 at the base of the heart.",
              "Murmurs indicate valve dysfunction: systolic murmurs suggest stenosis or regurgitation.",
            ],
          },
          {
            heading: "Key terms for the cardiac cycle",
            bullets: [
              "Stroke volume: the volume of blood ejected per beat (typically 70 mL).",
              "Cardiac output: stroke volume × heart rate (typically 5 L/min).",
              "Ejection fraction: the percentage of blood ejected per beat (normal 55-70%).",
            ],
          },
        ],
        keyPoints: [
          "The cardiac cycle has three main phases: atrial systole, ventricular systole, and complete diastole.",
          "Heart sounds S1 and S2 are caused by valve closures, not valve openings.",
        ],
      },
      {
        id: "in-depth",
        label: "In-Depth",
        icon: "🔬",
        sections: [
          {
            heading: "Pressure changes in the cardiac cycle",
            body: [
              "During atrial systole, atrial pressure exceeds ventricular pressure, driving the final filling phase. During ventricular systole, ventricular pressure rises sharply, closing the AV valves and opening the semilunar valves.",
            ],
            steps: [
              "Isovolumetric contraction: all valves are closed, ventricular pressure rises rapidly.",
              "Ejection phase: semilunar valves open, blood is ejected at peak velocity.",
              "Isovolumetric relaxation: all valves are closed again, pressure drops rapidly.",
            ],
          },
        ],
        keyPoints: [
          "Wiggers diagram integrates pressure, volume, ECG, and heart sounds across the cardiac cycle.",
          "Clinical relevance: murmurs indicate valve dysfunction — systolic murmurs suggest stenosis or regurgitation.",
        ],
      },
    ],
  },

  {
    slug: "action-potential",
    title: "The Action Potential",
    emoji: "⚡",
    category: "Foundations",
    summary:
      "The action potential is the electrical signal that enables communication between neurons and muscles. It is the basis of all neural processing.",
    readMinutes: 7,
    sections: [],
    keyPoints: [],
    whenToCall: [],
    tabs: [
      {
        id: "basics",
        label: "Basics",
        icon: "📖",
        sections: [
          {
            heading: "What is an action potential?",
            body: [
              "An action potential is a rapid, temporary reversal of the electrical charge across a neuron's membrane. It is the fundamental unit of neural communication.",
            ],
            steps: [
              "Resting state: the neuron sits at -70mV, maintained by the sodium-potassium pump.",
              "Depolarisation: a stimulus opens voltage-gated Na+ channels, Na+ rushes in, and the membrane potential rises to about +30mV.",
              "Repolarisation: Na+ channels close, K+ channels open, and K+ flows out, bringing the potential back down.",
              "Hyperpolarisation: the membrane briefly dips below -70mV before returning to rest.",
            ],
          },
        ],
        keyPoints: [
          "The all-or-nothing principle: once threshold (-55mV) is reached, the action potential fires at full amplitude or not at all.",
          "Myelin sheaths and nodes of Ranvier enable saltatory conduction, speeding signals up to 100x.",
        ],
      },
      {
        id: "in-depth",
        label: "In-Depth",
        icon: "🔬",
        sections: [
          {
            heading: "Ion channel dynamics",
            body: [
              "Voltage-gated sodium channels have activation and inactivation gates. The inactivation gate creates the absolute refractory period, during which no new action potential can fire.",
            ],
            steps: [
              "Phase 0: rapid Na+ influx through voltage-gated channels (depolarisation).",
              "Phase 1: transient K+ efflux through Ito channels (early repolarisation).",
              "Phase 2: plateau phase — Ca2+ influx balances K+ efflux (cardiac-specific).",
              "Phase 3: delayed K+ efflux repolarises the membrane.",
              "Phase 4: resting potential maintained by Na+/K+ ATPase and leak channels.",
            ],
          },
        ],
        keyPoints: [
          "Local anaesthetics (lidocaine) block voltage-gated Na+ channels, preventing pain signal transmission.",
          "Clinical relevance: channelopathies (e.g., Long QT syndrome) cause dangerous arrhythmias.",
        ],
      },
    ],
  },

  {
    slug: "brachial-plexus",
    title: "The Brachial Plexus",
    emoji: "🦾",
    category: "Foundations",
    summary:
      "The brachial plexus is the network of nerves sending signals from the spine to the shoulder, arm, and hand. Understanding it is essential for neurology and orthopaedics.",
    readMinutes: 7,
    sections: [],
    keyPoints: [],
    whenToCall: [],
    tabs: [
      {
        id: "basics",
        label: "Basics",
        icon: "📖",
        sections: [
          {
            heading: "What is the brachial plexus?",
            body: [
              "The brachial plexus is a network of five nerve roots (C5-T1) that combine and reorganise to form the major nerves of the upper limb.",
            ],
            steps: [
              "Roots (C5-T1) emerge from the spinal cord.",
              "Trunks: upper (C5-C6), middle (C7), and lower (C8-T1) trunks form.",
              "Divisions: each trunk splits into anterior and posterior divisions.",
              "Cords: lateral, posterior, and medial cords form from the divisions.",
              "Branches: the five terminal branches emerge — musculocutaneous, axillary, radial, median, and ulnar.",
            ],
          },
        ],
        keyPoints: [
          "The R-T-D-C-B pathway: Roots → Trunks → Divisions → Cords → Branches.",
          "Erb's palsy (C5-C6 injury) causes waiter's tip posture; Klumpke's palsy (C8-T1) causes claw hand.",
        ],
      },
      {
        id: "in-depth",
        label: "In-Depth",
        icon: "🔬",
        sections: [
          {
            heading: "Terminal branches and their territories",
            body: [
              "Each terminal branch innervates specific muscles and provides sensation to specific dermatomes. Knowledge of these territories is essential for localising lesions.",
            ],
            steps: [
              "Musculocutaneous nerve (C5-C7): biceps, brachialis, lateral forearm sensation.",
              "Axillary nerve (C5-C6): deltoid, teres minor, regiment badge sensation.",
              "Radial nerve (C5-T1): triceps, wrist/finger extensors, dorsal hand sensation.",
              "Median nerve (C8-T1): forearm flexors, thenar muscles, lateral 3.5 digits sensation.",
              "Ulnar nerve (C8-T1): intrinsic hand muscles, medial 1.5 digits sensation.",
            ],
          },
        ],
        keyPoints: [
          "Injury pattern recognition: C5-C6 = Erb's palsy, C8-T1 = Klumpke's palsy, whole plexus = total arm paralysis.",
          "Clinical pearl: a wrist drop with intact median nerve function localises the lesion to the radial nerve.",
        ],
      },
    ],
  },

  {
    slug: "krebs-cycle",
    title: "The Krebs (TCA) Cycle",
    emoji: "🔄",
    category: "Foundations",
    summary:
      "The Krebs cycle is the engine of the cell, happening in the mitochondria to produce energy (ATP). It is the central metabolic hub of aerobic respiration.",
    readMinutes: 7,
    sections: [],
    keyPoints: [],
    whenToCall: [],
    tabs: [
      {
        id: "basics",
        label: "Basics",
        icon: "📖",
        sections: [
          {
            heading: "What is the Krebs cycle?",
            body: [
              "The Krebs cycle (also called the citric acid cycle or TCA cycle) is a series of eight enzymatic reactions that oxidise acetyl-CoA to produce NADH, FADH2, and GTP. It occurs in the mitochondrial matrix.",
            ],
            steps: [
              "Acetyl-CoA enters the cycle and combines with oxaloacetate to form citrate (catalysed by citrate synthase).",
              "Citrate is converted to isocitrate via aconitase.",
              "Isocitrate is oxidised to alpha-ketoglutarate, producing NADH and CO2.",
              "Alpha-ketoglutarate is converted to succinyl-CoA, producing another NADH and CO2.",
              "Succinyl-CoA → succinate → fumarate → malate → oxaloacetate, completing the cycle.",
            ],
          },
        ],
        keyPoints: [
          "Per turn: 3 NADH, 1 FADH2, 1 GTP (≈ ATP), 2 CO2. Per glucose: two turns (one per acetyl-CoA).",
          "The cycle is amphibolic — it catabolises fuels and provides precursors for biosynthesis.",
        ],
      },
      {
        id: "in-depth",
        label: "In-Depth",
        icon: "🔬",
        sections: [
          {
            heading: "Regulation and clinical relevance",
            body: [
              "The Krebs cycle is regulated by substrate availability, product inhibition, and allosteric control. Key regulatory enzymes include citrate synthase, isocitrate dehydrogenase, and alpha-ketoglutarate dehydrogenase.",
            ],
            steps: [
              "High NADH/NAD+ ratio slows the cycle (product inhibition of isocitrate dehydrogenase).",
              "High ATP/ADP ratio inhibits isocitrate dehydrogenase and alpha-ketoglutarate dehydrogenase.",
              "Calcium ions activate isocitrate dehydrogenase and alpha-ketoglutarate dehydrogenase.",
              "Thiamine (B1) deficiency impairs alpha-ketoglutarate dehydrogenase → beriberi and Wernicke encephalopathy.",
            ],
          },
        ],
        keyPoints: [
          "Arsenic poisoning inhibits alpha-ketoglutarate dehydrogenase and pyruvate dehydrogenase.",
          "IDH mutations in gliomas produce 2-hydroxyglutarate — an oncometabolite.",
        ],
      },
    ],
  },

  {
    slug: "muscle-contraction",
    title: "Muscle Contraction",
    emoji: "💪",
    category: "Foundations",
    summary:
      "Muscle contraction follows the sliding filament theory — actin and myosin filaments slide past each other to generate force. Calcium and ATP are the key regulators.",
    readMinutes: 7,
    sections: [],
    keyPoints: [],
    whenToCall: [],
    tabs: [
      {
        id: "basics",
        label: "Basics",
        icon: "📖",
        sections: [
          {
            heading: "How muscles contract",
            body: [
              "Muscle contraction occurs when myosin heads bind to actin filaments and pull them toward the centre of the sarcomere, shortening the muscle fiber. This is the sliding filament theory.",
            ],
            steps: [
              "A nerve impulse arrives at the neuromuscular junction, releasing acetylcholine.",
              "Acetylcholine triggers an action potential along the muscle fiber membrane.",
              "Calcium is released from the sarcoplasmic reticulum.",
              "Calcium binds to troponin, moving tropomyosin and exposing myosin-binding sites on actin.",
              "Myosin heads attach to actin, pivot (power stroke), and pull the actin filament inward.",
              "ATP binds to myosin, causing detachment. The cycle repeats as long as calcium and ATP are present.",
            ],
          },
        ],
        keyPoints: [
          "Actin = thin filament. Myosin = thick filament. Sarcomere = the functional unit of contraction.",
          "Troponin and tropomyosin regulate contraction by controlling access to myosin-binding sites.",
        ],
      },
      {
        id: "in-depth",
        label: "In-Depth",
        icon: "🔬",
        sections: [
          {
            heading: "Excitation-contraction coupling",
            body: [
              "Excitation-contraction coupling is the process by which an electrical signal (action potential) is converted into mechanical contraction. It involves the neuromuscular junction, T-tubules, and the sarcoplasmic reticulum.",
            ],
            steps: [
              "Action potential travels along the sarcolemma and into T-tubules.",
              "Voltage-gated dihydropyridine (DHPR) receptors in the T-tubule membrane activate ryanodine receptors (RyR) in the sarcoplasmic reticulum.",
              "RyR channels open, releasing Ca2+ into the cytoplasm.",
              "Ca2+ binds troponin C, initiating the cross-bridge cycle.",
              "Relaxation: Ca2+ is pumped back into the sarcoplasmic reticulum by SERCA (Ca2+-ATPase).",
            ],
          },
        ],
        keyPoints: [
          "Rigor mortis: after death, ATP depletion prevents myosin detachment → sustained contraction.",
          "Myasthenia gravis: autoantibodies against acetylcholine receptors → muscle weakness and fatigue.",
        ],
      },
    ],
  },

  // ---- Surgical Procedures ----

  {
    slug: "appendectomy",
    title: "Appendectomy: Open vs. Laparoscopic Techniques",
    emoji: "🔪",
    category: "Surgical Procedures",
    summary:
      "Appendectomy remains one of the most commonly performed emergency abdominal surgeries worldwide. This article reviews the indications, operative technique for both open and laparoscopic approaches, complication management, and current evidence comparing outcomes.",
    readMinutes: 12,
    sections: [
      {
        heading: "Abstract",
        body: [
          "Acute appendicitis affects approximately 7–8% of the population during their lifetime and is the most common cause of emergency abdominal surgery. Appendectomy — whether open or laparoscopic — is the definitive treatment. Over the past two decades, laparoscopic appendectomy (LA) has become the preferred approach in most centres due to reduced post-operative pain, shorter hospital stay, lower wound infection rates, and superior cosmetic outcomes. However, open appendectomy (OA) remains an essential skill, particularly in resource-limited settings, complicated presentations (perforated appendix with abscess), and when laparoscopic expertise is unavailable.",
          "Recent meta-analyses (2023–2024) confirm that LA is associated with a 30% reduction in overall recovery time, a 50% reduction in surgical site infections, and comparable rates of intra-abdominal abscess formation when compared with OA. Antibiotic-first strategies (non-operative management) have emerged as an alternative for uncomplicated appendicitis in select patients, with a 2024 Cochrane review reporting a 70% success rate at 5 years — though recurrence rates of 30–40% remain a significant concern.",
        ],
      },
      {
        heading: "Indications",
        bullets: [
          "Acute uncomplicated appendicitis: appendectomy is the gold-standard treatment. LA is preferred where expertise and equipment are available.",
          "Complicated appendicitis (perforated, gangrenous, or appendiceal phlegmon/abscess): appendectomy is mandatory. Timing depends on clinical stability — immediate for peritonitis, interval (6–8 weeks) for well-defined abscess managed with antibiotics and drainage.",
          "Appendiceal tumour (carcinoid < 1 cm, mucinous neoplasm): appendectomy is curative for tumours < 1 cm at the tip. Right hemicolectomy is indicated for tumours > 2 cm, at the base, or with lymphovascular invasion.",
          "Appendicitis in pregnancy: LA is safe in all trimesters and is now recommended over OA. The risk of fetal loss from OA is approximately 3–5% higher than LA.",
        ],
      },
      {
        heading: "Contraindications",
        bullets: [
          "Haemodynamic instability with diffuse peritonitis: resuscitate first, then operate. Damage-control surgery (drainage + lavage without appendectomy) may be needed in critically ill patients.",
          "Phlegmon without abscess: conservative management with IV antibiotics. Appendectomy is deferred to an interval procedure at 6–8 weeks (after imaging confirms resolution).",
          "Antibiotic-first strategy (non-operative): suitable for uncomplicated appendicitis in patients who decline surgery or have significant comorbidities. Requires shared decision-making and a clear follow-up plan.",
          "General contraindications to GA: relative — laparoscopic approach can be performed under regional anaesthesia in exceptional circumstances.",
        ],
      },
      {
        heading: "Laparoscopic Appendectomy — Operative Technique",
        body: [
          "The laparoscopic approach is now the standard of care in most high-resource settings. The technique described here is the 3-port method used in the majority of cases.",
        ],
        steps: [
          "Positioning: supine with reverse Trendelenburg and left tilt. Surgeon stands on the patient's left. Assistant holds the camera from the patient's left side.",
          "Port placement: 10 mm umbilical port (camera) via open (Hasson) technique. 10 mm epigastric port (surgeon's working hand). 5 mm left iliac fossa port (assistant/grasper).",
          "Diagnostic laparoscopy: survey the abdomen to confirm the diagnosis and exclude other pathology (Meckel's diverticulum, ovarian pathology, Crohn's disease).",
          "Identify the appendix: grasp the tip of the appendix with the left-hand grasper and retract medially. This exposes the mesoappendix and the base.",
          "Mesoappendix dissection: identify the appendicular artery within the mesoappendix. Use an energy device (bipolar diathermy or harmonic scalpel) to divide the mesoappendix from tip to base. In cases of mesenteric thickness, endoscopic clips or an endoloop may be used.",
          "Stapling the base: apply an endoscopic GIA stapler (with load for thick tissue) across the base of the appendix, 5–8 mm from the caecal wall. Ensure the staple line is perpendicular to the taenia to avoid leaving a long appendiceal stump.",
          "Alternative stump closure: if a stapler is unavailable, apply 2–3 endoloops (Roeder knots) at the base, transect between the first and second loops. This is the preferred technique in low-resource settings.",
          "Retrieval: place the appendix in an endoscopic retrieval bag to prevent port-site contamination. Extract through the 10 mm port site. Do NOT extract without a bag if the appendix is gangrenous or perforated.",
          "Irrigation and haemostasis: copious irrigation of the right iliac fossa with warm saline. Inspect the staple/loop line for haemostasis. Check the mesoappendix stump.",
          "Fascial closure: close all 10 mm port sites with absorbable suture to prevent port-site hernia. Skin closure with subcuticular sutures or skin glue.",
        ],
        callout: {
          kind: "warning",
          title: "Always identify the base first",
          text: "In difficult cases (retrocaecal appendix, severe inflammation), do not hesitate to extend the epigastric port incision or convert to open. Dissecting the base first — rather than the tip — is the single most important step to avoid caecal injury.",
        },
      },
      {
        heading: "Open Appendectomy — Operative Technique",
        body: [
          "Open appendectomy is performed through a McBurney's (grid-iron) incision or a Lanz (transverse) incision in the right iliac fossa. It remains the approach of choice in complicated cases with dense adhesions, in resource-limited settings, and when laparoscopic conversion is needed.",
        ],
        steps: [
          "Incision: McBurney's (oblique, centred on the point one-third of the way from the anterior superior iliac spine to the umbilicus) or Lanz (transverse skin crease incision).",
          "Muscle splitting: split the external oblique, internal oblique, and transversus abdominis along their fibre directions. Do NOT cut muscle fibres.",
          "Identify the appendix: follow the taenia coli caecally — all three taeniae converge at the base of the appendix. If the appendix is retrocaecal, mobilise the caecum by incising the lateral peritoneal fold (Toldt's fascia).",
          "Mesenteric division: ligate the appendicular artery with 2-0 Vicryl or clips. Divide the mesoappendix.",
          "Base ligation: place a 2-0 Vicryl or silk ligature around the base of the appendix, 5 mm from the caecal wall. Transect the appendix distal to the ligature.",
          "Stump invagination (Z-stitch): some surgeons invaginate the appendiceal stump into the caecum with a purse-string (Z-stitch) suture. Evidence for this practice is mixed — it is optional and surgeon preference.",
          "Haemostasis and irrigation: check the mesoappendix stump for bleeding. Irrigate the right iliac fossa.",
          "Closure: close the peritoneum with a continuous 3-0 Vicryl. Close the muscle layers with interrupted 3-0 Vicryl. Close the external oblique with continuous 3-0 Vicryl. Skin: subcuticular or staples.",
        ],
      },
      {
        heading: "Complications and Management",
        bullets: [
          "Port-site wound infection (LA): 1–3% — significantly lower than OA (5–10%). Treat with oral antibiotics. Superficial SSI does not require re-operation.",
          "Intra-abdominal abscess (IAA): occurs in 2–5% of complicated appendicitis. CT-guided percutaneous drainage + IV antibiotics is the first-line treatment. Re-operation is reserved for multiloculated or inaccessible collections.",
          "Appendiceal stump leak: rare (< 1%) with stapler closure, slightly more common with endoloop technique. Presents as post-operative fever, ileus, and right iliac fossa pain on day 3–5. CT with oral contrast confirms. Management: nil by mouth, IV antibiotics, and percutaneous drainage if abscess forms.",
          "Post-appendectomy ileus: more common after OA and complicated appendicitis. Management: nasogastric decompression, IV fluids, and prokinetic agents (erythromycin or metoclopramide).",
          "Haemorrhage: early post-op bleeding from the mesoappendix stump is rare but serious. Return to theatre for haemostasis if haemodynamically significant.",
          "Incisional hernia: occurs in 1–3% of OA cases. Risk reduced by meticulous fascial closure and avoidance of vertical incisions.",
          "Stump appendicitis: incomplete appendectomy leaving a stump > 5 mm can lead to recurrent inflammation. Prevention: staple/ligate close to the caecal wall, leaving no more than 5 mm of stump.",
        ],
        callout: {
          kind: "danger",
          title: "The 30% recurrence trap in antibiotic-first management",
          text: "Non-operative management of appendicitis with antibiotics alone carries a 30–40% recurrence rate within 5 years (APPAC trial, 2024 Cochrane review). Patients must be counselled about this risk and have a clear plan for re-presentation. Recurrent appendicitis after antibiotic-first treatment is more likely to be complicated (perforated).",
        },
      },
      {
        heading: "Recent Evidence and Literature",
        bullets: [
          "APPAC II Trial (2024): 5-year follow-up of the original APPAC cohort. Antibiotic-first strategy achieved clinical success in 70% of patients. The 30% who underwent appendectomy had similar outcomes to primary appendectomy — but recurrence was associated with a higher rate of complicated appendicitis.",
          "Cochrane Systematic Review (2024): Meta-analysis of 9 RCTs (n = 1,870). LA vs OA: LA had 30% shorter hospital stay, 50% fewer wound infections, comparable IAA rates, and equivalent negative appendectomy rates (~15%). Conclusion: LA should be offered as first-line where expertise exists.",
          "JAMA Surgery Meta-Analysis (2023): Laparoscopic vs open appendectomy in pregnant patients (n = 4,200). LA was associated with significantly lower fetal loss rates (1.2% vs 3.8%), shorter operative time, and fewer wound complications. Recommendation: LA is safe and preferred in all trimesters.",
          "SAGES Guidelines (2023): Reinforced that LA is the gold standard for uncomplicated appendicitis. Recommended endoscopic stapler for stump closure in adults, with endoloop as an acceptable alternative. Emphasised retrieval bag use for all specimens.",
          "International Consensus on Antibiotic-First (2024): For uncomplicated appendicitis, a short course of IV antibiotics (24–48 hours) followed by oral antibiotics to complete 7 days is non-inferior to appendectomy at 1 year, but 30% undergo surgery within 5 years.",
        ],
      },
      {
        heading: "Pro-Tips from Surgeons",
        bullets: [
          "Always identify the base of the appendix first — in a difficult, inflamed, or retrocaecal appendix, the base is the most reliable landmark. Follow the taenia coli caecally.",
          "Use an endoloop for secure stump closure when a stapler is unavailable. Three loops are safer than two — ligate proximal, ligate distal, and transect between.",
          "Do not extract a gangrenous or perforated appendix without an endoscopic retrieval bag. Spillage of infected material into the port track causes port-site infection or abscess.",
          "In retrocaecal appendicitis, mobilise the caecum by incising the white line of Toldt laterally. This gives direct access without excessive retraction.",
          "For the base stump: leave no more than 5 mm. A long stump (> 1 cm) is the single most common cause of stump appendicitis — a preventable complication.",
          "In pregnancy, place the ports in the left upper quadrant if the gravid uterus displaces the caecum superiorly. Avoid insufflation pressures > 12 mmHg.",
          "When converting from LA to OA, make the McBurney's incision directly over the inflammatory mass identified laparoscopically — do not go back to the standard position.",
          "Negative appendectomy rate should be < 15%. If you are removing normal-looking appendices routinely, reconsider your diagnostic criteria (Alvarado score, CT/MRI).",
        ],
      },
    ],
    keyPoints: [
      "LA is the gold standard for uncomplicated appendicitis — 30% shorter stay, 50% fewer wound infections vs OA.",
      "Antibiotic-first strategy is an option for uncomplicated appendicitis but carries 30–40% recurrence at 5 years.",
      "Staple/ligate the base no more than 5 mm from the caecal wall to prevent stump appendicitis.",
      "Always use a retrieval bag for gangrenous/perforated specimens to prevent port-site contamination.",
      "Complicated appendicitis with phlegmon: manage with IV antibiotics first, interval appendectomy at 6–8 weeks.",
    ],
    whenToCall: [
      "Haemodynamic instability with diffuse peritonitis: resuscitate, then operate. Consider damage-control surgery.",
      "Post-operative fever with rising WBC on day 3–5: think intra-abdominal abscess or stump leak. CT with oral contrast.",
      "CT-confirmed abscess > 3 cm: interventional radiology for percutaneous drainage. Do not delay for IV antibiotics alone.",
    ],
  },
  // ---- Critical Care & Emergencies ----

  {
    slug: "surviving-sepsis-bundle",
    title: "Surviving Sepsis Campaign: The 1-Hour Bundle",
    emoji: "🚨",
    category: "Critical Care & Emergencies",
    summary:
      "Every hour of delay in sepsis treatment increases mortality by 4–8%. This quick-reference guide covers the Sepsis-3 definitions, the 1-hour bundle, vasopressor selection, fluid resuscitation controversies, and the pitfalls that kill patients. Designed for ER and ICU physicians.",
    readMinutes: 10,
    sections: [
      {
        heading: "Sepsis-3 Definitions (2016, still current)",
        body: [
          "Sepsis-3 replaced the older SIRS-based definitions with a framework grounded in organ dysfunction. Understanding these definitions is the first step in recognising and treating sepsis.",
        ],
        bullets: [
          "Sepsis: life-threatening organ dysfunction caused by a dysregulated host response to infection. Defined as a suspected or confirmed infection with an acute increase in SOFA score ≥ 2 points.",
          "Septic shock: a subset of sepsis with circulatory, cellular, and metabolic dysfunction associated with a higher risk of mortality. Defined as sepsis requiring vasopressors to maintain MAP ≥ 65 mmHg AND serum lactate > 2 mmol/L despite adequate fluid resuscitation.",
          "qSOFA (quick SOFA) — bedside screening tool: altered mentation (GCS < 15), RR ≥ 22, SBP ≤ 100 mmHg. Score ≥ 2 = high clinical suspicion for sepsis. NOT a diagnostic tool — it is a screening trigger for further assessment.",
          "SOFA score: a 6-point organ-dysfunction score (respiratory, coagulation, liver, cardiovascular, CNS, renal). A ΔSOFA ≥ 2 from baseline = sepsis. Requires laboratory values (PaO₂/FiO₂, platelets, bilirubin, creatinine) and clinical assessment (GCS, MAP/vasopressors).",
          "SIRS criteria (legacy): temperature > 38°C or < 36°C, HR > 90, RR > 20, WBC > 12,000 or < 4,000. Sensitivity ~80% but specificity is poor — many non-septic conditions trigger SIRS. Sepsis-3 abandoned SIRS in favour of organ-dysfunction-based criteria.",
        ],
        callout: {
          kind: "warning",
          title: "qSOFA is a screening tool, not a diagnostic criterion",
          text: "A qSOFA score < 2 does NOT exclude sepsis. Elderly patients, those on beta-blockers, and immunosuppressed patients may not mount a fever, tachycardia, or hypotension. Clinical suspicion trumps scores. If you think sepsis, treat sepsis.",
        },
      },
      {
        heading: "The 1-Hour Bundle — Step-by-Step",
        body: [
          "The Surviving Sepsis Campaign (SSC) 2021 guidelines mandate that the following interventions be initiated within 60 minutes of sepsis recognition. The bundle is a minimum standard — initiate all five elements as rapidly as possible, ideally simultaneously.",
        ],
        steps: [
          "Step 1: Measure serum lactate. Lactate is the single most important biomarker for tissue hypoperfusion. Initial lactate > 2 mmol/L = sepsis. Lactate > 4 mmol/L = severe sepsis. Re-measure within 2–4 hours if initial > 2 mmol/L. A rising lactate indicates worsening perfusion; a falling lactate indicates response to treatment.",
          "Step 2: Obtain blood cultures BEFORE antibiotics. Draw at least 2 sets (aerobic + anaerobic) from 2 different peripheral sites. Central line blood cultures are acceptable if the line is new (< 48 h) and infection is suspected. Do NOT delay antibiotics by more than 45 minutes to obtain cultures. If obtaining cultures will delay treatment, give antibiotics first.",
          "Step 3: Administer broad-spectrum IV antibiotics. Every hour of delay increases mortality by approximately 4–8% (Kumar et al., 2006; confirmed in subsequent meta-analyses). Empiric choice must cover likely pathogens and local resistance patterns.",
          "Step 4: Begin rapid IV fluid resuscitation. Administer 30 mL/kg of isotonic crystalloid within the first 3 hours for hypotension or lactate ≥ 4 mmol/L. Use balanced crystalloids (Ringer's lactate, Plasmalyte) as first-line — they have a lower risk of hyperchloraemic metabolic acidosis compared to normal saline.",
          "Step 5: Start vasopressors if MAP < 65 mmHg despite fluid resuscitation. Norepinephrine is the first-line vasopressor. Start at 0.1 mcg/kg/min and titrate to MAP ≥ 65 mmHg. If norepinephrine reaches 0.5 mcg/kg/min, add vasopressin (0.03 U/min fixed dose) as second-line. Epinephrine is third-line for refractory shock.",
        ],
        callout: {
          kind: "danger",
          title: "The lactate paradox",
          text: "A 'normal' lactate (≤ 2 mmol/L) does not exclude sepsis. Patients on beta-blockers, those with liver disease, and well-resuscitated patients may have a normal lactate despite severe sepsis. A rising lactate is more alarming than an absolute value. If clinical suspicion is high, treat regardless of lactate level.",
        },
      },
      {
        heading: "Vasopressor Selection — A Practical Guide",
        body: [
          "Vasopressor choice in septic shock follows a stepwise approach based on response, not a fixed protocol. The goal is MAP ≥ 65 mmHg with the lowest effective dose.",
        ],
        steps: [
          "First-line: Norepinephrine (noradrenaline). Potent α1-agonist with mild β1-effect. Increases MAP via vasoconstriction without significantly increasing heart rate. Starting dose: 0.1 mcg/kg/min. Titrate by 0.02–0.05 mcg/kg/min every 5–10 minutes. Max effective dose: ~0.5 mcg/kg/min.",
          "Second-line: Vasopressin. V1-receptor agonist. Non-catecholamine — works via a different mechanism. Fixed dose: 0.03 units/min (do not titrate). Added when norepinephrine reaches 0.25–0.5 mcg/kg/min. Vasopressin-sparing: reduces norepinephrine requirement by 25–50% in about 40% of patients (VASST trial).",
          "Third-line: Epinephrine. Potent β1 + β2 + α1 agonist. Added when norepinephrine + vasopressin fail to achieve MAP ≥ 65. Starting dose: 0.01 mcg/kg/min. Caution: increases myocardial oxygen demand, may cause tachyarrhythmias, and can cause lactic acidosis (via β2-mediated aerobic lactate production — this is NOT necessarily tissue hypoperfusion).",
          "Rescue therapy: Angiotensin II (Giapreza). For refractory vasodilatory shock unresponsive to norepinephrine + vasopressin. ATHOS-3 trial: 60% achieved MAP response. Dose: 20 ng/kg/min, titrate to MAP ≥ 65.",
          "Inotropes: Dobutamine or milrinone for myocardial dysfunction (septic cardiomyopathy). Consider if cardiac output monitoring shows low cardiac index despite adequate volume and vasopressor support. Echocardiography (bedside TTE) is essential to assess cardiac function before starting inotropes.",
        ],
        callout: {
          kind: "tip",
          title: "Central line first",
          text: "Peripheral norepinephrine is safe for short-term use (< 12 hours) via a large-bore IV in the antecubital fossa, but central venous access is strongly preferred. Peripheral extravasation of norepinephrine causes tissue necrosis. Obtain a central line as soon as feasible.",
        },
      },
      {
        heading: "Fluid Resuscitation — Current Evidence and Controversies",
        bullets: [
          "30 mL/kg crystalloid: the SSC 2021 recommendation for initial resuscitation. Evidence is based on retrospective data (Seymour et al., NEJM 2017) showing lower mortality with early aggressive fluids. However, the ANDROMEDA-SHOCK trial (2019) and subsequent meta-analyses suggest that perfusion-guided fluid resuscitation (using capillary refill or lactate clearance) may be equally effective with less fluid.",
          "Balanced crystalloids vs. normal saline: the SMART trial (2018, NEJM) and SALT-ED trial (2018, NEJM) demonstrated that balanced crystalloids (Ringer's lactate, Plasmalyte) reduced major adverse kidney events by 15% compared to normal saline. SSC 2021 recommends balanced crystalloids as first-line. Normal saline is now reserved for specific indications (e.g., traumatic brain injury with suspected raised ICP).",
          "Fluid overload is harmful: the F_FLUSH trial (2023) and FEAST trials demonstrate that excessive fluid resuscitation increases mortality in sepsis. Signs of fluid overload (rising JVP, pulmonary oedema on POCUS, worsening oxygenation) should prompt cessation of fluids and consideration of diuretics or ultrafiltration.",
          "Restricted vs. liberal fluids: the CLOVERS trial (2023, NEJM) randomised 1,563 sepsis patients to liberal (> 2.5 L) vs. restricted (< 1 L) fluid strategies after initial resuscitation. No significant difference in 90-day mortality — suggesting that after the initial 30 mL/kg, further fluids should be guided by clinical response, not protocol.",
          "Point-of-care ultrasound (POCUS): the single best tool for assessing fluid responsiveness. IVC collapsibility > 50% = likely fluid-responsive. IVC distension with poor cardiac output = volume overload, stop fluids. Bedside POCUS should be used to guide every fluid bolus after the initial resuscitation.",
        ],
      },
      {
        heading: "Pitfalls to Avoid — The Deadly Mistakes",
        bullets: [
          "Don't delay antibiotics for imaging: CT, X-ray, and other imaging should NEVER delay antibiotic administration. Give antibiotics, then image. The only exception is suspected intracranial abscess where CT is needed to rule out mass effect before LP.",
          "Don't over-resuscitate with fluids: the 30 mL/kg is a STARTING POINT, not a target. After initial resuscitation, use POCUS, lactate clearance, and clinical assessment to guide further fluids. Fluid overload kills as many patients as under-resuscitation.",
          "Don't use vancomycin as empiric first-line unless MRSA risk: default empiric therapy should cover Gram-negatives and anaerobes (piperacillin-tazobactam or meropenem). Add vancomycin only if MRSA risk factors exist (recent hospitalisation, dialysis, IV drug use, known MRSA colonisation).",
          "Don't forget source control: antibiotics alone are insufficient. Every septic focus needs source control — drain the abscess, debride the necrotic tissue, remove the infected device. Source control within 6–12 hours is the standard. Delayed source control is the most common preventable cause of sepsis mortality.",
          "Don't ignore the adrenals: patients on chronic corticosteroids (> 5 mg prednisolone/day for > 3 weeks) are at risk of adrenal crisis during sepsis. Administer stress-dose hydrocortisone (200 mg/day IV, 50 mg q6h) if norepinephrine requirement is escalating. The ADRENAL and APROCCHSS trials support hydrocortisone in refractory septic shock.",
          "Don't trust a normal WBC: immunosuppressed patients (chemotherapy, HIV, transplant, biologics) may not mount a leukocytosis. A normal WBC in a febrile, hypotensive patient with suspected infection is ominous, not reassuring.",
          "Don't forget blood glucose control: target 7.8–10 mmol/L (140–180 mg/dL). Tight glucose control (4.4–6.1 mmol/L) increases hypoglycaemia risk without mortality benefit (NICE-SUGAR trial). Use insulin infusion for glucose > 10 mmol/L.",
          "Don't leave the central line in longer than necessary: catheter-related bloodstream infection (CRBSI) risk increases with each day. Remove central lines within 48–72 hours of clinical stability. Daily assessment of line necessity is mandatory.",
        ],
        callout: {
          kind: "danger",
          title: "The 1-hour clock starts at RECOGNITION, not at arrival",
          text: "The clock starts when sepsis is RECOGNISED — not when the patient arrives in the ED, not when the labs return, not when the senior clinician reviews. If a nurse recognises sepsis on the ward, the clock starts then. Every member of the team must understand this.",
        },
      },
      {
        heading: "Quick-Reference: Antibiotic Empiric Choices",
        bullets: [
          "Community-acquired sepsis (no risk factors): Piperacillin-tazobactam 4.5 g IV q6h OR Ceftriaxone 2 g IV q24h + Metronidazole 500 mg IV q8h.",
          "Hospital-acquired / healthcare-associated: Meropenem 1 g IV q8h OR Cefepime 2 g IV q8h. Add vancomycin if MRSA risk.",
          "Urinary source: Ceftriaxone 2 g IV q24h OR Pip-tazo. ESBL risk: Meropenem.",
          "Abdominal/GI source: Meropenem 1 g IV q8h OR Pip-tazo 4.5 g IV q6h. Covers Gram-negatives, anaerobes, and Pseudomonas.",
          "Skin/soft tissue (necrotising): Pip-tazo + Vancomycin + Clindamycin (for toxin suppression in GAS/necrotising fasciitis). Surgical debridement within 6 hours.",
          "Neutropenic fever: Meropenem 1 g IV q8h + Vancomycin. Add antifungal (caspofungin or voriconazole) if fever persists > 4–7 days despite broad-spectrum antibiotics.",
          "Reassess and de-escalate at 48–72 hours based on culture results. Broad-spectrum coverage is essential initially but must be narrowed to prevent resistance.",
        ],
      },
      {
        heading: "Monitoring and Endpoints of Resuscitation",
        bullets: [
          "MAP ≥ 65 mmHg (or higher in chronic hypertension — target individualised).",
          "Lactate clearance: ≥ 20% reduction per 2 hours. If lactate is not clearing, reassess source control, fluid status, and cardiac function.",
          "Urine output: ≥ 0.5 mL/kg/hr. Place a Foley catheter for continuous monitoring in all septic shock patients.",
          "Central venous O₂ saturation (ScvO₂): target ≥ 70%. A low ScvO₂ (< 70%) indicates inadequate oxygen delivery — consider more fluids, inotropes, or blood transfusion (target Hb ≥ 7 g/dL).",
          "Capillary refill: the ANDROMEDA-SHOCK trial showed that capillary-refill-guided resuscitation was non-inferior to lactate-guided resuscitation and used less fluid. Check capillary refill on the sternum or fingertip.",
          "Bedside echocardiography: assess LV and RV function, estimate cardiac output, and guide fluid/vasopressor/inotrope decisions. Every septic shock patient should have a bedside TTE within 1 hour.",
          "Serial SOFA scoring: track daily SOFA scores to assess organ-function trajectory. A declining SOFA score indicates improvement; a rising score indicates deterioration.",
        ],
      },
    ],
    keyPoints: [
      "Sepsis-3: sepsis = infection + ΔSOFA ≥ 2. Septic shock = sepsis + vasopressors + lactate > 2 mmol/L.",
      "1-Hour Bundle: lactate, cultures, antibiotics, fluids, vasopressors — all within 60 minutes of recognition.",
      "Norepinephrine first-line. Add vasopressin at 0.25–0.5 mcg/kg/min. Epinephrine third-line.",
      "Balanced crystalloids > normal saline. 30 mL/kg is a starting point, not a target. Use POCUS to guide further fluids.",
      "Source control within 6–12 hours. Antibiotics without source control is half-treatment.",
    ],
    whenToCall: [
      "Any patient with suspected infection and altered mentation, hypotension, or tachypnoea — activate sepsis protocol immediately.",
      "Lactate > 4 mmol/L or MAP < 65 despite 30 mL/kg fluids — ICU transfer for vasopressor management.",
      "Norepinephrine > 0.5 mcg/kg/min without MAP response — add vasopressin, reassess source control, consider hydrocortisone.",
    ],
  },
  // ---- Foundations (Neuroscience block) ----

  {
    slug: "synapses-neurotransmitters",
    title: "Synapses & Neurotransmitters",
    emoji: "🧠",
    category: "Foundations",
    summary:
      "Synapses are the fundamental communication units of the nervous system. This article covers the basics of synaptic transmission, the major neurotransmitters, and the clinical conditions that arise when these systems malfunction.",
    readMinutes: 9,
    sections: [],
    keyPoints: [],
    whenToCall: [],
    tabs: [
      {
        id: "basics",
        label: "Basics",
        icon: "📖",
        sections: [
          {
            heading: "What is a synapse?",
            body: [
              "A synapse is the junction between two neurons (or between a neuron and a target cell such as a muscle or gland). It is the site where information is transmitted from one cell to the next. The synapse is not a physical connection — there is a tiny gap called the synaptic cleft (approximately 20–40 nm wide) between the presynaptic neuron (the sender) and the postsynaptic neuron (the receiver).",
              "Electrical signals (action potentials) travel along the axon of the presynaptic neuron. When the signal reaches the synaptic terminal, it triggers the release of chemical messengers called neurotransmitters. These neurotransmitters cross the synaptic cleft and bind to receptors on the postsynaptic cell, generating a new electrical signal.",
            ],
            bullets: [
              "Presynaptic neuron: the neuron sending the signal. Its terminal contains synaptic vesicles filled with neurotransmitter.",
              "Synaptic cleft: the 20–40 nm gap between the two neurons. Neurotransmitters must diffuse across this gap.",
              "Postsynaptic neuron: the neuron receiving the signal. Its membrane contains receptor proteins that bind neurotransmitters.",
              "Synaptic vesicles: small membrane-bound sacs inside the presynaptic terminal that store neurotransmitter molecules.",
            ],
          },
          {
            heading: "What do neurotransmitters do?",
            body: [
              "Neurotransmitters are chemical messengers that transmit signals across synapses. When released from the presynaptic neuron, they bind to specific receptors on the postsynaptic neuron, causing a change in the postsynaptic cell's electrical state. This change can be either excitatory (making the neuron more likely to fire) or inhibitory (making it less likely to fire).",
            ],
            bullets: [
              "Excitatory neurotransmitters: increase the probability that the postsynaptic neuron will fire an action potential. They cause depolarisation — the membrane potential becomes more positive. The main excitatory neurotransmitter in the brain is glutamate.",
              "Inhibitory neurotransmitters: decrease the probability that the postsynaptic neuron will fire. They cause hyperpolarisation — the membrane potential becomes more negative. The main inhibitory neurotransmitter in the brain is GABA (gamma-aminobutyric acid).",
              "Neuromodulators: a third category that modulates the overall activity of neural circuits rather than directly exciting or inhibiting. Examples include dopamine, serotonin, and noradrenaline. They often act over longer distances and longer timescales than classical neurotransmitters.",
            ],
            callout: {
              kind: "tip",
              title: "The excitatory-inhibitory balance",
              text: "Every thought, movement, and emotion depends on the precise balance between excitatory and inhibitory signals. Too much excitation → seizures. Too much inhibition → coma. The brain maintains this balance through thousands of synaptic connections, each fine-tuned by experience and genetics.",
            },
          },
          {
            heading: "Types of synapses",
            bullets: [
              "Chemical synapses: the most common type. Use neurotransmitters to transmit signals across the synaptic cleft. Allow for signal amplification, modulation, and plasticity (the ability to strengthen or weaken with use).",
              "Electrical synapses: use gap junctions to directly connect the cytoplasm of two neurons. Allow almost instantaneous signal transmission. Found in cardiac muscle, smooth muscle, and some brain regions where synchronised activity is needed.",
              "Neuromuscular junction (NMJ): a specialised chemical synapse between a motor neuron and a skeletal muscle fibre. Uses acetylcholine (ACh) as the neurotransmitter. When ACh binds to nicotinic receptors on the muscle, it triggers muscle contraction.",
            ],
          },
          {
            heading: "How a signal crosses the synapse",
            steps: [
              "An action potential arrives at the presynaptic terminal, depolarising the membrane.",
              "Voltage-gated calcium (Ca²⁺) channels open, and Ca²⁺ floods into the terminal.",
              "The rise in intracellular Ca²⁺ triggers synaptic vesicles to fuse with the presynaptic membrane (exocytosis).",
              "Neurotransmitter molecules are released into the synaptic cleft.",
              "Neurotransmitters diffuse across the cleft and bind to specific receptors on the postsynaptic membrane.",
              "Receptor binding opens ion channels or activates intracellular signalling cascades, generating a postsynaptic potential.",
              "The neurotransmitter is removed from the cleft by reuptake (transported back into the presynaptic neuron), enzymatic degradation (broken down by enzymes), or diffusion (drifts away from the synapse).",
            ],
          },
        ],
        keyPoints: [
          "A synapse is the junction between two neurons with a 20–40 nm synaptic cleft.",
          "Excitatory neurotransmitters (glutamate) depolarise; inhibitory neurotransmitters (GABA) hyperpolarise.",
          "The 7-step process: action potential → Ca²⁺ influx → vesicle fusion → neurotransmitter release → receptor binding → postsynaptic potential → signal termination.",
          "Neurotransmitter is cleared by reuptake, enzymatic degradation, or diffusion — this is the target of most psychotropic drugs.",
        ],
      },
      {
        id: "in-depth",
        label: "In-Depth",
        icon: "🔬",
        sections: [
          {
            heading: "The molecular machinery of synaptic transmission",
            body: [
              "Synaptic transmission is a precisely orchestrated molecular event involving calcium sensors, SNARE proteins, and receptor families. Understanding these mechanisms is essential for comprehending how drugs and diseases affect neural communication.",
            ],
            steps: [
              "Calcium sensing: when Ca²⁺ enters the terminal, it binds to synaptotagmin (a calcium sensor on the synaptic vesicle). This triggers the SNARE complex (syntaxin, SNAP-25, and synaptobrevin) to pull the vesicle membrane and presynaptic membrane together.",
              "Vesicle fusion: the SNARE complex catalyses membrane fusion, creating a fusion pore through which neurotransmitter is released. Each action potential releases approximately 5,000–10,000 neurotransmitter molecules (one quantum).",
              "Receptor types: ionotropic receptors (ligand-gated ion channels) produce fast, direct responses (milliseconds). Metabotropic receptors (G-protein coupled) produce slower, longer-lasting responses through second messenger cascades (seconds to minutes).",
              "Postsynaptic potentials: excitatory postsynaptic potentials (EPSPs) are produced by Na⁺ or Ca²⁺ influx. Inhibitory postsynaptic potentials (IPSPs) are produced by Cl⁻ influx or K⁺ efflux. A single EPSP is usually insufficient to trigger an action potential — temporal and spatial summation are required.",
              "Signal termination: reuptake transporters (e.g., SERT for serotonin, DAT for dopamine) actively pump neurotransmitter back into the presynaptic terminal. Enzymatic degradation (e.g., acetylcholinesterase breaks down ACh in the synaptic cleft) provides another termination mechanism.",
            ],
            callout: {
              kind: "warning",
              title: "The SNARE complex is a drug target",
              text: "Botulinum toxin (Botox) cleaves SNARE proteins, preventing vesicle fusion and neurotransmitter release. This is why Botox causes flaccid paralysis — it blocks acetylcholine release at the neuromuscular junction. Tetanus toxin does the opposite — it blocks inhibitory neurotransmitter release in the spinal cord, causing spastic paralysis.",
            },
          },
          {
            heading: "Key neurotransmitters — a clinical guide",
            bullets: [
              "Glutamate: the primary excitatory neurotransmitter in the CNS. Acts on NMDA, AMPA, and kainate receptors (ionotropic) and mGluR receptors (metabotropic). Essential for learning and memory (LTP — long-term potentiation). Excess glutamate → excitotoxicity → neuronal death ( implicated in stroke, ALS, and Alzheimer's disease).",
              "GABA (gamma-aminobutyric acid): the primary inhibitory neurotransmitter. Acts on GABA-A (ionotropic, Cl⁻ channel) and GABA-B (metabotropic, K⁺ channel) receptors. Benzodiazepines and barbiturates enhance GABA-A function → sedation, anxiolysis, anticonvulsant effects. Loss of GABAergic inhibition → seizures.",
              "Acetylcholine (ACh): neurotransmitter at the neuromuscular junction (nicotinic receptors) and in the CNS (muscarinic receptors). Critical for muscle contraction, attention, and memory. Degeneration of cholinergic neurons → Alzheimer's disease. Acetylcholinesterase inhibitors (donepezil) increase ACh levels and are used in Alzheimer's treatment.",
              "Dopamine: a catecholamine neurotransmitter with four major pathways: mesolimbic (reward, motivation), mesocortical (cognition, executive function), nigrostriatal (movement), and tuberoinfundibular (prolactin regulation). Acts on D1-like (excitatory) and D2-like (inhibitory) receptors. Degeneration of nigrostriatal pathway → Parkinson's disease. Excess mesolimbic dopamine → schizophrenia.",
              "Serotonin (5-HT): produced in the raphe nuclei of the brainstem. At least 14 receptor subtypes (5-HT1 through 5-HT7). Regulates mood, appetite, sleep, pain, and cognition. Low serotonin → depression. SSRIs (selective serotonin reuptake inhibitors) block the serotonin reuptake transporter (SERT), increasing synaptic 5-HT levels. First-line treatment for major depressive disorder.",
              "Noradrenaline (norepinephrine): produced in the locus coeruleus. Regulates arousal, attention, and the fight-or-flight response. Acts on α1, α2, β1, and β2 adrenergic receptors. SNRIs (serotonin-noradrenaline reuptake inhibitors) increase both 5-HT and NA levels. Used for depression, anxiety, and chronic pain.",
              "Endorphins: endogenous opioid peptides that bind to μ, δ, and κ opioid receptors. Produce analgesia and euphoria. The runners high, acupuncture analgesia, and placebo analgesia all involve endorphin release. Exogenous opioids (morphine, fentanyl) mimic endorphins but carry addiction risk.",
            ],
          },
          {
            heading: "Synaptic plasticity — how synapses change with use",
            body: [
              "Synaptic plasticity is the ability of synapses to strengthen or weaken over time in response to activity. It is the cellular basis of learning, memory, and recovery from brain injury.",
            ],
            bullets: [
              "Long-term potentiation (LTP): a persistent strengthening of a synapse based on recent patterns of activity. The NMDA receptor acts as a coincidence detector — it requires both presynaptic glutamate release and postsynaptic depolarisation to open. This is Hebb's rule: 'neurons that fire together, wire together.'",
              "Long-term depression (LTD): a persistent weakening of a synapse. Important for pruning unused connections and preventing saturation of neural circuits. LTD is essential for motor learning and habit formation.",
              "Homeostatic plasticity: a scaling mechanism that adjusts the strength of all synapses on a neuron to maintain stable activity levels. Prevents runaway excitation or silencing.",
            ],
          },
          {
            heading: "Clinical relevance — when neurotransmitter systems fail",
            bullets: [
              "Major depressive disorder (MDD): characterised by low monoamine neurotransmission (serotonin, noradrenaline, dopamine). The monoamine hypothesis proposes that deficiency in these neurotransmitters causes depressive symptoms. SSRIs (fluoxetine, sertraline) are first-line: they block SERT, increasing synaptic 5-HT. Takes 2–4 weeks for full effect — downregulation of autoreceptors is required.",
              "Parkinson's disease: progressive loss of dopaminergic neurons in the substantia nigra (nigrostriatal pathway). Results in dopamine deficiency in the striatum → tremor, rigidity, bradykinesia, postural instability. Treatment: L-DOPA (levodopa) — a dopamine precursor that crosses the blood-brain barrier. Combined with carbidopa (a peripheral DOPA decarboxylase inhibitor) to prevent peripheral conversion and reduce side effects.",
              "Alzheimer's disease: degeneration of cholinergic neurons in the nucleus basalis of Meynert → reduced ACh in the cortex and hippocampus. Treatment: acetylcholinesterase inhibitors (donepezil, rivastigmine, galantamine) increase ACh levels. Memantine (NMDA receptor antagonist) reduces glutamate excitotoxicity. Used in moderate-to-severe disease.",
              "Schizophrenia: the dopamine hypothesis proposes that excess dopamine in the mesolimbic pathway causes positive symptoms (hallucinations, delusions) and deficit dopamine in the mesocortical pathway causes negative symptoms (flat affect, cognitive impairment). Antipsychotics block D2 receptors. First-generation (haloperidol) primarily treat positive symptoms. Second-generation (clozapine, olanzapine) also address negative symptoms but carry metabolic side effects.",
              "Epilepsy: an imbalance between excitation (glutamate) and inhibition (GABA). Many antiepileptic drugs work by enhancing GABAergic inhibition (valproate, vigabatrin) or reducing glutamatergic excitation (lamotrigine, topiramate).",
              "Myasthenia gravis: autoimmune destruction of nicotinic ACh receptors at the neuromuscular junction → fatigable weakness. Treatment: acetylcholinesterase inhibitors (pyridostigmine) increase ACh availability. Immunosuppression (prednisolone, azathioprine) for long-term management.",
            ],
            callout: {
              kind: "tip",
              title: "Drug mechanisms map to neurotransmitter pathways",
              text: "Nearly every psychotropic drug works by modifying a neurotransmitter system: SSRIs → serotonin reuptake, L-DOPA → dopamine synthesis, benzodiazepines → GABA receptor potentiation, antipsychotics → dopamine receptor blockade. Understanding the neurotransmitter system is the key to understanding pharmacology.",
            },
          },
        ],
        keyPoints: [
          "The SNARE complex (syntaxin, SNAP-25, synaptobrevin) catalyses vesicle fusion — botulinum and tetanus toxins target this machinery.",
          "Glutamate (excitatory) vs GABA (inhibitory) — the brain's primary excitatory-inhibitory balance.",
          "Dopamine has 4 pathways: mesolimbic (reward), mesocortical (cognition), nigrostriatal (movement), tuberoinfundibular (prolactin).",
          "Synaptic plasticity (LTP/LTD) is the cellular basis of learning — Hebb's rule: neurons that fire together, wire together.",
          "SSRIs take 2–4 weeks because autoreceptor downregulation is required — immediate serotonin increase is not the therapeutic mechanism.",
        ],
      },
    ],
  },
  // ---- Critical Care & Emergencies ----

  {
    slug: "stemi-management",
    title: "STEMI Management: Door-to-Balloon Protocol",
    emoji: "🫀",
    category: "Critical Care & Emergencies",
    summary:
      "ST-Elevation Myocardial Infarction is a time-critical emergency where every minute of delay costs myocardium. This attending-level guide covers ECG criteria, the MONA-BASH protocol, reperfusion strategy selection, door-to-balloon targets, mechanical complications, and the latest 2024 ACC/AHA guideline updates.",
    readMinutes: 12,
    sections: [
      {
        heading: "STEMI Definition and ECG Criteria",
        body: [
          "STEMI is defined as myocardial ischaemia causing myocyte necrosis, evidenced by ST-segment elevation on ECG in the setting of ischaemic symptoms. The diagnosis is clinical and electrocardiographic — do not wait for troponin to make the decision to reperfuse.",
        ],
        bullets: [
          "ST elevation (new or presumed new) at the J-point in ≥ 2 contiguous leads: ≥ 1 mm in all leads except V2–V3 (where ≥ 2 mm in men ≥ 40 years, ≥ 2.5 mm in men < 40, ≥ 1.5 mm in women).",
          "New left bundle branch block (LBBB) in the setting of ischaemic symptoms: treat as STEMI equivalent (Sgarbossa criteria).",
          "Posterior MI: ST depression in V1–V3 → obtain posterior leads (V7–V9). ST elevation ≥ 0.5 mm in V7–V9 confirms posterior STEMI.",
          "Right ventricular MI: inferior STEMI (ST elevation in II, III, aVF) → obtain right-sided leads (V4R). ST elevation ≥ 1 mm in V4R confirms RV involvement. CRITICAL: avoid nitrates and volume depletion in RV infarction.",
          "De Winter T-waves: upsloping ST depression with tall symmetric T-waves in V1–V6 — an STEMI equivalent indicating LAD occlusion. Treat as STEMI.",
          "Wellens syndrome: biphasic or deeply inverted T-waves in V2–V3 during pain-free intervals — indicates critical LAD stenosis. Do NOT stress test. Urgent catheterisation required.",
        ],
        callout: {
          kind: "danger",
          title: "Troponin does NOT gate reperfusion",
          text: "Troponin can take 3–6 hours to rise. Waiting for a positive troponin before activating the cath lab costs lives. ECG + symptoms = STEMI activation. Troponin is for confirming diagnosis and risk stratification AFTER reperfusion.",
        },
      },
      {
        heading: "MONA-BASH — The Immediate Actions Protocol",
        body: [
          "MONA-BASH is a systematic mnemonic for the first 10 minutes of STEMI management. Not all components are equally evidence-based — prioritise Aspirin, Anticoagulation, and Reperfusion above all else.",
        ],
        steps: [
          "M — Morphine: 2–4 mg IV every 5–15 minutes for refractory chest pain unresponsive to nitroglycerin. Use cautiously — morphine may delay absorption of oral antiplatelets and is associated with worse outcomes in some registries. Only for pain, not routine.",
          "O — Oxygen: SUPPLEMENTAL OXYGEN IS NOT ROUTINE. Give only if SpO₂ < 90% or the patient is in respiratory distress (DETO2X-AMI trial, NEJM 2017). Routine O₂ in normoxic patients may cause coronary vasoconstriction and increase infarct size.",
          "N — Nitroglycerin: 0.4 mg sublingual every 5 minutes × 3 doses for ongoing chest pain. Switch to IV infusion (5–200 mcg/min) if pain persists. CONTRAINDICATED: RV infarction, systolic BP < 90 mmHg, use of PDE-5 inhibitors (sildenafil within 24 h, tadalafil within 48 h).",
          "A — Aspirin: 324 mg chewed immediately (four 81 mg tablets). Non-enteric-coated for fastest absorption. This is the single most important medication in the first 10 minutes. If allergic: clopidogrel 600 mg loading dose.",
          "B — Beta-blockers: Metoprolol 25–50 mg PO within 24 hours if haemodynamically stable (HR > 60, SBP > 100, no heart failure, no heart block). IV beta-blockers in the acute phase are associated with increased cardiogenic shock — AVOID in the first 24 hours (COMMIT/CCS-2 trial).",
          "A — ACE inhibitors / ARBs: Start within 24 hours if anterior STEMI, heart failure, or EF ≤ 40%. Start with low dose (ramipril 1.25 mg or lisinopril 2.5 mg) and titrate. Avoid if SBP < 100 mmHg or bilateral renal artery stenosis.",
          "S — Statins: High-intensity statin immediately — Atorvastatin 80 mg or Rosuvastatin 40 mg. Plaque stabilisation, anti-inflammatory effect, and endothelial improvement begin within hours. Continue indefinitely.",
          "H — Heparin: Unfractionated heparin (UFH) 60 U/kg bolus (max 4,000 U) + 12 U/kg/hr infusion (max 1,000 U/hr) for PCI. For thrombolytics: UFH 60 U/kg bolus (max 4,000 U) + 12 U/kg/hr (max 1,000 U/hr) for 48 hours, targeting aPTT 50–70 seconds. Alternatively: enoxaparin 0.5 mg/kg IV bolus for PCI, or 1 mg/kg SC q12h for thrombolytics.",
        ],
        callout: {
          kind: "tip",
          title: "The 2024 oxygen update",
          text: "The DETO2X-AMI trial and 2024 ACC/AHA guidelines now recommend AGAINST routine supplemental oxygen in normoxic STEMI patients. Oxygen is only for SpO₂ < 90%. This is a major practice change from older protocols.",
        },
      },
      {
        heading: "Reperfusion Strategy: PCI vs. Thrombolytics",
        body: [
          "The choice between primary PCI and fibrinolytic therapy depends on first-medical-contact-to-device time and the time the patient presents. This is the most critical decision in STEMI management.",
        ],
        steps: [
          "Primary PCI (Percutaneous Coronary Intervention): THE GOLD STANDARD. Can be performed within 120 minutes of first medical contact. Achieves TIMI 3 flow in 90%+ of cases. Mortality benefit over thrombolytics in all age groups. Indicated for: all STEMI patients presenting within 12 hours of symptom onset when PCI can be performed within 120 minutes.",
          "Thrombolytic therapy: ONLY when PCI cannot be performed within 120 minutes. Tenecteplase (TNK) is the preferred agent — single IV bolus weight-adjusted. Accelerated alteplase (tPA) is an alternative. Absolute contraindications: active internal bleeding, history of haemorrhagic stroke, ischaemic stroke within 3 months, intracranial neoplasm, suspected aortic dissection, significant head/facial trauma within 3 months.",
          "Pharmacoinvasive strategy: thrombolytics followed by transfer for early PCI (within 3–24 hours). Used when the nearest PCI-capable centre is > 120 minutes away. If thrombolytic succeeds (≥ 50% ST resolution at 60–90 minutes), transfer for angiography within 3–24 hours. If thrombolytic fails (persistent ST elevation, ongoing pain), emergent rescue PCI.",
          "Door-to-needle time: ≤ 30 minutes from first medical contact if thrombolytics chosen. If door-to-needle cannot be achieved within 30 minutes, transfer for primary PCI.",
          "Door-to-balloon time: ≤ 90 minutes from first medical contact for primary PCI. If the presenting hospital is not PCI-capable, first-medical-contact-to-device ≤ 120 minutes (including transfer time).",
          "Late presenters (> 12 hours): if symptoms have resolved and ECG shows no ongoing ischaemia, conservative management (medical therapy) may be appropriate. If symptoms persist or haemodynamic instability, PCI is still indicated regardless of time window.",
        ],
        callout: {
          kind: "danger",
          title: "Never delay PCI for thrombolytics if PCI is available",
          text: "If the patient arrives at a PCI-capable centre, activate the cath lab immediately. Do NOT give thrombolytics and then transfer for PCI — this increases bleeding risk without benefit. Thrombolytics are ONLY for when PCI is genuinely unavailable within 120 minutes.",
        },
      },
      {
        heading: "Door-to-Balloon Time Targets",
        bullets: [
          "PCI-capable centre: first medical contact to device ≤ 90 minutes. This includes time from ED arrival to wire crossing the lesion.",
          "Non-PCI centre with transfer: first medical contact to device ≤ 120 minutes. This includes pre-hospital ECG activation of the receiving cath lab.",
          "Thrombolytics: door-to-needle ≤ 30 minutes. If this target cannot be met, transfer for PCI.",
          "Pre-hospital ECG: if EMS can obtain and transmit a 12-activate the cath lab before the patient arrives — this shaves 20–30 minutes off door-to-balloon time.",
          "Critical time milestones: every 30-minute delay in reperfusion increases 1-year mortality by approximately 7.5%. At 6 hours, myocardium is largely irreversibly damaged. 'Time is myocardium' is not a cliché — it is a quantifiable fact.",
          "Activations should include: cardiologist, cath lab team, anaesthesia standby (if haemodynamically unstable), and intra-aortic balloon pump (IABP) team on standby for cardiogenic shock.",
        ],
      },
      {
        heading: "Post-PCI: Dual Antiplatelet Therapy (DAPT) and Beyond",
        bullets: [
          "DAPT is mandatory after PCI with stent placement. Aspirin 81 mg daily (indefinite) + P2Y12 inhibitor for a minimum of 6 months (drug-eluting stent) or 1 month (bare-metal stent).",
          "P2Y12 inhibitor choice: Ticagrelor 90 mg BD (preferred — PLATO trial superiority over clopidogrel) OR Prasugrel 10 mg daily (FASTER onset, TRITON-TIMI 38 — but avoid in prior stroke/TIA, age > 75, weight < 60 kg). Clopidogrel 75 mg daily only if ticagrelor/prasugrel contraindicated.",
          "2024 ACC/AHA guideline update: shortened DAPT (3 months) followed by aspirin monotherapy is now recommended for patients at high bleeding risk (ARC-HBR score ≥ 2). The TWILIGHT trial demonstrated that dropping ticagrelor at 3 months and continuing aspirin alone reduced bleeding by 65% without increasing ischaemic events.",
          "Lipid management post-STEMI: high-intensity statin (atorvastatin 80 mg or rosuvastatin 40 mg) is non-negotiable. Target LDL < 55 mg/dL (1.4 mmol/L) per 2019 ESC guidelines. If LDL not at goal on maximally tolerated statin, add ezetimibe 10 mg. Still not at goal: add PCSK9 inhibitor (evolocumab or alirocumab) — the FOURIER and ODYSSEY trials demonstrated additional 15–20% relative risk reduction.",
          "Beta-blockers: continue metoprolol or bisoprolol indefinitely if EF ≤ 40% or heart failure. Discontinue if EF > 40% and no heart failure after 1 year (beta-blocker continuation beyond 1 year in normal EF has no mortality benefit).",
          "ACE inhibitor / ARB: continue indefinitely if anterior STEMI, EF ≤ 40%, heart failure, hypertension, or diabetes. Switch to ARNI (sacubitril/valsartan) if heart failure with reduced EF persists at 6 weeks.",
          "Mineralocorticoid receptor antagonist (MRA): eplerenone 25 mg daily or spironolactone 25 mg daily if EF ≤ 40% + heart failure symptoms OR diabetes, within 3–14 days of STEMI (EPHESUS trial). Monitor potassium closely.",
        ],
      },
      {
        heading: "Complications of STEMI — Recognition and Management",
        bullets: [
          "Ventricular fibrillation (VF) / ventricular tachycardia (VT): most common in the first 48 hours. Defibrillate immediately for pulseless VT/VF (ACLS protocol). Amiodarone 300 mg IV for recurrent VF. If haemodynamically tolerated VT: amiodarone 150 mg IV over 10 minutes.",
          "Cardiogenic shock: hypotension (SBP < 90 mmHg) + signs of end-organ hypoperfusion (altered mentation, cold extremities, oliguria) + pulmonary congestion. Management: emergent PCI (restore flow), vasopressors (norepinephrine first-line), IABP or Impella for mechanical support. Mortality remains 40–50% even with modern therapy.",
          "Acute mitral regurgitation (papillary muscle rupture): sudden pulmonary oedema, new holosystolic murmur, haemodynamic collapse. Diagnose with bedside echocardiography (severe MR on colour Doppler). Immediate afterload reduction (nitroprusside), IABP, and emergent surgical repair — mortality exceeds 80% without surgery.",
          "Ventricricular septal defect (VSD): new holosystolic murmur + step-up in O₂ saturation from RA to RV on right heart catheterisation. Diagnose with echocardiography. Manage with afterload reduction and IABP. Surgical or percutaneous closure within 1–2 weeks — but urgent surgery if haemodynamically unstable.",
          "Right ventricular infarction: hypotension + clear lungs + elevated JVP + inferior ST elevation. Management: IV fluid bolus (250–500 mL NS), avoid nitrates, avoid diuretics, emergent PCI. Mortality doubles if not recognised early.",
          "Pericarditis (Dressler syndrome): occurs 2–10 weeks post-MI. Fever, pleuritic chest pain, pericardial friction rub, diffuse ST elevation. Treatment: aspirin 650 mg q6h + colchicine 0.5 mg BD for 3 months (COPPS-2 trial). Avoid NSAIDs and anticoagulation in acute pericarditis.",
          "Free wall rupture: sudden haemodynamic collapse, PEA, blood in pericardial effusion (cardiac tamponade on echo). Almost universally fatal without immediate pericardiocentesis and emergent surgical repair. Peak incidence: 3–5 days post-MI.",
        ],
        callout: {
          kind: "danger",
          title: "Echocardiography is your best friend",
          text: "Every complication of STEMI can be diagnosed or strongly suspected with bedside echocardiography. Wall motion abnormalities, MR, VSD, pericardial effusion, RV dilation, and EF assessment — all available within minutes. If the patient deteriorates post-PCI, the first move should always be bedside echo.",
        },
      },
      {
        heading: "Recent Updates and Guideline Changes (2024)",
        bullets: [
          "2024 ACC/AHA STEMI guidelines: reinforced door-to-balloon ≤ 90 min for PCI, ≤ 120 min with transfer, ≤ 30 min for thrombolytics. Added strong recommendation for pre-hospital ECG transmission.",
          "Shortened DAPT: the TWILIGHT and TICO trials support 3-month DAPT followed by P2Y12 monotherapy (dropping aspirin) in high-bleeding-risk patients. This is now a Class IIa recommendation.",
          "PCSK9 inhibitors: the 2024 guidelines upgraded PCSK9 inhibitors to Class I (strong) recommendation for patients not at LDL goal on statin + ezetimibe post-ACS. This reflects the FOURIER and ODYSSEY outcome data.",
          "Oxygen restriction: DETO2X-AMI (NEJM 2017) + 2024 guidelines: do NOT give supplemental oxygen to normoxic STEMI patients (SpO₂ ≥ 94%). Routine O₂ may increase infarct size via coronary vasoconstriction.",
          "Cangrelor: intravenous direct P2Y12 inhibitor with ultra-short half-life (3–6 minutes).允许 instant platelet recovery after stopping infusion. The CHAMPION trials showed benefit in PCI patients who couldn't take oral antiplatelets. Now recommended for STEMI patients proceeding to urgent PCI who haven't loaded with oral P2Y12 inhibitors.",
          "Tricuspid regurgitation post-MI: increasingly recognised as a marker of poor prognosis. The 2024 ESC guidelines now include TR assessment in routine post-MI echocardiography.",
        ],
      },
    ],
    keyPoints: [
      "ECG + symptoms = STEMI. Do NOT wait for troponin to activate the cath lab.",
      "MONA-BASH priority: Aspirin 324 mg chewed → Heparin → Reperfusion. Oxygen only if SpO₂ < 90%.",
      "PCI gold standard: door-to-balloon ≤ 90 min. Thrombolytics only if PCI unavailable within 120 min.",
      "DAPT: aspirin + ticagrelor/prasugrel for ≥ 3 months (shortened for high-bleeding-risk per 2024 guidelines).",
      "Every post-MI deterioration → bedside echocardiography first. It diagnoses almost all complications.",
    ],
    whenToCall: [
      "New ST elevation in ≥ 2 contiguous leads → STEMI alert → cath lab activation within minutes.",
      "Haemodynamic collapse post-PCI → bedside echo → consider cardiogenic shock protocol (PCI + vasopressors + mechanical support).",
      "New murmur post-MI → echo immediately → papillary muscle rupture or VSD → urgent surgical consultation.",
    ],
  },
  {
    slug: "cranial-nerves",
    title: "The 12 Cranial Nerves",
    emoji: "🧠",
    category: "Foundations",
    summary:
      "Master the cranial nerves — their numbers, names, functions, and the classic mnemonics that make them unforgettable.",
    readMinutes: 18,
    sections: [],
    keyPoints: [],
    whenToCall: [],
    tabs: [
      {
        id: "basics",
        label: "Basics",
        icon: "📖",
        sections: [
          {
            heading: "What Are the Cranial Nerves?",
            body: [
              "The 12 cranial nerves (CN I–XII) emerge directly from the brain and brainstem, passing through openings in the skull to supply the head, neck, and torso.",
              "Unlike spinal nerves, each cranial nerve has a specific name and a distinct function — some carry only sensory information, some only motor, and some both (mixed).",
              "Knowing which nerves do what is essential for neurological examination, and understanding their pathways helps localise lesions in clinical practice.",
            ],
          },
          {
            heading: "The Complete List (I–XII)",
            body: [
              "I — Olfactory: Smell (Sensory only)",
              "II — Optic: Vision (Sensory only)",
              "III — Oculomotor: Eye movement, pupil constriction, eyelid lift (Mostly Motor)",
              "IV — Trochlear: Eye movement — downward/inward rotation (Motor only)",
              "V — Trigeminal: Facial sensation + chewing (Mixed — largest nerve)",
              "VI — Abducens: Eye movement — lateral gaze (Motor only)",
              "VII — Facial: Facial expression, taste (anterior 2/3 tongue), lacrimation (Mixed)",
              "VIII — Vestibulocochlear: Hearing + balance (Sensory only)",
              "IX — Glossopharyngeal: Taste (posterior 1/3 tongue), swallowing, carotid body reflex (Mixed)",
              "X — Vagus: Parasympathetic to heart/lungs/GI, voice, gag reflex (Mixed — longest nerve)",
              "XI — Accessory: Head turning, shoulder shrugging (Motor only)",
              "XII — Hypoglossal: Tongue movement (Motor only)",
            ],
          },
          {
            heading: "The Classic Mnemonics",
            body: [
              "Remember the Sensory/Motor/Both pattern for each nerve with this line:",
              "\"Some Say Marry Money But My Brother Says Big Brains Matter More\" → S, S, M, M, B, M, B, S, B, B, M, M (CN I–XII)",
              "And for the nerve names in order, use:",
              "\"On Old Olympus' Towering Tops, A Finn And German Viewed Some Hops\" → O, O, O, T, T, A, F, G, V, S, H",
            ],
          },
          {
            heading: "Quick Classification",
            bullets: [
              "Sensory only: I (Olfactory), II (Optic), VIII (Vestibulocochlear)",
              "Motor only: III (Oculomotor), IV (Trochlear), VI (Abducens), XI (Accessory), XII (Hypoglossal)",
              "Mixed (both): V (Trigeminal), VII (Facial), IX (Glossopharyngeal), X (Vagus)",
              "That's 4 sensory, 5 motor, and 3 mixed — a useful ratio for exams.",
            ],
          },
          {
            heading: "The Foramina — Where They Exit",
            bullets: [
              "Optic nerve (II) → Optic canal",
              "Oculomotor (III), Trochlear (IV), Abducens (VI), V1 → Superior orbital fissure",
              "Trigeminal V2 → Foramen rotundum. V3 → Foramen ovale",
              "IX, X, XI → Jugular foramen",
              "XII → Hypoglossal canal",
            ],
          },
        ],
        keyPoints: [
          "12 cranial nerves — know their numbers, names, and sensory/motor/mixed classification.",
          "The mnemonics \"Some Say Marry Money\" and \"On Old Olympus' Towering Tops\" are exam gold.",
          "4 sensory, 5 motor, 3 mixed nerves — a useful ratio to remember.",
        ],
      },
      {
        id: "in-depth",
        label: "In-Depth",
        icon: "🔬",
        sections: [
          {
            heading: "Vagus Nerve (X) — The Wandering Nerve",
            body: [
              "The vagus nerve is the longest cranial nerve, descending from the brainstem through the neck into the thorax and abdomen.",
              "It provides parasympathetic innervation to the heart (slowing heart rate), lungs (bronchoconstriction), and the entire GI tract up to the splenic flexure.",
              "Clinical pearl: Vagus nerve stimulation (VNS) is an FDA-approved treatment for drug-resistant epilepsy and depression.",
              "The vagus also carries taste from the epiglottis and larynx, and controls the muscles of the pharynx and larynx (speech and swallowing).",
            ],
          },
          {
            heading: "Facial Nerve (VII) — Motor vs. Sensory",
            body: [
              "The facial nerve has four main branches after exiting the stylomastoid foramen: Temporal, Zygomatic, Buccal, and Mandibular — remembered as \"To Zanzibar By Motorcar\".",
              "Motor function: Controls all muscles of facial expression, the stapedius muscle (protects against loud sounds), and the stylohyoid/digastric muscles.",
              "Sensory function: Carries taste from the anterior 2/3 of the tongue via the chorda tympani branch.",
              "Parasympathetic function: Stimulates lacrimation (tear production), submandibular/sublingual salivation, and nasal/palatal mucus secretion.",
              "Bell's palsy (lower motor neuron lesion) affects the entire ipsilateral face — the patient cannot wrinkle their forehead, close their eye, or smile on that side.",
            ],
          },
          {
            heading: "Trigeminal Nerve (V) — Three Divisions",
            body: [
              "The trigeminal nerve has three major divisions: V1 (Ophthalmic), V2 (Maxillary), and V3 (Mandibular).",
              "V1 — Ophthalmic: Purely sensory. Supplies sensation to the forehead, upper eyelid, and cornea (corneal reflex afferent limb).",
              "V2 — Maxillary: Purely sensory. Supplies sensation to the cheek, upper lip, upper teeth, and nasal cavity. Exits via foramen rotundum.",
              "V3 — Mandibular: Mixed. Sensation to the lower face + motor to the muscles of mastication (temporalis, masseter, medial/lateral pterygoids).",
              "Trigeminal neuralgia: Excruciating, electric-shock-like facial pain — usually in V2/V3 distribution. Often caused by vascular compression of the nerve root.",
            ],
          },
          {
            heading: "Clinical Relevance — Bell's Palsy",
            body: [
              "Bell's palsy is an acute, idiopathic, lower motor neuron (LMN) facial nerve palsy — the most common cause of unilateral facial weakness.",
              "Key distinction from stroke: In Bell's palsy, the forehead IS affected (patient cannot raise eyebrow). In stroke (upper motor neuron), the forehead is SPARED because the upper face receives bilateral cortical input.",
              "Treatment: Corticosteroids (prednisolone) within 72 hours significantly improve recovery. Antivirals (acyclovir) are sometimes added but evidence is weaker.",
              "Prognosis: ~85% recover fully within 3–6 months. Complete eye closure is the most important functional goal — use lubricating drops and tape the eye shut at night if needed.",
            ],
          },
          {
            heading: "Clinical Relevance — CN IX and X Testing",
            bullets: [
              "Gag reflex: Afferent limb = CN IX, Efferent limb = CN X. Absent gag → think IX lesion first.",
              "Hoarseness + unilateral vocal cord paralysis → CN X (vagus/recurrent laryngeal nerve) lesion.",
              "The recurrent laryngeal nerve loops under the aortic arch on the left — left vocal cord palsy is more common in thoracic disease.",
              "Glossopharyngeal neuralgia: Severe throat/ear pain triggered by swallowing — can cause syncope via carotid sinus hypersensitivity.",
            ],
          },
          {
            heading: "High-Yield Summary",
            bullets: [
              "Only 3 cranial nerves pass through the superior orbital fissure: III, IV, VI (plus V1).",
              "CN IV (Trochlear) is the only cranial nerve to exit posteriorly and the only one to fully decussate dorsally.",
              "CN XI (Accessory) has a spinal root (C1–C5) that ascends through the foramen magnum — unique among cranial nerves.",
              "Vagus does everything — it's the parasympathetic highway to the thorax and abdomen.",
            ],
          },
        ],
        keyPoints: [
          "Vagus nerve (X) is the parasympathetic powerhouse: heart, lungs, GI tract.",
          "Bell's palsy: forehead IS affected (LMN). Stroke: forehead SPARED (UMN) — the most tested distinction.",
          "Trigeminal neuralgia = electric-shock face pain. Bell's palsy = sudden facial droop.",
          "Recurrent laryngeal nerve loops under the aortic arch — left vocal cord palsy is more common in thoracic disease.",
        ],
      },
    ],
  },
];
export function articleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export const ARTICLE_CATEGORIES = [
  ...new Set(ARTICLES.map((a) => a.category)),
];

/** Plain-text reading of an article (includes title, all tabs). */
export function articleToSpeech(article: Article): string {
  let body: string[];
  if (article.tabs) {
    body = article.tabs.flatMap((tab) =>
      tab.sections.flatMap((s) => [...(s.body ?? []), ...(s.steps ?? []), ...(s.bullets ?? [])])
    );
  } else {
    body = article.sections.flatMap((s) => [
      ...(s.body ?? []),
      ...(s.steps ?? []).map((step, i) => "Step " + (i + 1) + ". " + step),
      ...(s.bullets ?? []),
    ]);
  }
  return (article.title + ". " + body.join(" ")).slice(0, 4000);
}

/** Total number of step-by-step instructions across all articles (no args). */
export function totalSteps(): number {
  return ARTICLES.reduce((sum, a) => {
    if (a.tabs) {
      return sum + a.tabs.reduce(
        (tabSum, tab) => tabSum + tab.sections.reduce((s, sec) => s + (sec.steps?.length ?? 0), 0),
        0,
      );
    }
    return sum + a.sections.reduce((s, sec) => s + (sec.steps?.length ?? 0), 0);
  }, 0);
}
