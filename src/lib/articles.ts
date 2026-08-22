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
          "Secure the splint with bandages, cloth strips, or tape — snug enough to hold, loose enough to slide a finger underneath. Check that the skin below isn't turning pale or blue.",
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
];

export function articleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function articleToSpeech(a: Article): string {
  const parts: string[] = [`${a.title}. ${a.summary}`];
  if (a.tabs) {
    for (const tab of a.tabs) {
      parts.push(`${tab.label}.`);
      for (const sec of tab.sections) {
        parts.push(sec.heading);
        if (sec.body) parts.push(...sec.body);
        if (sec.bullets) parts.push(...sec.bullets);
        if (sec.steps) parts.push(...sec.steps.map((s, i) => `Step ${i + 1}. ${s}`));
        if (sec.callout) parts.push(sec.callout.title, sec.callout.text);
      }
    }
  } else {
    for (const sec of a.sections) {
      parts.push(sec.heading);
      if (sec.body) parts.push(...sec.body);
      if (sec.bullets) parts.push(...sec.bullets);
      if (sec.steps) parts.push(...sec.steps.map((s, i) => `Step ${i + 1}. ${s}`));
      if (sec.callout) parts.push(sec.callout.title, sec.callout.text);
    }
  }
  return parts.join("\n\n");
}

export function totalSteps(): number {
  return ARTICLES.reduce((sum, a) => {
    const sections = a.tabs
      ? a.tabs.flatMap((t) => t.sections)
      : a.sections;
    return sum + sections.reduce((s, sec) => s + (sec.steps?.length ?? 0), 0);
  }, 0);
}

export const ARTICLE_CATEGORIES: string[] = Array.from(
  new Set(ARTICLES.map((a) => a.category)),
);
