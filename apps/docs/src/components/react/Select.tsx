import { useId, useRef, useState, useEffect, type ReactNode } from "react";
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

interface MultiProps {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
  options: SelectItem[];
  label?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

export function MultiSelect({
  value,
  onChange,
  options,
  label,
  placeholder = "Select options",
  disabled = false,
  id: providedId,
}: MultiProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: PointerEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  function toggle(optionValue: string) {
    const next = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(next);
  }

  function flatOptions(): SelectOption[] {
    return options.flatMap((item) =>
      isOptionGroup(item) ? item.options : [item],
    );
  }

  const flat = flatOptions();
  const summary =
    value.length === 0
      ? placeholder
      : value.length === flat.length
        ? "All"
        : `${value.length} of ${flat.length}`;

  function renderItem(option: SelectOption) {
    const checked = value.includes(option.value);
    return (
      <div
        key={option.value}
        role="option"
        aria-selected={checked}
        className={`multiselect-option${checked ? " multiselect-option--checked" : ""}`}
        onPointerDown={(e) => {
          e.preventDefault();
          toggle(option.value);
        }}
      >
        <span className="multiselect-option-label">{option.label}</span>
        {checked && (
          <span className="multiselect-option-checkmark" aria-hidden="true">
            ✓
          </span>
        )}
      </div>
    );
  }

  return (
    <span
      ref={wrapperRef}
      className={`select-wrapper${disabled ? " select-wrapper--disabled" : ""}`}
      style={{ position: "relative" }}
    >
      {label && (
        <label htmlFor={id} className="select-label">
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        className={`select multiselect-button${open ? " multiselect-button--open" : ""}`}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{summary}</span>
        <span className="multiselect-arrow" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          className="multiselect-picker"
        >
          {options.map((item, i) => {
            if (isOptionGroup(item)) {
              return (
                <div key={i} className="multiselect-group">
                  <div className="multiselect-group-label">
                    {item.groupLabel}
                  </div>
                  {item.options.map(renderItem)}
                </div>
              );
            }
            return renderItem(item);
          })}
        </div>
      )}
    </span>
  );
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
    <span
      className={`select-wrapper${disabled ? " select-wrapper--disabled" : ""}`}
    >
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
