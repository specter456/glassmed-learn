/**
 * The Research library — ten professor-level first-aid articles written for
 * laypeople and students. Every step follows current first-aid guidelines
 * (American Heart Association / American Red Cross / AAP / AAPCC).
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
    category: "Cardiac Emergency",
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
    category: "Airway Emergency",
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
    category: "Trauma",
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
    category: "Cardiac Emergency",
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
    category: "Neurological Emergency",
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
    category: "Medical Emergency",
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
    category: "Neurological Emergency",
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
    category: "Medical Emergency",
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
  {
    slug: "cardiac-cycle",
    title: "The Cardiac Cycle",
    emoji: "💓",
    category: "Physiology",
    summary:
      "The cardiac cycle is the sequence of events that occurs during one complete heartbeat — from the moment the atria contract to the moment the ventricles relax. Understanding it is the foundation of cardiology.",
    readMinutes: 8,
    sections: [
      {
        heading: "What is the cardiac cycle?",
        body: [
          "Every beat of your heart is a perfectly orchestrated event. The cardiac cycle describes the complete sequence of mechanical events — contraction and relaxation — that the heart goes through to pump blood to the lungs and the rest of the body.",
          "A single cardiac cycle lasts about 0.8 seconds at a normal resting heart rate of 75 beats per minute. During that fraction of a second, the heart must fill with blood, contract to eject it, and relax to refill — repeating this roughly 100,000 times every day.",
        ],
      },
    ],
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
              "The cardiac cycle is the series of events that happen during one heartbeat. Think of it as a single pump-action: the heart fills with blood, squeezes it out, and then relaxes to fill again. This entire cycle repeats about 75 times per minute at rest.",
              "The cycle is divided into two major phases: when the heart is actively squeezing (systole) and when it is relaxing and filling (diastole). Both the upper chambers (atria) and the lower chambers (ventricles) have their own systole and diastole — they work in a staggered, coordinated rhythm.",
            ],
          },
          {
            heading: "Key Terms You Must Know",
            bullets: [
              "Systole — The phase when a heart chamber contracts (squeezes) to pump blood out. When you hear 'systolic blood pressure,' it's the pressure in the arteries during ventricular contraction (typically 120 mmHg in a healthy adult).",
              "Diastole — The phase when a heart chamber relaxes and fills with blood. 'Diastolic blood pressure' is the pressure in the arteries during this resting phase (typically 80 mmHg).",
              "Cardiac Output (CO) — The volume of blood the heart pumps in one minute. CO = Heart Rate × Stroke Volume. At rest, a healthy heart pumps about 5 litres per minute.",
              "Stroke Volume (SV) — The amount of blood pumped out by the left ventricle in a single beat (about 70 mL).",
              "Heart Rate (HR) — The number of beats per minute (typically 60–100 bpm at rest).",
            ],
            callout: {
              kind: "tip",
              title: "Remember this formula",
              text: "Cardiac Output = Heart Rate × Stroke Volume. If either goes up (exercise, fever, or anxiety), the heart works harder to maintain adequate blood flow.",
            },
          },
          {
            heading: "What happens during one beat?",
            body: [
              "Here's the simplest way to think about it:",
            ],
            bullets: [
              "Step 1 — The atria contract first, pushing the last bit of blood into the ventricles (Atrial Systole).",
              "Step 2 — The ventricles then contract powerfully, sending blood to the lungs via the pulmonary artery and to the body via the aorta (Ventricular Systole).",
              "Step 3 — Everything relaxes briefly, and blood flows passively back into the atria and ventricles, preparing for the next beat (Complete Cardiac Diastole).",
            ],
          },
          {
            heading: "Heart Sounds: What are 'Lub' and 'Dub'?",
            body: [
              "Every time you hear a heartbeat, you're actually hearing the sounds made by the heart valves closing:",
            ],
            bullets: [
              "S1 ('Lub') — The first heart sound, caused by the closing of the mitral and tricuspid valves at the start of ventricular systole. It marks the beginning of the ventricular contraction.",
              "S2 ('Dub') — The second heart sound, caused by the closing of the aortic and pulmonary valves at the end of ventricular systole. It marks the beginning of diastole.",
              "These sounds are the basis of cardiac auscultation — doctors use a stethoscope to listen for abnormal sounds (murmurs) that might indicate valve problems.",
            ],
          },
          {
            heading: "Why does the cardiac cycle matter?",
            bullets: [
              "It's the foundation of understanding blood pressure, heart murmurs, heart failure, and many cardiac diseases.",
              "Every medical student must know the pressure changes, valve actions, and volume changes during each phase.",
              "It connects to other systems: the lungs (pulmonary circulation), the kidneys (fluid balance), and the brain (perfusion).",
            ],
          },
        ],
        keyPoints: [
          "Systole = contraction (pumping). Diastole = relaxation (filling).",
          "Cardiac Output = Heart Rate × Stroke Volume. Normal CO is ~5 L/min.",
          "S1 ('Lub') = mitral/tricuspid valves close. S2 ('Dub') = aortic/pulmonary valves close.",
          "One complete cardiac cycle lasts ~0.8 seconds at 75 bpm.",
        ],
      },
      {
        id: "indepth",
        label: "In-Depth",
        icon: "🔬",
        sections: [
          {
            heading: "Phase 1: Atrial Systole (0.1 s)",
            body: [
              "Atrial systole begins when the SA node (the heart's natural pacemaker) fires, causing both atria to contract simultaneously. This 'atrial kick' pushes the final 20–30% of blood into the already partially-filled ventricles.",
              "During this phase:",
            ],
            bullets: [
              "Atrial pressure rises briefly above ventricular pressure, forcing the mitral and tricuspid valves open.",
              "Ventricular volume increases from about 130 mL (end-diastolic volume, or EDV) to its maximum.",
              "The ECG shows the P wave, which represents atrial depolarization — the electrical signal that triggers the contraction.",
              "The aortic and pulmonary valves remain closed during this phase because ventricular pressure is still lower than arterial pressure.",
            ],
            callout: {
              kind: "tip",
              title: "Clinical pearl: Atrial fibrillation",
              text: "In atrial fibrillation, the atria quiver instead of contracting. The 'atrial kick' is lost, reducing ventricular filling by 15–25%. This is why patients with AF can feel fatigued — their cardiac output drops even if the heart rate seems normal.",
            },
          },
          {
            heading: "Phase 2: Ventricular Systole (0.3 s)",
            body: [
              "Ventricular systole is the powerful phase where the ventricles contract and eject blood into the great arteries. It is divided into two sub-phases:",
            ],
            bullets: [
              "Isovolumetric contraction (early) — All four valves are momentarily closed. The ventricles are contracting, but the pressure hasn't yet risen enough to open the aortic or pulmonary valves. Ventricular pressure rises rapidly (from ~5 to ~80 mmHg in the left ventricle) with no change in volume. This is when S1 ('Lub') is heard.",
              "Ejection phase — Once ventricular pressure exceeds arterial pressure, the aortic and pulmonary valves open. Blood is ejected forcefully: about 70 mL (stroke volume) leaves each ventricle. The ejection is not complete — about 50 mL (end-systolic volume, or ESV) remains.",
              "During ejection, the ECG shows the QRS complex (ventricular depolarization) followed by the T wave (ventricular repolarization).",
            ],
          },
          {
            heading: "Phase 3: Complete Cardiac Diastole (0.4 s)",
            body: [
              "Diastole is the longest phase of the cardiac cycle and is when the heart rests and refills. It is critical for coronary perfusion — the heart muscle itself receives most of its blood supply during diastole.",
            ],
            bullets: [
              "Isovolumetric relaxation — The ventricles begin to relax. All four valves are closed again. Ventricular pressure drops rapidly. This is when S2 ('Dub') is heard as the aortic and pulmonary valves snap shut.",
              "Rapid filling — Once ventricular pressure falls below atrial pressure, the mitral and tricuspid valves open. Blood that has been pooling in the atria flows rapidly into the ventricles, filling them to about 70% of their final volume.",
              "Diastasis (slow filling) — The remaining filling happens slowly as blood returns from the veins through the atria into the ventricles. This phase is shortened when heart rate increases.",
              "End-diastole — The atria contract (atrial systole again), completing ventricular filling and restarting the cycle.",
            ],
          },
          {
            heading: "Pressure Changes: The Wiggers Diagram",
            body: [
              "The Wiggers diagram is the classic visual representation of the cardiac cycle. It plots pressure, volume, ECG, and heart sounds against time. Key pressure relationships to remember:",
            ],
            bullets: [
              "Left atrial pressure peaks at about 10 mmHg during atrial systole, then drops as blood flows into the ventricle.",
              "Left ventricular pressure rises from ~5 mmHg (diastole) to ~120 mmHg (systole) — a 24-fold increase.",
              "Aortic pressure oscillates between 80 mmHg (diastolic) and 120 mmHg (systolic), with a dicrotic notch marking aortic valve closure.",
              "The crossover point where ventricular pressure exceeds atrial pressure is when the AV valves close (S1). The crossover where ventricular pressure falls below aortic pressure is when the aortic valve closes (S2).",
            ],
          },
          {
            heading: "Heart Sounds in Detail",
            body: [
              "Beyond the basic S1 and S2, clinicians listen for abnormal sounds that reveal pathology:",
            ],
            bullets: [
              "S1 (Lub) — Loudest at the apex. Caused by mitral and tricuspid valve closure. Splitting occurs when the two valves don't close simultaneously (e.g., right bundle branch block).",
              "S2 (Dub) — Loudest at the base. Caused by aortic (A2) and pulmonary (P2) valve closure. Physiological splitting happens during inspiration (increased venous return delays pulmonary valve closure).",
              "S3 (ventricular gallop) — A low-pitched sound in early diastole from rapid ventricular filling. Normal in young adults but suggests heart failure in older patients.",
              "S4 (atrial gallop) — A low-pitched sound in late diastole from atrial contraction against a stiff ventricle. Suggests diastolic dysfunction or left ventricular hypertrophy.",
              "Murmurs — Turbulent blood flow heard as a whooshing sound, graded I–VI by intensity. They indicate valvular stenosis (narrowing), regurgitation (leaking), or shunts.",
            ],
            callout: {
              kind: "warning",
              title: "Murmur grading (Levine scale)",
              text: "Grade I: barely audible. Grade II: soft but clearly heard. Grade III: moderately loud. Grade IV: loud with a thrill (palpable vibration). Grade V: very loud, heard with stethoscope barely on chest. Grade VI: heard without the stethoscope on the chest. Grades III+ are always pathological.",
            },
          },
          {
            heading: "Clinical Relevance",
            body: [
              "Understanding the cardiac cycle is essential for diagnosing and managing cardiac diseases. Here are the most important clinical connections:",
            ],
            bullets: [
              "Heart failure (systolic) — The ventricles can't contract effectively. Stroke volume drops, so the heart rate increases to compensate. The ejection fraction (EF = SV/EDV × 100) falls below 55%. Filling pressures rise, causing fluid backing up into the lungs (congestion).",
              "Heart failure (diastolic) — The ventricles are stiff and can't relax properly. They resist filling, so EDV is reduced. The atria must generate higher pressures to push blood in, which can cause atrial fibrillation. EF is preserved (≥55%), but cardiac output is still compromised.",
              "Aortic stenosis — The aortic valve narrows, increasing the pressure gradient the left ventricle must generate to eject blood. Over time, the LV hypertrophies (thickens) to compensate. Eventually, it can fail, leading to syncope, angina, and heart failure.",
              "Mitral regurgitation — The mitral valve doesn't close properly, allowing blood to leak back into the left atrium during ventricular systole. This reduces forward stroke volume and increases atrial pressure, potentially causing pulmonary edema.",
              "Cardiac tamponade — Fluid accumulates in the pericardial sac, compressing the heart. Both diastolic filling and systolic ejection are impaired, causing a dramatic drop in cardiac output. The classic triad: hypotension, muffled heart sounds, and jugular venous distension.",
              "Conduction disorders — Damage to the conduction system (SA node → AV node → Bundle of His → Purkinje fibres) disrupts the timing of the cycle. A heart block delays or prevents atrial signals from reaching the ventricles, causing bradycardia or dissociation.",
            ],
          },
        ],
        keyPoints: [
          "Atrial systole (0.1 s): atria contract, AV valves open, ventricles fill to EDV (~130 mL).",
          "Ventricular systole (0.3 s): isovolumetric contraction → ejection. LV pressure reaches ~120 mmHg. S1 heard.",
          "Complete diastole (0.4 s): isovolumetric relaxation (S2 heard) → rapid filling → slow filling → atrial kick.",
          "S3 gallop in older patients = heart failure. S4 gallop = stiff ventricle (diastolic dysfunction).",
          "Ejection fraction < 55% = systolic heart failure. Preserved EF but stiff ventricles = diastolic heart failure.",
        ],
      },
    ],
  },
  {
    slug: "action-potential",
    title: "The Action Potential",
    emoji: "⚡",
    category: "Neuroscience",
    summary:
      "The action potential is the electrical impulse that allows neurons to communicate. It is the fundamental unit of signalling in the nervous system — understanding it is essential for neurology, pharmacology, and cardiology.",
    readMinutes: 10,
    sections: [
      {
        heading: "What is an action potential?",
        body: [
          "An action potential (AP) is a rapid, temporary reversal of the electrical charge across a neuron's membrane. It is how one neuron sends a message to the next — an all-or-nothing electrical wave that travels down the axon at speeds up to 120 m/s.",
          "At rest, the inside of a neuron is negatively charged compared to the outside (about -70 mV). When the neuron is stimulated enough to reach a threshold, voltage-gated ion channels open in a precise sequence, causing a rapid depolarisation followed by repolarisation and a brief hyperpolarisation before returning to rest.",
        ],
      },
    ],
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
              "Every time you think, feel, move, or see, billions of neurons are firing action potentials. An action potential is a quick electrical signal that travels along a nerve fibre. Think of it as a domino effect: one neuron fires, releasing chemicals (neurotransmitters) that trigger the next neuron to fire, and so on.",
              "The key idea is the 'all-or-nothing' principle: either the neuron fires a full-strength action potential, or it does not fire at all. There is no such thing as a 'half' action potential. The strength of a stimulus is encoded not by the size of the signal, but by how frequently the neurons fire (frequency coding).",
            ],
          },
          {
            heading: "Key Terms You Must Know",
            bullets: [
              "Resting Membrane Potential (RMP) — The charge across the neuron's membrane when it is not firing. About -70 mV in most neurons. Maintained by the Na+/K+ ATPase pump (3 Na+ out, 2 K+ in) and leak channels.",
              "Threshold — The critical voltage (about -55 mV) at which voltage-gated sodium channels open and the action potential is triggered. Below threshold = no AP.",
              "Depolarisation — The inside of the cell becomes less negative (more positive) as Na+ rushes in. The membrane potential shoots up from -70 mV to about +30 mV.",
              "Repolarisation — K+ channels open and K+ rushes out, making the inside negative again. The membrane potential drops back down.",
              "Hyperpolarisation — K+ channels are slow to close, so the membrane briefly becomes more negative than -70 mV (about -90 mV) before returning to rest.",
              "Refractory Period — The brief time after an AP when the neuron cannot fire again. The absolute refractory period means no AP is possible; the relative refractory period requires a stronger-than-normal stimulus.",
            ],
            callout: {
              kind: "tip",
              title: "The all-or-nothing principle",
              text: "A neuron either fires a full action potential or does not fire at all. The brain encodes stimulus intensity by changing the frequency of firing, not the size of each spike.",
            },
          },
          {
            heading: "The five phases of an action potential",
            body: [
              "Here is the simplest way to walk through each phase:",
            ],
            bullets: [
              "1. Resting state (-70 mV) — The neuron is at rest. Na+ and K+ channels are closed. The Na+/K+ pump maintains the -70 mV gradient.",
              "2. Depolarisation (rising phase) — A stimulus reaches threshold (-55 mV). Voltage-gated Na+ channels snap open. Na+ floods in. The membrane potential rockets to about +30 mV.",
              "3. Repolarisation (falling phase) — Na+ channels inactivate. Voltage-gated K+ channels open (more slowly). K+ rushes out, bringing the potential back down.",
              "4. Hyperpolarisation (undershoot) — K+ channels are slow to close. The potential dips below -70 mV to about -90 mV. This is the relative refractory period.",
              "5. Return to rest — K+ channels finally close. The Na+/K+ pump restores the ion balance. The neuron is ready to fire again.",
            ],
          },
          {
            heading: "Why does this matter clinically?",
            body: [
              "Understanding action potentials explains how local anaesthetics work (they block Na+ channels, preventing pain signals), why hyperkalaemia is dangerous (high K+ shifts the resting potential closer to threshold, causing spontaneous firing and cardiac arrhythmias), and how drugs like carbamazepine and phenytoin treat epilepsy (they stabilise the inactivated state of Na+ channels).",
            ],
          },
        ],
        keyPoints: [
          "Resting membrane potential is -70 mV, maintained by the Na+/K+ ATPase pump.",
          "Threshold is about -55 mV — reach it and the neuron fires; miss it and nothing happens.",
          "Depolarisation = Na+ influx. Repolarisation = K+ efflux. Hyperpolarisation = K+ overshoot.",
          "All-or-nothing: the neuron fires at full strength or not at all.",
          "Refractory periods prevent back-propagation and limit maximum firing rate.",
        ],
      },
      {
        id: "in-depth",
        label: "In-Depth",
        icon: "🔬",
        sections: [
          {
            heading: "Molecular basis of the action potential",
            body: [
              "The action potential depends on the sequential opening and closing of voltage-gated ion channels. Each channel type has a unique voltage-sensing domain (S4 segment) that responds to changes in membrane potential. The precise timing and coordination of these channels create the stereotyped waveform of the AP.",
              "Voltage-gated Na+ channels exist in three states: closed (resting), open (conducting), and inactivated. The inactivated state is critical — it is this state that creates the absolute refractory period. The inactivation gate (the 'h gate' or ball-and-chain mechanism) plugs the channel pore from the intracellular side within about 0.5 ms of opening.",
            ],
          },
          {
            heading: "The Hodgkin-Huxley model",
            body: [
              "In 1952, Alan Hodgkin and Andrew Huxley published their mathematical model of the squid giant axon action potential, for which they later won the Nobel Prize (1963). Their model describes how the membrane current is the sum of:",
            ],
            bullets: [
              "INa = gNa * m^3 * h * (Vm - ENa) — Sodium current, where m is the activation variable, h is the inactivation variable, and ENa is the sodium equilibrium potential (+60 mV).",
              "IK = gK * n^4 * (Vm - EK) — Potassium current, where n is the activation variable and EK is the potassium equilibrium potential (-90 mV).",
              "IL = gL * (Vm - EL) — Leak current (predominantly Cl- and background K+).",
              "The total membrane current: Cm * dV/dt = -(INa + IK + IL) + Iext.",
            ],
            callout: {
              kind: "tip",
              title: "Hodgkin-Huxley in a nutshell",
              text: "m^3 means three independent activation gates must all open for Na+ to conduct. n^4 means four independent gates for K+. This explains why Na+ channels activate faster than K+ channels (m gates are faster than n gates).",
            },
          },
          {
            heading: "Ion concentrations and equilibrium potentials",
            body: [
              "The resting membrane potential is determined by the Goldman-Hodgkin-Katz equation, which accounts for the relative permeabilities and concentrations of all permeant ions. At rest, the membrane is most permeable to K+ (through leak channels), so the resting potential (-70 mV) is close to EK (-90 mV).",
            ],
            bullets: [
              "Intracellular Na+: ~15 mM. Extracellular Na+: ~145 mM. ENa: +60 mV.",
              "Intracellular K+: ~140 mM. Extracellular K+: ~4 mM. EK: -90 mV.",
              "Intracellular Cl-: ~10 mM. Extracellular Cl-: ~110 mM. ECl: -70 to -80 mV.",
              "The Na+/K+ ATPase uses 1 ATP to pump 3 Na+ out and 2 K+ in, creating an electrogenic net outward current that contributes about -4 mV to the resting potential.",
            ],
          },
          {
            heading: "Saltatory conduction and myelination",
            body: [
              "In myelinated axons, voltage-gated Na+ channels are concentrated at the nodes of Ranvier (gaps in the myelin sheath, ~1 um wide). The action potential 'jumps' from node to node rather than propagating continuously along the entire membrane. This is saltatory conduction (from Latin saltare, 'to leap').",
            ],
            bullets: [
              "Myelinated fibres conduct at up to 120 m/s (A-alpha fibres). Unmyelinated C fibres conduct at only 0.5-2 m/s.",
              "Demyelinating diseases (e.g., multiple sclerosis, Guillain-Barre syndrome) slow or block conduction, causing weakness, sensory loss, and other neurological deficits.",
              "The refractory period ensures unidirectional propagation: the region behind the AP is refractory, so the signal can only travel forward.",
              "Cable properties: conduction velocity in myelinated fibres is proportional to axon diameter. In unmyelinated fibres, it is proportional to the square root of diameter.",
            ],
          },
          {
            heading: "Synaptic transmission: from AP to signal",
            body: [
              "When the action potential reaches the axon terminal, it opens voltage-gated Ca2+ channels. Ca2+ influx triggers synaptic vesicles to fuse with the presynaptic membrane (SNARE complex) and release neurotransmitters into the synaptic cleft. These bind to receptors on the postsynaptic neuron, generating either:",
            ],
            bullets: [
              "Excitatory Postsynaptic Potentials (EPSPs) — Na+ or Ca2+ influx makes the postsynaptic neuron more likely to fire. Mediated by AMPA, NMDA, and kainate glutamate receptors.",
              "Inhibitory Postsynaptic Potentials (IPSPs) — Cl- influx or K+ efflux makes the postsynaptic neuron less likely to fire. Mediated by GABA-A (Cl- channel) and glycine receptors.",
              "Spatial and temporal summation: multiple EPSPs/IPSPs from different locations (spatial) or at different times (temporal) are summed at the axon hillock. If the sum reaches threshold, a new AP fires.",
            ],
            callout: {
              kind: "warning",
              title: "Clinical pearl: Channelopathies",
              text: "Mutations in voltage-gated Na+ or K+ channels cause diseases such as episodic ataxia type 1 (KCNA1), paramyotonia congenita (SCN4A), and certain forms of epilepsy (SCN1A). Understanding the AP helps explain both the disease mechanism and drug treatment.",
            },
          },
          {
            heading: "Pharmacology of the action potential",
            body: [
              "Many clinically important drugs work by modifying ion channel behaviour during the action potential:",
            ],
            bullets: [
              "Local anaesthetics (lidocaine, bupivacaine) block Na+ channels from the intracellular side, preventing AP generation and propagation in pain fibres. They preferentially block actively firing nerves (use-dependent block).",
              "Antiepileptics (carbamazepine, phenytoin, lamotrigine) stabilise the inactivated state of Na+ channels, reducing high-frequency repetitive firing while preserving normal single-spike conduction.",
              "Class I antiarrhythmics (procainamide, flecainide) block cardiac Na+ channels (Nav1.5), slowing conduction velocity in the heart.",
              "Tetrodotoxin (TTX, from pufferfish) and saxitoxin (from dinoflagellates) block the outer pore of Na+ channels, completely preventing AP generation. They are extremely toxic.",
              "4-aminopyridine (4-AP) blocks K+ channels, prolonging the AP. Used experimentally in demyelination research to improve conduction in demyelinated axons.",
            ],
          },
        ],
        keyPoints: [
          "Na+ channels have three states: closed, open, and inactivated. The inactivated state creates the absolute refractory period.",
          "The Hodgkin-Huxley model describes AP as the sum of Na+, K+, and leak currents with voltage-dependent conductances.",
          "Saltatory conduction in myelinated fibres is ~50x faster than continuous conduction in unmyelinated fibres.",
          "At the synapse, Ca2+ influx triggers neurotransmitter release; EPSPs and IPSPs are summed at the axon hillock.",
          "Many drugs target AP channels: local anaesthetics (Na+ blockers), antiepileptics (Na+ stabilisers), and antiarrhythmics (cardiac Na+ blockers).",
        ],
      },
    ],
  },
  {
    slug: "muscle-contraction",
    title: "Muscle Contraction",
    emoji: "\ud83d\udcaa",
    category: "Physiology",
    summary:
      "Muscle contraction is the process by which muscle fibres generate force and movement. Understanding the sliding filament theory and excitation-contraction coupling is essential for physiology, pharmacology, and clinical medicine.",
    readMinutes: 10,
    sections: [
      {
        heading: "Muscle contraction overview",
        body: [
          "Muscle contraction occurs when actin and myosin filaments slide past each other within a sarcomere, shortening the muscle fibre. This process requires calcium and ATP, and is triggered by a nerve impulse.",
        ],
      },
    ],
    keyPoints: [],
    whenToCall: [],
    tabs: [
      {
        id: "basics",
        label: "Basics",
        icon: "\ud83d\udcd6",
        sections: [
          {
            heading: "What is the Sliding Filament Theory?",
            body: [
              "The sliding filament theory explains how muscles contract. Inside every muscle fibre are repeating units called sarcomeres. Each sarcomere contains two types of protein filaments: thick filaments (made of myosin) and thin filaments (made of actin).",
              "When a muscle contracts, the myosin heads bind to actin and pull the thin filaments toward the centre of the sarcomere. The sarcomere shortens, but the filaments themselves do not change length \u2014 they slide past each other. This is why it is called the sliding filament theory.",
            ],
          },
          {
            heading: "Key Terms You Must Know",
            bullets: [
              "Actin \u2014 A thin, helical protein that forms the thin filament. It has binding sites for myosin heads, but these are normally covered by tropomyosin at rest.",
              "Myosin \u2014 A thick protein with a tail and a globular head. The myosin head has an ATP-binding site and an actin-binding site. It acts as a molecular motor, using ATP energy to pull actin.",
              "Sarcomere \u2014 The basic functional unit of a muscle fibre, extending from one Z-disc to the next. It contains the overlapping arrangement of actin and myosin filaments.",
              "Troponin \u2014 A regulatory protein complex bound to actin. When calcium binds to troponin C, it causes a conformational change that moves tropomyosin away from the myosin-binding sites on actin.",
              "Tropomyosin \u2014 A rope-like protein that lies along the actin filament, blocking the myosin-binding sites at rest. It is moved aside by troponin when calcium levels rise.",
            ],
            callout: {
              kind: "tip",
              title: "Think of it like a relay race",
              text: "Troponin is the gatekeeper, calcium is the key, tropomyosin is the locked gate, actin is the track, and myosin is the runner. When calcium unlocks the gate, myosin can run along actin.",
            },
          },
          {
            heading: "The role of Calcium and ATP",
            body: [
              "Calcium is the on-switch for muscle contraction. At rest, calcium is stored in the sarcoplasmic reticulum (SR). When a nerve impulse arrives, calcium is released from the SR into the cytoplasm.",
            ],
            bullets: [
              "Calcium binds to troponin C, which moves tropomyosin off the myosin-binding sites on actin. This exposes the binding sites so myosin heads can attach.",
              "ATP is the fuel for contraction. Each myosin head cycle requires one ATP molecule. ATP is needed for the power stroke, detachment, and re-cocking of the myosin head.",
              "Without ATP, myosin cannot detach from actin. This is why muscles stiffen after death (rigor mortis).",
              "ATP is regenerated by: (1) creatine phosphate (immediate, ~10 seconds); (2) anaerobic glycolysis (fast, produces lactate, ~1-2 minutes); (3) aerobic respiration (slow but sustainable).",
            ],
          },
          {
            heading: "How a muscle fibre receives a signal",
            body: [
              "A motor neuron releases acetylcholine (ACh) at the neuromuscular junction. ACh binds to nicotinic receptors on the sarcolemma, generating an end-plate potential that triggers an action potential along the sarcolemma and into the T-tubules.",
              "The action potential in the T-tubules activates voltage-sensitive DHPRs, which are mechanically coupled to ryanodine receptors (RyR1) on the SR. This opens RyR1, releasing calcium into the cytoplasm.",
              "Once calcium is released, it binds to troponin, tropomyosin moves, and the cross-bridge cycle begins.",
            ],
          },
        ],
        keyPoints: [
          "The sliding filament theory: myosin pulls actin filaments toward the centre of the sarcomere, shortening it.",
          "Calcium is the on-switch: it binds troponin, which moves tropomyosin to expose myosin-binding sites on actin.",
          "ATP provides energy for the power stroke, myosin detachment, and re-cocking of the myosin head.",
          "Without ATP, myosin cannot detach \u2014 this causes rigor mortis after death.",
          "ACh at the neuromuscular junction triggers the action potential that leads to calcium release.",
        ],
      },
      {
        id: "in-depth",
        label: "In-Depth",
        icon: "\ud83d\udd2c",
        sections: [
          {
            heading: "The Cross-Bridge Cycle step-by-step",
            body: [
              "The cross-bridge cycle is the molecular mechanism by which myosin generates force on actin:",
            ],
            bullets: [
              "Step 1 \u2014 Cross-bridge formation: The myosin head (with ADP + Pi bound) attaches to the exposed binding site on actin.",
              "Step 2 \u2014 Power stroke: The myosin head pivots, pulling actin toward the M-line. ADP and Pi are released. The sarcomere shortens by about 10 nm per stroke.",
              "Step 3 \u2014 Detachment: A new ATP molecule binds to the myosin head, causing it to detach from actin.",
              "Step 4 \u2014 Re-cocking: Myosin ATPase hydrolyses ATP to ADP + Pi, re-cocking the myosin head for the next cycle.",
              "The cycle repeats ~5 times per second. Multiple myosin heads cycle asynchronously, ensuring continuous force.",
            ],
            callout: {
              kind: "tip",
              title: "Rate-limiting step",
              text: "The power stroke is the rate-limiting step. Fast-twitch fibres have myosin ATPase that works faster, allowing quicker cross-bridge cycling.",
            },
          },
          {
            heading: "Excitation-Contraction Coupling",
            body: [
              "E-C coupling links the electrical signal (action potential) to the mechanical response (contraction):",
            ],
            bullets: [
              "Skeletal muscle: DHPRs (Cav1.1) are mechanically coupled to RyR1 on the SR. Direct coupling \u2014 no Ca2+ influx needed.",
              "Cardiac muscle: L-type Ca2+ channels (Cav1.2) allow Ca2+ influx, which triggers RyR2 on the SR to release more Ca2+. This is calcium-induced calcium release (CICR).",
              "Smooth muscle: Ca2+ binds calmodulin, activating MLCK, which phosphorylates myosin light chains to enable cross-bridge cycling.",
              "Relaxation: SERCA pumps Ca2+ back into the SR; Na+/Ca2+ exchanger moves it out of the cell.",
            ],
          },
          {
            heading: "Skeletal vs Cardiac vs Smooth Muscle",
            body: [
              "The three muscle types differ fundamentally:",
            ],
            bullets: [
              "Skeletal: Striated, multinucleated, voluntary. Troponin-tropomyosin regulation. Fatigues relatively quickly.",
              "Cardiac: Striated, involuntary. CICR and troponin. Autorhythmicity. Cannot fatigue. Intercalated discs allow synchronous contraction.",
              "Smooth: Non-striated, involuntary. Calmodulin-MLCK regulation. Sustained tonic contraction (latch state). Found in blood vessels, GI tract, bladder, airways.",
            ],
          },
          {
            heading: "Clinical Relevance",
            body: [
              "Understanding muscle contraction is essential for diagnosing and treating many conditions:",
            ],
            bullets: [
              "Myasthenia gravis: Autoimmune destruction of nicotinic ACh receptors. Fluctuating weakness, ptosis, diplopia. Treated with pyridostigmine.",
              "Muscle fatigue: H+ accumulation, inorganic phosphate buildup, and glycogen depletion reduce cross-bridge force.",
              "Rigor mortis: No ATP means myosin cannot detach from actin. Used in forensic medicine to estimate time of death.",
              "Malignant hyperthermia: RyR1 mutations cause uncontrolled Ca2+ release under certain anaesthetics. Treated with dantrolene.",
              "Periodic paralysis: Channelopathies (Nav1.4, Kir2.1) cause episodes of skeletal muscle weakness.",
            ],
            callout: {
              kind: "warning",
              title: "Red flag: Rhabdomyolysis",
              text: "Crushing injuries, extreme exertion, or statins can cause muscle breakdown. Myoglobin releases into blood, risking kidney injury. Watch for dark urine, muscle pain, elevated CK.",
            },
          },
        ],
        keyPoints: [
          "Cross-bridge cycle: attach, power stroke, detach, re-cock. One ATP per cycle, ~10 nm displacement.",
          "Skeletal E-C coupling: DHPR mechanically gates RyR1. Cardiac: calcium-induced calcium release (CICR).",
          "Smooth muscle uses calmodulin-MLCK instead of troponin for sustained contraction.",
          "Myasthenia gravis: autoimmune ACh receptor destruction causes fluctuating weakness.",
          "Rigor mortis: no ATP = no detachment. Forensic time-of-death estimation.",
        ],
      },
    ],
  },
  {
    slug: "respiratory-mechanics",
    title: "Respiratory Mechanics",
    emoji: "\ud83e\ude78",
    category: "Physiology",
    summary:
      "Respiratory mechanics covers how we breathe, how gas exchange occurs in the lungs, and the physical laws that govern ventilation. Understanding tidal volume, Boyle's law, and lung compliance is essential for physiology, anaesthesia, and pulmonary medicine.",
    readMinutes: 9,
    sections: [
      {
        heading: "Respiratory mechanics overview",
        body: [
          "Every breath you take is a mechanical process driven by pressure changes in the thoracic cavity. The diaphragm contracts, the chest expands, and air flows in along a pressure gradient. Understanding these mechanics is the foundation of pulmonary medicine.",
        ],
      },
    ],
    keyPoints: [],
    whenToCall: [],
    tabs: [
      {
        id: "basics",
        label: "Basics",
        icon: "\ud83d\udcd6",
        sections: [
          {
            heading: "How breathing works",
            body: [
              "Breathing (ventilation) is the process of moving air into and out of the lungs. It is driven by pressure differences between the atmosphere and the alveoli. When the pressure inside the lungs drops below atmospheric pressure, air flows in (inspiration). When it rises above atmospheric pressure, air flows out (expiration).",
              "At rest, we breathe about 12-20 times per minute, moving roughly 500 mL of air with each breath. This is called the tidal volume. The total air moved in one minute is the minute ventilation: tidal volume x respiratory rate.",
            ],
          },
          {
            heading: "Key Terms You Must Know",
            bullets: [
              "Tidal Volume (TV) \u2014 The volume of air moved in or out of the lungs during a single normal breath. About 500 mL in a healthy adult at rest. It is the most basic measure of ventilation.",
              "Diaphragm \u2014 A dome-shaped sheet of skeletal muscle at the base of the thoracic cavity. It is the primary muscle of inspiration. When it contracts, it flattens and moves downward, increasing thoracic volume and drawing air into the lungs.",
              "Inspiratory muscles \u2014 The diaphragm is the main inspiratory muscle. The external intercostals assist by lifting the ribs upward and outward, further expanding the chest. During forced inspiration, accessory muscles (scalenes, sternocleidomastoid) are recruited.",
              "Expiratory muscles \u2014 Quiet expiration is passive: the diaphragm and intercostals simply relax, and elastic recoil of the lungs pushes air out. During forced expiration (coughing, exercise), the internal intercostals and abdominal muscles contract to actively push air out.",
              "Alveoli \u2014 Tiny air sacs at the end of the bronchial tree where gas exchange occurs. There are approximately 300-500 million alveoli in the lungs, providing a massive surface area (~70 m2) for oxygen and carbon dioxide exchange.",
            ],
            callout: {
              kind: "tip",
              title: "Think of it like a pump",
              text: "The lungs are like a bellows. The diaphragm is the handle: pull it down and air rushes in; let it go back up and air pushes out. The ribcage is the frame that protects and shapes the bellows.",
            },
          },
          {
            heading: "Volumes and capacities",
            body: [
              "Lung volumes are measured using spirometry and are important for diagnosing respiratory diseases. The key volumes and their combinations (capacities) are:",
            ],
            bullets: [
              "Tidal Volume (TV): ~500 mL \u2014 normal breath.",
              "Inspiratory Reserve Volume (IRV): ~3100 mL \u2014 extra air you can inhale after a normal inspiration.",
              "Expiratory Reserve Volume (ERV): ~1200 mL \u2014 extra air you can exhale after a normal expiration.",
              "Residual Volume (RV): ~1200 mL \u2014 air left in the lungs after a maximal exhalation. You cannot breathe this out.",
              "Inspiratory Capacity (IC) = TV + IRV: maximum air you can inhale from rest.",
              "Vital Capacity (VC) = TV + IRV + ERV: maximum air you can move in and out. About 4800 mL.",
              "Total Lung Capacity (TLC) = VC + RV: all the air the lungs can hold. About 6000 mL.",
            ],
          },
          {
            heading: "The role of the diaphragm",
            body: [
              "The diaphragm is responsible for about 75% of the work of breathing at rest. When it contracts, it moves downward by 1-2 cm during quiet breathing and up to 10 cm during forced breathing.",
              "The phrenic nerve (C3, C4, C5 \u2014 'C3, 4, 5 keeps the diaphragm alive') innervates the diaphragm. Damage to the phrenic nerve (e.g., from spinal cord injury above C3) causes paralysis of the diaphragm and respiratory failure, requiring mechanical ventilation.",
            ],
          },
        ],
        keyPoints: [
          "Breathing is driven by pressure differences: air flows from high pressure to low pressure.",
          "Tidal volume is ~500 mL per normal breath; minute ventilation = TV x respiratory rate.",
          "The diaphragm is the primary muscle of inspiration, responsible for ~75% of breathing work.",
          "Quiet expiration is passive (elastic recoil); forced expiration uses abdominal muscles.",
          "Phrenic nerve (C3-C5) innervates the diaphragm \u2014 damage above C3 causes respiratory failure.",
        ],
      },
      {
        id: "in-depth",
        label: "In-Depth",
        icon: "\ud83d\udd2c",
        sections: [
          {
            heading: "Boyle's Law and Ventilation",
            body: [
              "Boyle's Law states that at constant temperature, the pressure of a gas is inversely proportional to its volume (P1V1 = P2V2). This is the fundamental physical principle behind ventilation.",
            ],
            bullets: [
              "During inspiration: The diaphragm contracts and descends, increasing thoracic volume. By Boyle's Law, alveolar pressure drops below atmospheric pressure (-1 cmH2O relative to atmosphere). Air flows into the lungs down this pressure gradient.",
              "During expiration: The diaphragm relaxes and returns to its dome shape, decreasing thoracic volume. Alveolar pressure rises above atmospheric pressure (+1 cmH2O). Air flows out.",
              "Intrapleural pressure (pressure in the pleural cavity between the visceral and parietal pleura) is always negative relative to atmospheric pressure (-4 to -6 cmH2O at rest). This negative pressure keeps the lungs inflated. If air enters the pleural space (pneumothorax), the negative pressure is lost and the lung collapses.",
              "Transmural pressure across the lungs = alveolar pressure minus intrapleural pressure. This pressure difference keeps the lungs expanded against the elastic recoil of the chest wall.",
            ],
            callout: {
              kind: "tip",
              title: "Boyle's Law in a nutshell",
              text: "Volume up \u2192 Pressure down \u2192 Air rushes in. Volume down \u2192 Pressure up \u2192 Air rushes out. The diaphragm controls the volume change, and Boyle's Law does the rest.",
            },
          },
          {
            heading: "Lung Compliance and Elastic Recoil",
            body: [
              "Lung compliance is the ease with which the lungs can be expanded. It is defined as the change in volume per unit change in pressure (dV/dP). High compliance means the lungs expand easily; low compliance means they are stiff and hard to inflate.",
            ],
            bullets: [
              "Normal lung compliance is about 200 mL/cmH2O. This means 200 mL of air enters the lungs for every 1 cmH2O drop in pressure.",
              "High compliance (emphysema): The lung tissue is destroyed (elastic fibres lost), so the lungs expand too easily but cannot recoil to push air out. Air trapping occurs. Patients have difficulty exhaling.",
              "Low compliance (pulmonary fibrosis, ARDS): The lung tissue becomes scarred or inflamed, making the lungs stiff. Greater pressure is needed to achieve the same tidal volume. Patients have difficulty inhaling and have rapid, shallow breathing.",
              "Surfactant: A phospholipid mixture (mainly dipalmitoylphosphatidylcholine, DPPC) produced by Type II alveolar cells. It reduces surface tension at the air-liquid interface in the alveoli, preventing collapse (atelectasis) and increasing compliance. Without surfactant (e.g., in premature infants), the work of breathing is greatly increased.",
              "Chest wall compliance is also important. Obesity, kyphoscoliosis, and chest wall oedema reduce chest wall compliance, increasing the work of breathing.",
            ],
          },
          {
            heading: "Gas Exchange and Diffusion",
            body: [
              "Gas exchange occurs at two levels: external respiration (alveoli to blood) and internal respiration (blood to tissues). The process is governed by Fick's Law of Diffusion and partial pressure gradients.",
            ],
            bullets: [
              "Fick's Law: Rate of diffusion is proportional to (surface area x diffusion coefficient x partial pressure difference) / membrane thickness. The alveolar-capital membrane is extremely thin (~0.5 um) and has a massive surface area (~70 m2), optimising gas exchange.",
              "Partial pressure gradients: Oxygen diffuses from alveoli (PO2 ~104 mmHg) to pulmonary capillary blood (PO2 ~40 mmHg). Carbon dioxide diffuses from blood (PCO2 ~45 mmHg) to alveoli (PCO2 ~40 mmHg). Despite the smaller CO2 gradient, CO2 diffuses ~20x faster than O2 because it is much more soluble.",
              "Ventilation-perfusion (V/Q) matching: Efficient gas exchange requires matching airflow (ventilation, V) to blood flow (perfusion, Q). The ideal V/Q ratio is ~1.0. Shunt (V/Q = 0, perfused but not ventilated) and dead space (V/Q = infinity, ventilated but not perfused) impair gas exchange.",
              "Oxygen-haemoglobin dissociation curve: The sigmoid shape reflects cooperative binding of O2 to haemoglobin. At the lungs (PO2 ~100 mmHg), haemoglobin is ~98% saturated. At the tissues (PO2 ~40 mmHg), it releases O2, dropping to ~75% saturation.",
              "The Bohr effect: Increased CO2, decreased pH, increased temperature, and increased 2,3-DPG all shift the dissociation curve to the right, promoting O2 unloading at the tissues where it is needed most.",
            ],
          },
          {
            heading: "Clinical Relevance",
            body: [
              "Understanding respiratory mechanics is essential for diagnosing and treating pulmonary diseases:",
            ],
            bullets: [
              "Asthma: Chronic airway inflammation causes bronchoconstriction, mucus hypersecretion, and airway remodelling. This increases airway resistance, trapping air and causing expiratory difficulty. Treatment: bronchodilators (salbutamol, ipratropium) and inhaled corticosteroids (beclomethasone, budesonide). Peak expiratory flow rate (PEFR) is a key monitoring parameter.",
              "COPD (Chronic Obstructive Pulmonary Disease): Chronic bronchitis (mucus hypersecretion) and emphysema (alveolar destruction) coexist. Leads to air trapping, hyperinflation, and progressive airflow limitation. Treatment: long-acting bronchodilators (tiotropium), pulmonary rehabilitation, and supplemental oxygen in severe disease.",
              "Pneumothorax: Air enters the pleural space, eliminating the negative intrapleural pressure. The lung collapses on the affected side. Tension pneumothorax (one-way valve mechanism) is life-threatening: mediastinal shift compresses the opposite lung and great vessels. Immediate needle decompression is required.",
              "ARDS (Acute Respiratory Distress Syndrome): Severe inflammation increases alveolar-capillary membrane thickness and inactivates surfactant, drastically reducing lung compliance. Treatment: mechanical ventilation with low tidal volumes (6 mL/kg) to prevent ventilator-induced lung injury.",
              "Pulmonary embolism: A blood clot (usually from deep vein thrombosis) blocks a pulmonary artery, creating dead space (ventilated but not perfused). Sudden onset of dyspnoea, chest pain, and tachycardia. Treatment: anticoagulation (heparin, warfarin) or thrombolysis in massive PE.",
            ],
            callout: {
              kind: "warning",
              title: "Red flag: Tension pneumothorax",
              text: "Sudden dyspnoea + absent breath sounds on one side + tracheal deviation away from the affected side = tension pneumothorax. This is a clinical emergency. Do not wait for a chest X-ray. Insert a large-bore needle into the 2nd intercostal space, midclavicular line, immediately.",
            },
          },
        ],
        keyPoints: [
          "Boyle's Law: Volume increase \u2192 pressure decrease \u2192 air flows in. The diaphragm drives this volume change.",
          "Lung compliance is ~200 mL/cmH2O. Emphysema = high compliance; fibrosis = low compliance.",
          "Surfactant reduces alveolar surface tension, preventing collapse and increasing compliance.",
          "Gas exchange follows Fick's Law: large surface area, thin membrane, and partial pressure gradients.",
          "Asthma increases airway resistance via bronchoconstriction; treated with bronchodilators and corticosteroids.",
        ],
      },
    ],
  },
];

export const ARTICLE_CATEGORIES: string[] = Array.from(
  new Set(ARTICLES.map((a) => a.category)),
).sort();

export function articleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/** Total number of step-by-step instructions across the library. */
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

/** A plain-text reading of an article for the Read Aloud feature. */
function sectionsToSpeech(sections: ArticleSection[]): string[] {
  const parts: string[] = [];
  for (const section of sections) {
    parts.push(section.heading);
    if (section.body) parts.push(...section.body);
    if (section.steps) {
      section.steps.forEach((step, i) => parts.push(`Step ${i + 1}. ${step}`));
    }
    if (section.bullets) parts.push(...section.bullets);
    if (section.callout) parts.push(section.callout.title + ". " + section.callout.text);
  }
  return parts;
}

export function articleToSpeech(article: Article): string {
  const parts: string[] = [article.title];
  if (article.tabs) {
    for (const tab of article.tabs) {
      parts.push(`--- ${tab.label} ---`);
      parts.push(...sectionsToSpeech(tab.sections));
      if (tab.keyPoints.length > 0) {
        parts.push("Key points to remember.");
        parts.push(...tab.keyPoints);
      }
    }
  } else {
    parts.push(...sectionsToSpeech(article.sections));
    parts.push("Key points to remember.");
    parts.push(...article.keyPoints);
  }
  return parts.join(" ");
}
