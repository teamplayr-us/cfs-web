// Athlete participation waiver for the Showcase Combine & Camp.
// The single source for the /waiver page and the registration form, so the
// text a guardian signs is always the text published at /waiver.
//
// Drafted to be enforceable under Texas law (Dallas event): the release
// names negligence expressly (express negligence doctrine) and the release
// and indemnity language is conspicuous (bold caps). Texas courts generally
// won't enforce a parent's pre-injury release of a MINOR'S own claims, so
// the guardian also releases their own claims and indemnifies the Released
// Parties — the part that does hold. Have an attorney review before relying
// on it; if the operating entity's legal name changes, update Section 1.
//
// Bump WAIVER_VERSION on any substantive edit — it's stored with every
// registration so we know which text each guardian signed.

export const WAIVER_VERSION = "2026-09-29.2";

export interface WaiverSection {
  heading: string;
  /** Paragraphs; a paragraph wrapped in ** ** renders bold (conspicuous). */
  body: string[];
}

export const WAIVER_TITLE =
  "Participant Waiver, Release of Liability, Assumption of Risk, and Media Release";

export const WAIVER_SECTIONS: WaiverSection[] = [
  {
    heading: "1. Who this agreement covers",
    body: [
      "This agreement is between the parent or legal guardian signing it (\"Guardian\"), on their own behalf and on behalf of the registered athlete (\"Athlete\"), and the College Flag Showcase Series and its owners, operators, and organizers (together, the \"Series\").",
      "\"Released Parties\" means the Series; its officers, employees, staff, coaches, volunteers, contractors, and agents; its event partners, including the International Superflag Invitational and its operators; its sponsors; participating college programs and coaches; and the owners, operators, and managers of each event venue.",
      "\"Activities\" means the Showcase Combine & Camp and every related activity at or around the event, including warm-ups, drills, testing, instruction, scrimmages and games, filming, check-in, and time spent at the venue.",
    ],
  },
  {
    heading: "2. Eligibility and fitness to participate",
    body: [
      "Guardian confirms that Guardian is at least 18 years old and is the Athlete's parent or legal guardian with authority to sign this agreement; that the Athlete is eligible for the event as registered; and that the Athlete is in good health and physically able to participate. Guardian will tell event staff in writing about any condition, injury, allergy, or medication that affects the Athlete's safe participation.",
    ],
  },
  {
    heading: "3. Assumption of risk",
    body: [
      "Guardian understands that flag football and athletic testing involve inherent risks, even when played without tackling and with proper supervision. These risks include collisions with other players, falls, sprains, strains, fractures, dislocations, cuts, dental injuries, eye injuries, concussions and other head injuries, heat-related illness, exposure to weather, and, in rare cases, serious injury, permanent disability, or death. Risks can arise from the Athlete's own actions, the actions of others, field and facility conditions, equipment, and weather.",
      "**GUARDIAN KNOWINGLY AND VOLUNTARILY ASSUMES ALL OF THESE RISKS, KNOWN AND UNKNOWN, ON BEHALF OF THE ATHLETE AND THEMSELVES.**",
    ],
  },
  {
    heading: "4. Release of liability",
    body: [
      "**TO THE FULLEST EXTENT PERMITTED BY LAW, GUARDIAN, ON BEHALF OF THEMSELVES, THE ATHLETE, AND THEIR HEIRS, ASSIGNS, AND REPRESENTATIVES, RELEASES, WAIVES, AND DISCHARGES THE RELEASED PARTIES FROM ANY AND ALL CLAIMS, DEMANDS, LOSSES, AND LIABILITY FOR INJURY, ILLNESS, DEATH, OR PROPERTY DAMAGE ARISING OUT OF OR RELATED TO THE ACTIVITIES, INCLUDING CLAIMS CAUSED IN WHOLE OR IN PART BY THE NEGLIGENCE OF ANY RELEASED PARTY.**",
      "This release does not apply to gross negligence or intentional misconduct, or to any claim that cannot be released under applicable law.",
    ],
  },
  {
    heading: "5. Indemnity",
    body: [
      "**GUARDIAN AGREES TO INDEMNIFY, DEFEND, AND HOLD HARMLESS THE RELEASED PARTIES FROM ANY CLAIM, LOSS, OR EXPENSE (INCLUDING REASONABLE ATTORNEYS' FEES) BROUGHT BY OR ON BEHALF OF THE ATHLETE OR ANYONE CLAIMING THROUGH THE ATHLETE, ARISING OUT OF OR RELATED TO THE ACTIVITIES, INCLUDING CLAIMS ALLEGING THE NEGLIGENCE OF ANY RELEASED PARTY.**",
    ],
  },
  {
    heading: "6. Medical treatment",
    body: [
      "Event staff may, but are not required to, provide first aid. If the Athlete is injured or becomes ill and Guardian cannot be reached immediately, Guardian authorizes the Series and its staff to obtain emergency medical care and transportation for the Athlete, and authorizes licensed medical providers to give the treatment they consider necessary. Guardian is responsible for the cost of any treatment and transportation.",
    ],
  },
  {
    heading: "7. Concussion protocol",
    body: [
      "Guardian understands the signs of a concussion and agrees that any Athlete showing signs, symptoms, or behaviors consistent with a concussion will be removed from participation and will not return that day. Guardian agrees not to seek the Athlete's return to participation until she has been cleared in writing by a licensed health care professional.",
    ],
  },
  {
    heading: "8. Rules and conduct",
    body: [
      "The Athlete will follow the rules, instructions, and safety directions of event staff and venue personnel. The Series may remove any participant from the Activities for unsafe conduct, unsportsmanlike behavior, or a rules violation, without a refund.",
    ],
  },
  {
    heading: "9. Photo, video, and recruiting information",
    body: [
      "The Activities are filmed and photographed. Guardian grants the Series and its partners the irrevocable right, without payment, to record and use the Athlete's name, likeness, image, voice, biographical information, and athletic performance (including combine results and game film) in any media, for event coverage, recruiting, and promotion of the Series and its events.",
      "Guardian consents to the Series sharing the Athlete's registration information and event performance with college coaches credentialed for the event, for recruiting purposes. If Guardian opts the Athlete into the guest player pool, Guardian also consents to the Series making the Athlete's name, division, grad year, positions, hometown, club, and profile link, together with Guardian's name, email, and phone, available to club coaches of registered tournament teams, who may contact Guardian directly about a roster spot. Guardian may leave the pool at any time by emailing the Series.",
    ],
  },
  {
    heading: "10. Refunds and cancellations",
    body: [
      "Cancellation requests must be made at least 7 days before the event; requests inside that window are reviewed case by case. Events canceled due to circumstances beyond the Series' control receive credit toward future events.",
    ],
  },
  {
    heading: "11. General terms",
    body: [
      "This agreement is governed by the laws of the State of Texas. If any part of it is found unenforceable, the rest remains in full effect, and the unenforceable part will be enforced to the greatest extent permitted. This is the complete agreement on these subjects and covers all Series Activities the Athlete takes part in during the 2026–27 season.",
      "Guardian agrees that checking the agreement box and typing their full legal name at registration is their electronic signature and has the same effect as a handwritten signature.",
    ],
  },
  {
    heading: "12. Acknowledgment",
    body: [
      "**BY SIGNING, GUARDIAN CONFIRMS THAT THEY HAVE READ THIS AGREEMENT, UNDERSTAND THAT THEY ARE GIVING UP SUBSTANTIAL LEGAL RIGHTS, INCLUDING THE RIGHT TO SUE FOR NEGLIGENCE, AND SIGN IT VOLUNTARILY.**",
    ],
  },
];

/** The short statement shown next to the signature box on the form. */
export const WAIVER_SUMMARY =
  "I am the athlete's parent or legal guardian. I have read the Participant " +
  "Waiver, Release of Liability, Assumption of Risk, and Media Release, and " +
  "I agree to it on my own behalf and on the athlete's behalf.";
