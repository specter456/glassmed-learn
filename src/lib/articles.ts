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
];

export const ARTICLE_CATEGORIES: string[] = Array.from(
  new Set(ARTICLES.map((a) => a.category)),
).sort();

export function articleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/** Total number of step-by-step instructions across the library. */
export function totalSteps(): number {
  return ARTICLES.reduce(
    (sum, a) => sum + a.sections.reduce((s, sec) => s + (sec.steps?.length ?? 0), 0),
    0,
  );
}

/** A plain-text reading of an article for the Read Aloud feature. */
export function articleToSpeech(article: Article): string {
  const parts: string[] = [article.title];
  for (const section of article.sections) {
    parts.push(section.heading);
    if (section.body) parts.push(...section.body);
    if (section.steps) {
      section.steps.forEach((step, i) => parts.push(`Step ${i + 1}. ${step}`));
    }
    if (section.bullets) parts.push(...section.bullets);
    if (section.callout) parts.push(section.callout.title + ". " + section.callout.text);
  }
  parts.push("Key points to remember.");
  parts.push(...article.keyPoints);
  return parts.join(" ");
}
