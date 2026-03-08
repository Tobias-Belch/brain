import { useReducer } from "react";
import {
  JscadModelViewer,
  type Props,
} from "@jscad/components/react/JscadModelViewer";
import { Select, MultiSelect } from "@components/react/Select";
import { Switch } from "@components/react/Switch";
import { MilasRoom, type State, variants } from "../models/milas-room.model";

const variantOptions = Object.entries(variants).map(([value, label]) => ({
  value,
  label,
}));

const deskVariantOptions = [
  { value: "closed", label: "Closed Desk" },
  { value: "partially", label: "Partially Opened Desk" },
  { value: "fully", label: "Fully Opened Desk" },
];

type SurfaceKey = keyof State["surfaces"];

const surfaceOptions: { value: SurfaceKey; label: string }[] = [
  { value: "frontWall", label: "Front Wall" },
  { value: "backWall", label: "Back Wall" },
  { value: "leftWall", label: "Left Wall" },
  { value: "rightWall", label: "Right Wall" },
  { value: "floor", label: "Floor" },
  { value: "ceiling", label: "Ceiling" },
];

// ─── Reducer ────────────────────────────────────────────────────────────────

type Action =
  | { type: "SET_VARIANT"; value: State["variant"] }
  | { type: "SET_BED_DRAWERS"; value: State["bed"]["drawers"] }
  | { type: "SET_BED_VARIANT"; value: State["bed"]["variant"] }
  | { type: "SET_CABINET_VARIANT"; value: State["cabinet"]["variant"] }
  | { type: "SET_DESK_VARIANT"; value: State["desk"]["variant"] }
  | { type: "SET_SURFACES"; value: SurfaceKey[] };

const initialState: State = {
  variant: "brimnesBillyPax",
  bed: {
    drawers: "closed",
    variant: "single",
  },
  cabinet: {
    variant: "closed",
  },
  desk: {
    variant: "closed",
  },
  surfaces: {
    frontWall: true,
    backWall: true,
    leftWall: false,
    rightWall: true,
    floor: true,
    ceiling: false,
  },
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_BED_DRAWERS":
      return { ...state, bed: { ...state.bed, drawers: action.value } };
    case "SET_BED_VARIANT":
      return { ...state, bed: { ...state.bed, variant: action.value } };
    case "SET_CABINET_VARIANT":
      return { ...state, cabinet: { variant: action.value } };
    case "SET_DESK_VARIANT":
      return { ...state, desk: { variant: action.value } };
    case "SET_VARIANT":
      return { ...state, variant: action.value };
    case "SET_SURFACES": {
      const visibleSet = new Set(action.value);
      return {
        ...state,
        surfaces: {
          frontWall: visibleSet.has("frontWall"),
          backWall: visibleSet.has("backWall"),
          leftWall: visibleSet.has("leftWall"),
          rightWall: visibleSet.has("rightWall"),
          floor: visibleSet.has("floor"),
          ceiling: visibleSet.has("ceiling"),
        },
      };
    }
  }
}

// ─── Component ──────────────────────────────────────────────────────────────

export function MilasRoomViewer(props: Omit<Props, "model">) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const visibleSurfaces = (Object.keys(state.surfaces) as SurfaceKey[]).filter(
    (key) => state.surfaces[key],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <Select
          options={variantOptions}
          value={state.variant}
          onChange={(value) =>
            dispatch({ type: "SET_VARIANT", value: value as State["variant"] })
          }
        />
        <MultiSelect
          multiple
          options={surfaceOptions}
          value={visibleSurfaces}
          onChange={(values) =>
            dispatch({ type: "SET_SURFACES", value: values as SurfaceKey[] })
          }
        />
        <Switch
          checked={state.bed.variant === "double"}
          onChange={(checked) =>
            dispatch({
              type: "SET_BED_VARIANT",
              value: checked ? "double" : "single",
            })
          }
          trackLabels={{ on: "Double Bed", off: "Single Bed" }}
        />
        <Switch
          checked={state.bed.drawers === "opened"}
          onChange={(checked) =>
            dispatch({
              type: "SET_BED_DRAWERS",
              value: checked ? "opened" : "closed",
            })
          }
          trackLabels={{ on: "Bed Drawers Opened", off: "Bed Drawers closed" }}
        />
        <Select
          options={deskVariantOptions}
          value={state.desk.variant}
          onChange={(value) =>
            dispatch({
              type: "SET_DESK_VARIANT",
              value: value as State["desk"]["variant"],
            })
          }
        />
        <Switch
          checked={state.cabinet.variant === "opened"}
          onChange={(checked) =>
            dispatch({
              type: "SET_CABINET_VARIANT",
              value: checked ? "opened" : "closed",
            })
          }
          trackLabels={{ on: "Closet Opened", off: "Closet Closed" }}
        />
      </div>

      <JscadModelViewer {...props} model={MilasRoom({ state })} />
    </div>
  );
}
