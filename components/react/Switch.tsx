import { useId, type ReactNode } from "react";
import "./Switch.css";

interface SwitchLabelConfig {
  on: ReactNode;
  off: ReactNode;
}

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  trackLabels?: SwitchLabelConfig;
  disabled?: boolean;
  id?: string;
}

export function Switch({
  checked,
  onChange,
  label,
  trackLabels,
  disabled = false,
  id: providedId,
}: Props) {
  const generatedId = useId();
  const id = providedId ?? generatedId;

  return (
    <span className={`switch-wrapper${disabled ? " switch-wrapper--disabled" : ""}`}>
      <span
        className={`switch-track${checked ? " switch-track--on" : " switch-track--off"}`}
        onClick={() => !disabled && onChange(!checked)}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        aria-labelledby={label ? `${id}-label` : undefined}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (!disabled && (e.key === " " || e.key === "Enter")) {
            e.preventDefault();
            onChange(!checked);
          }
        }}
      >
        {trackLabels && (
          <span className="switch-track-label switch-track-label--on" aria-hidden="true">
            <span className="switch-track-label-inner">{trackLabels.on}</span>
          </span>
        )}
        <span className="switch-thumb" />
        {trackLabels && (
          <span className="switch-track-label switch-track-label--off" aria-hidden="true">
            <span className="switch-track-label-inner">{trackLabels.off}</span>
          </span>
        )}
      </span>
      {label && (
        <label id={`${id}-label`} className="switch-label">
          {label}
        </label>
      )}
    </span>
  );
}
