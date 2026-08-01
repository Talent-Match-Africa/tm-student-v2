interface OpportunityFilterSelectProps {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}

export function OpportunityFilterSelect({
  label,
  onChange,
  options,
  value,
}: OpportunityFilterSelectProps) {
  return (
    <label>
      <span>{label}</span>
      <select onChange={(event) => onChange(event.target.value)} value={value}>
        {options.map((option) => (
          <option key={option || "any"} value={option}>
            {formatOption(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

function formatOption(value: string) {
  if (!value) return "Any";
  if (value === "-created_at") return "Newest first";
  if (value === "created_at") return "Oldest first";
  return `${value[0]}${value.slice(1).toLowerCase()}`;
}
