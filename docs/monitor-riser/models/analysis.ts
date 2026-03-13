import { type Length, cm } from "@fea-lib/jscad";

export const volume = (speaker: {
  width: Length;
  height: Length;
  depth: Length;
}) =>
  (cm(speaker.width).value *
    cm(speaker.height).value *
    cm(speaker.depth).value) /
  1000;

export const internalWidth = (speaker: {
  width: Length;
  enclosureBoardThickness: Length;
}) =>
  cm(speaker.width).value - 2 * cm(speaker.enclosureBoardThickness).value;

export const internalHeight = (speaker: {
  height: Length;
  enclosureBoardThickness: Length;
}) =>
  cm(speaker.height).value - 2 * cm(speaker.enclosureBoardThickness).value;

export const internalDepth = (speaker: {
  depth: Length;
  enclosureBoardThickness: Length;
}) =>
  cm(speaker.depth).value - 2 * cm(speaker.enclosureBoardThickness).value;

export const internalVolume = (speaker: {
  width: Length;
  height: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) =>
  (internalWidth(speaker) * internalHeight(speaker) * internalDepth(speaker)) /
  1000;

export const plateArea_m2 = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) => (internalWidth(speaker) / 100) * (internalDepth(speaker) / 100);

export const plateMassKg = 3;
export const steelDensity = 7850;
export const graniteDensity = 2700;
export const leadDensity = 11340;
export const castIronDensity = 7200;

export const requiredThicknessSteel_m = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) => plateMassKg / (steelDensity * plateArea_m2(speaker));

export const requiredThicknessGranite_m = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) => plateMassKg / (graniteDensity * plateArea_m2(speaker));

export const requiredThicknessSteel_cm = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) => requiredThicknessSteel_m(speaker) * 100;

export const requiredThicknessGranite_cm = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) => requiredThicknessGranite_m(speaker) * 100;

export const steelE = 210e9;
export const stoneE = 50e9;
export const leadE = 16e9;
export const castIronE = 120e9;
export const poissonSteel = 0.3;
export const poissonStone = 0.25;
export const poissonLead = 0.44;
export const poissonCastIron = 0.27;

export const tSteel = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) => requiredThicknessSteel_m(speaker);

export const tGranite = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) => requiredThicknessGranite_m(speaker);

export const tLead = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) => plateMassKg / (leadDensity * plateArea_m2(speaker));

export const tCastIron = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) => plateMassKg / (castIronDensity * plateArea_m2(speaker));

export const D_steel = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) =>
  (steelE * Math.pow(tSteel(speaker), 3)) /
  (12 * (1 - Math.pow(poissonSteel, 2)));

export const D_granite = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) =>
  (stoneE * Math.pow(tGranite(speaker), 3)) /
  (12 * (1 - Math.pow(poissonStone, 2)));

export const D_lead = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) =>
  (leadE * Math.pow(tLead(speaker), 3)) / (12 * (1 - Math.pow(poissonLead, 2)));

export const D_castIron = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) =>
  (castIronE * Math.pow(tCastIron(speaker), 3)) /
  (12 * (1 - Math.pow(poissonCastIron, 2)));

export const mPerArea_steel = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) => steelDensity * tSteel(speaker);

export const mPerArea_granite = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) => graniteDensity * tGranite(speaker);

export const mPerArea_lead = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) => leadDensity * tLead(speaker);

export const mPerArea_castIron = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) => castIronDensity * tCastIron(speaker);

export const a_m = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) => Math.max(internalWidth(speaker), internalDepth(speaker)) / 100;

export const C = 1.0;
export const fFund_steel = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) =>
  C *
  Math.sqrt(
    D_steel(speaker) / (mPerArea_steel(speaker) * Math.pow(a_m(speaker), 4)),
  );

export const fFund_granite = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) =>
  C *
  Math.sqrt(
    D_granite(speaker) /
      (mPerArea_granite(speaker) * Math.pow(a_m(speaker), 4)),
  );

export const fFund_lead = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) =>
  C *
  Math.sqrt(
    D_lead(speaker) / (mPerArea_lead(speaker) * Math.pow(a_m(speaker), 4)),
  );

export const fFund_castIron = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) =>
  C *
  Math.sqrt(
    D_castIron(speaker) /
      (mPerArea_castIron(speaker) * Math.pow(a_m(speaker), 4)),
  );

export const fFund_steel_clamped = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) => fFund_steel(speaker) * 1.6;

export const fFund_granite_clamped = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) => fFund_granite(speaker) * 1.6;

export const fFund_lead_clamped = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) => fFund_lead(speaker) * 1.6;

export const fFund_castIron_clamped = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) => fFund_castIron(speaker) * 1.6;

export const acousticRatingSteel = 3;
export const acousticRatingGranite = 5;
export const acousticRatingLead = 8;
export const acousticRatingCastIron = 6;

export const neopreneIsolationFraction = 0.5;

export function fundamentalsScore(f: number) {
  if (f < 40) return 40;
  if (f < 200) return 20;
  return 0;
}

export function scoreFor(
  name: string,
  speaker: {
    width: Length;
    depth: Length;
    enclosureBoardThickness: Length;
  },
) {
  switch (name) {
    case "Steel":
      return Math.round(
        (acousticRatingSteel / 10) * 30 +
          fundamentalsScore(fFund_steel(speaker)) +
          neopreneIsolationFraction * 30,
      );
    case "Lead":
      return Math.round(
        (acousticRatingLead / 10) * 30 +
          fundamentalsScore(fFund_lead(speaker)) +
          neopreneIsolationFraction * 30,
      );
    case "CastIron":
      return Math.round(
        (acousticRatingCastIron / 10) * 30 +
          fundamentalsScore(fFund_castIron(speaker)) +
          neopreneIsolationFraction * 30,
      );
    case "Granite":
      return Math.round(
        (acousticRatingGranite / 10) * 30 +
          fundamentalsScore(fFund_granite(speaker)) +
          neopreneIsolationFraction * 30,
      );
    default:
      return 0;
  }
}

export function densityFor(name: string) {
  switch (name) {
    case "Steel":
      return steelDensity;
    case "Lead":
      return leadDensity;
    case "CastIron":
      return castIronDensity;
    case "Granite":
      return graniteDensity;
    default:
      return 0;
  }
}

export function thicknessCmFor(
  name: string,
  speaker: {
    width: Length;
    depth: Length;
    enclosureBoardThickness: Length;
  },
) {
  switch (name) {
    case "Steel":
      return requiredThicknessSteel_cm(speaker);
    case "Lead":
      return tLead(speaker) * 100;
    case "CastIron":
      return tCastIron(speaker) * 100;
    case "Granite":
      return requiredThicknessGranite_cm(speaker);
    default:
      return 0;
  }
}

export function notesFor(name: string) {
  switch (name) {
    case "Steel":
      return "Most compact; easy to machine and secure.";
    case "Lead":
      return "Very dense — thin sheets or inserts; toxic dust when cut; handle carefully.";
    case "CastIron":
      return "Dense and workable cast material; heavier than steel for same thickness.";
    case "Granite":
      return "Thicker; premium look if exposed; heavier to handle.";
    default:
      return "";
  }
}

export function acousticPropsFor(name: string) {
  switch (name) {
    case "Steel":
      return "Low inherent damping; reflects structure-borne vibration and may ring if not isolated.";
    case "Lead":
      return "Highly damped internally and excellent at absorbing vibration when isolated; handle safely.";
    case "CastIron":
      return "Cast iron has moderate damping and good mass; performs well for ballast.";
    case "Granite":
      return "Moderate damping; transmits low frequencies efficiently; brittle, secure mounting needed.";
    default:
      return "";
  }
}

export function fFundFor(
  name: string,
  speaker: {
    width: Length;
    depth: Length;
    enclosureBoardThickness: Length;
  },
) {
  switch (name) {
    case "Steel":
      return fFund_steel(speaker);
    case "Lead":
      return fFund_lead(speaker);
    case "CastIron":
      return fFund_castIron(speaker);
    case "Granite":
      return fFund_granite(speaker);
    default:
      return 0;
  }
}

export function fFundClampedFor(
  name: string,
  speaker: {
    width: Length;
    depth: Length;
    enclosureBoardThickness: Length;
  },
) {
  switch (name) {
    case "Steel":
      return fFund_steel_clamped(speaker);
    case "Lead":
      return fFund_lead_clamped(speaker);
    case "CastIron":
      return fFund_castIron_clamped(speaker);
    case "Granite":
      return fFund_granite_clamped(speaker);
    default:
      return 0;
  }
}

export function riskBandFor(
  name: string,
  speaker: {
    width: Length;
    depth: Length;
    enclosureBoardThickness: Length;
  },
) {
  const f = fFundFor(name, speaker);
  if (f < 60) return "Low";
  if (f < 200) return "Medium";
  return "High";
}

export function combinedScoreFor(
  name: string,
  speaker: {
    width: Length;
    depth: Length;
    enclosureBoardThickness: Length;
  },
) {
  return scoreFor(name, speaker);
}

export function displayName(name: string) {
  if (name === "CastIron") return "Cast Iron";
  return name;
}

export const materialOrder = (speaker: {
  width: Length;
  depth: Length;
  enclosureBoardThickness: Length;
}) =>
  ["Steel", "Lead", "CastIron", "Granite"]
    .slice()
    .sort((a, b) => scoreFor(b, speaker) - scoreFor(a, speaker));

export function acousticPointsFor(name: string) {
  switch (name) {
    case "Steel":
      return (acousticRatingSteel / 10) * 30;
    case "Lead":
      return (acousticRatingLead / 10) * 30;
    case "CastIron":
      return (acousticRatingCastIron / 10) * 30;
    case "Granite":
      return (acousticRatingGranite / 10) * 30;
    default:
      return 0;
  }
}

export function fundamentalsPointsFor(
  name: string,
  speaker: {
    width: Length;
    depth: Length;
    enclosureBoardThickness: Length;
  },
) {
  return fundamentalsScore(fFundFor(name, speaker));
}

export function neoprenePointsFor() {
  return neopreneIsolationFraction * 30;
}
