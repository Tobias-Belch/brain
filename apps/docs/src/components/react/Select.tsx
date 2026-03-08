import { useId, type ReactNode } from "react";
import "./Select.css";

export interface SelectOption {
  value: string;
  label: ReactNode;
  /** Optional icon rendered inside the picker; hidden in the select button */
  icon?: ReactNode;
}

export interface SelectOptionGroup {
  groupLabel: string;
  options: SelectOption[];
}

type SelectItem = SelectOption | SelectOptionGroup;

function isOptionGroup(item: SelectItem): item is SelectOptionGroup {
  return "groupLabel" in item;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: SelectItem[];
  label?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

export function Select({
  value,
  onChange,
  options,
  label,
  placeholder = "Select an option",
  disabled = false,
  id: providedId,
}: Props) {
  const generatedId = useId();
  const id = providedId ?? generatedId;

  function renderOption(option: SelectOption) {
    return (
      <option key={option.value} value={option.value}>
        {option.icon && (
          <span className="select-option-icon" aria-hidden="true">
            {option.icon}
          </span>
        )}
        <span className="select-option-label">{option.label}</span>
      </option>
    );
  }

  return (
    <span className={`select-wrapper${disabled ? " select-wrapper--disabled" : ""}`}>
      {label && (
        <label htmlFor={id} className="select-label">
          {label}
        </label>
      )}
      <select
        id={id}
        className="select"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label ? undefined : placeholder}
      >
        <button>
          {/* @ts-expect-error – selectedcontent is a new HTML element not yet in TypeScript's JSX types */}
          <selectedcontent />
        </button>

        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((item, i) => {
          if (isOptionGroup(item)) {
            return (
              <optgroup key={i} label={item.groupLabel}>
                {item.options.map(renderOption)}
              </optgroup>
            );
          }
          return renderOption(item);
        })}
      </select>
    </span>
  );
}
