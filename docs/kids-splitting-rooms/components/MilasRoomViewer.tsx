import {
  JscadModelViewer,
  type Props,
} from "@jscad/components/react/JscadModelViewer";
import { MilasRoom, State } from "../models/milas-room.model";

const defaultState = {
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
} satisfies State;

export function MilasRoomViewer(props: Omit<Props, "model">) {
  const state = defaultState;

  return <JscadModelViewer {...props} model={MilasRoom({ state })} />;
}
