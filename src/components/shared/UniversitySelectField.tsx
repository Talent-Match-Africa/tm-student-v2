"use client";

import {
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type SelectHTMLAttributes,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import Image from "next/image";
import {
  ArrowDown01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Search01Icon,
  UniversityIcon,
} from "@hugeicons/core-free-icons";
import {
  FieldRequirementBadge,
  type FieldRequirement,
} from "@/components/shared/FieldRequirementBadge";
import { HugeIcon } from "@/components/shared/HugeIcon";
import { normalizeMediaUrl } from "@/lib/media-url";
import { toUniversitySelectOptions } from "@/lib/university-select-options";
import type {
  PaginatedResponse,
  UniversityListItem,
  UniversitySelectOption,
} from "@/types/universities";
import styles from "./UniversitySelectField.module.css";

interface UniversitySelectFieldProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children" | "multiple" | "value"
> {
  activeOnly?: boolean;
  emptyStateLabel?: string;
  error?: string;
  excludedValues?: string[];
  label: string;
  multiple?: false;
  options: UniversitySelectOption[];
  placeholder?: string;
  requirement?: FieldRequirement;
  requirementLabel?: string;
  searchPlaceholder?: string;
  value: string;
}

interface UniversityMultiSelectFieldProps {
  activeOnly?: boolean;
  className?: string;
  disabled?: boolean;
  emptyStateLabel?: string;
  error?: string;
  excludedValues?: string[];
  id?: string;
  label: string;
  maxSelections?: number;
  multiple: true;
  name?: string;
  onBlur?: () => void;
  onSelectionChange: (options: UniversitySelectOption[]) => void;
  options: UniversitySelectOption[];
  placeholder?: string;
  requirement?: FieldRequirement;
  requirementLabel?: string;
  searchPlaceholder?: string;
  value: UniversitySelectOption[];
}

type Props = UniversitySelectFieldProps | UniversityMultiSelectFieldProps;

export function UniversitySelectField(props: Props) {
  const generatedId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const requestIdRef = useRef(0);
  const inputId = props.id ?? props.name ?? generatedId;
  const isMultiple = props.multiple === true;
  const [cachedOptions, setCachedOptions] = useState<UniversitySelectOption[]>(
    [],
  );
  const knownOptions = useMemo(
    () => mergeOptions(props.options, cachedOptions),
    [cachedOptions, props.options],
  );
  const selectedOptions = useMemo(
    () =>
      props.multiple
        ? props.value
        : knownOptions.filter((option) => option.value === props.value),
    [knownOptions, props.multiple, props.value],
  );
  const selectedOption = selectedOptions[0] ?? null;
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [remoteOptions, setRemoteOptions] = useState<UniversitySelectOption[]>(
    [],
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const maxSelections = isMultiple ? (props.maxSelections ?? 100) : 1;
  const atSelectionLimit = isMultiple && props.value.length >= maxSelections;

  const availableOptions = useMemo(() => {
    const merged = mergeOptions(knownOptions, remoteOptions, selectedOptions);
    const normalizedSearch = search.trim().toLowerCase();

    return merged.filter((option) => {
      if (props.excludedValues?.includes(option.value)) return false;

      if (
        isMultiple &&
        selectedOptions.some((selected) => selected.value === option.value)
      ) {
        return false;
      }

      if (!normalizedSearch) return true;

      return `${option.name} ${option.email ?? ""}`
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [
    isMultiple,
    knownOptions,
    props.excludedValues,
    remoteOptions,
    search,
    selectedOptions,
  ]);

  const describedBy =
    [
      "aria-describedby" in props ? props["aria-describedby"] : undefined,
      props.error ? `${inputId}-error` : undefined,
      searchError ? `${inputId}-search-error` : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) closeList();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    searchRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    const query = search.trim();
    if (!isOpen || query.length < 3) return;

    const controller = new AbortController();
    const requestId = ++requestIdRef.current;
    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);

      try {
        const params = new URLSearchParams({ search: query });
        if (props.activeOnly === false) params.set("include_inactive", "true");
        const response = await fetch(`/api/admin/universities?${params}`, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        const payload = (await response.json()) as Partial<
          PaginatedResponse<UniversityListItem>
        > & { message?: string };

        if (!response.ok) {
          throw new Error(payload.message ?? "University search failed.");
        }

        if (requestId === requestIdRef.current) {
          setRemoteOptions(toUniversitySelectOptions(payload.results ?? []));
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        if (requestId === requestIdRef.current) {
          setRemoteOptions([]);
          setSearchError("Universities could not be searched right now.");
        }
      } finally {
        if (requestId === requestIdRef.current) setIsSearching(false);
      }
    }, 320);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [isOpen, props.activeOnly, search]);

  function closeList() {
    setIsOpen(false);
    setSearch("");
    setRemoteOptions([]);
    setSearchError(null);
    setIsSearching(false);
    setActiveIndex(-1);
  }

  function openList() {
    if (props.disabled || atSelectionLimit) return;
    setIsOpen(true);
    setActiveIndex(availableOptions.length ? 0 : -1);
  }

  function emitSingleChange(nextValue: string) {
    if (isMultiple || !selectRef.current) return;
    selectRef.current.value = nextValue;
    props.onChange?.({
      currentTarget: selectRef.current,
      target: selectRef.current,
    } as ChangeEvent<HTMLSelectElement>);
  }

  function chooseOption(option: UniversitySelectOption) {
    setCachedOptions((current) => mergeOptions(current, [option]));

    if (isMultiple) {
      props.onSelectionChange([...props.value, option]);
      setSearch("");
      setRemoteOptions([]);
      setActiveIndex(0);
      window.requestAnimationFrame(() => searchRef.current?.focus());
      return;
    }

    emitSingleChange(option.value);
    closeList();
  }

  function removeOption(optionValue: string) {
    if (!isMultiple) return;
    props.onSelectionChange(
      props.value.filter((option) => option.value !== optionValue),
    );
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      openList();
    }
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeList();
      return;
    }

    if (event.key === "ArrowDown" && availableOptions.length) {
      event.preventDefault();
      setActiveIndex(0);
      optionRefs.current[0]?.focus();
    }
  }

  function handleOptionKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    option: UniversitySelectOption,
    index: number,
  ) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeList();
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex =
        (index + direction + availableOptions.length) % availableOptions.length;
      setActiveIndex(nextIndex);
      optionRefs.current[nextIndex]?.focus();
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      chooseOption(option);
    }
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (event.currentTarget.contains(event.relatedTarget as Node)) return;
    closeList();

    if (isMultiple) {
      props.onBlur?.();
      return;
    }

    if (selectRef.current) {
      props.onBlur?.({
        currentTarget: selectRef.current,
        target: selectRef.current,
      } as FocusEvent<HTMLSelectElement>);
    }
  }

  function markImageFailed(imageUrl: string) {
    setFailedImages((current) => new Set(current).add(imageUrl));
  }

  const triggerLabel = isMultiple
    ? props.value.length
      ? `${props.value.length} ${props.value.length === 1 ? "university" : "universities"} selected`
      : (props.placeholder ?? "Choose universities")
    : (selectedOption?.name ?? props.placeholder ?? "Choose university");

  return (
    <div
      className={clsx(
        styles.field,
        isOpen && styles.fieldOpen,
        props.className,
      )}
      onBlur={handleBlur}
      ref={rootRef}
    >
      <label
        className={clsx(styles.label, "tm-field-label-row")}
        htmlFor={inputId}
      >
        <span className="tm-field-label-text">{props.label}</span>
        <FieldRequirementBadge requirement={props.requirement}>
          {props.requirementLabel}
        </FieldRequirementBadge>
      </label>

      <div
        className={clsx(
          styles.control,
          isOpen && styles.controlOpen,
          props.error && styles.controlError,
          props.disabled && styles.controlDisabled,
        )}
      >
        <button
          aria-controls={`${inputId}-listbox`}
          aria-describedby={describedBy}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className={styles.trigger}
          disabled={props.disabled || atSelectionLimit}
          id={inputId}
          onClick={() => (isOpen ? closeList() : openList())}
          onKeyDown={handleTriggerKeyDown}
          type="button"
        >
          <span className={styles.selectedAvatar} aria-hidden="true">
            {!isMultiple && selectedOption ? (
              renderUniversityImage(
                selectedOption,
                failedImages,
                markImageFailed,
              )
            ) : (
              <HugeIcon icon={UniversityIcon} size={18} />
            )}
          </span>
          <span className={styles.selectedCopy}>
            <strong>{triggerLabel}</strong>
            <small>
              {!isMultiple && selectedOption
                ? (selectedOption.email ?? "No university email")
                : atSelectionLimit
                  ? `Maximum of ${maxSelections} universities selected`
                  : "Search by university name or email"}
            </small>
          </span>
        </button>

        <span className={styles.chevron} aria-hidden="true">
          <HugeIcon icon={ArrowDown01Icon} size={18} />
        </span>

        {!isMultiple ? (
          <select
            aria-hidden="true"
            className={styles.nativeSelect}
            disabled={props.disabled}
            name={props.name}
            onChange={(event) => emitSingleChange(event.target.value)}
            ref={selectRef}
            required={props.required}
            tabIndex={-1}
            value={props.value}
          >
            <option value="">{props.placeholder ?? "Choose university"}</option>
            {mergeOptions(knownOptions, remoteOptions, selectedOptions).map(
              (option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ),
            )}
          </select>
        ) : props.name ? (
          props.value.map((option) => (
            <input
              key={option.value}
              name={props.name}
              type="hidden"
              value={option.value}
            />
          ))
        ) : null}

        {isOpen ? (
          <div className={styles.popover}>
            <div className={styles.searchControl}>
              <HugeIcon icon={Search01Icon} size={17} />
              <input
                aria-label={`Search ${props.label.toLowerCase()}`}
                autoComplete="off"
                onChange={(event) => {
                  const nextSearch = event.target.value;
                  setSearch(nextSearch);
                  if (nextSearch.trim().length < 3) {
                    setRemoteOptions([]);
                    setSearchError(null);
                    setIsSearching(false);
                  }
                  setActiveIndex(0);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder={
                  props.searchPlaceholder ?? "Search university name or email"
                }
                ref={searchRef}
                type="search"
                value={search}
              />
              {isSearching ? (
                <span
                  aria-label="Searching universities"
                  className={styles.spinner}
                  role="status"
                />
              ) : null}
            </div>

            <div
              aria-multiselectable={isMultiple || undefined}
              aria-busy={isSearching}
              className={styles.options}
              id={`${inputId}-listbox`}
              role="listbox"
            >
              {!isMultiple && props.value ? (
                <button
                  className={styles.clearOption}
                  onClick={() => {
                    emitSingleChange("");
                    closeList();
                  }}
                  type="button"
                >
                  Clear university selection
                </button>
              ) : null}

              {availableOptions.length ? (
                availableOptions.map((option, index) => {
                  const isSelected = selectedOptions.some(
                    (selected) => selected.value === option.value,
                  );
                  return (
                    <button
                      aria-selected={isSelected}
                      className={clsx(
                        styles.option,
                        isSelected && styles.optionSelected,
                      )}
                      key={option.value}
                      onClick={() => chooseOption(option)}
                      onKeyDown={(event) =>
                        handleOptionKeyDown(event, option, index)
                      }
                      ref={(node) => {
                        optionRefs.current[index] = node;
                      }}
                      role="option"
                      tabIndex={activeIndex === index ? 0 : -1}
                      type="button"
                    >
                      <span className={styles.optionAvatar} aria-hidden="true">
                        {renderUniversityImage(
                          option,
                          failedImages,
                          markImageFailed,
                        )}
                      </span>
                      <span className={styles.optionCopy}>
                        <strong>{option.name}</strong>
                        <small>{option.email ?? "No university email"}</small>
                      </span>
                      {option.isActive === false ? (
                        <span className={styles.inactiveBadge}>Inactive</span>
                      ) : null}
                      {isSelected ? (
                        <HugeIcon icon={CheckmarkCircle02Icon} size={18} />
                      ) : null}
                    </button>
                  );
                })
              ) : (
                <div className={styles.emptyState}>
                  <HugeIcon icon={UniversityIcon} size={20} />
                  <strong>
                    {props.emptyStateLabel ?? "No universities found"}
                  </strong>
                  <span>
                    {search.trim().length < 3
                      ? "Try a university name or email."
                      : "Check the spelling or try another search."}
                  </span>
                </div>
              )}
            </div>

            {searchError ? (
              <p className={styles.searchError} id={`${inputId}-search-error`}>
                {searchError}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {isMultiple && props.value.length ? (
        <div className={styles.selectedList} aria-label="Selected universities">
          {props.value.map((option) => (
            <span key={option.value}>
              <span className={styles.chipAvatar} aria-hidden="true">
                {renderUniversityImage(option, failedImages, markImageFailed)}
              </span>
              <span>{option.name}</span>
              <button
                aria-label={`Remove ${option.name}`}
                disabled={props.disabled}
                onClick={() => removeOption(option.value)}
                type="button"
              >
                <HugeIcon icon={Cancel01Icon} size={13} />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {props.error ? (
        <p className="tm-field-error" id={`${inputId}-error`}>
          {props.error}
        </p>
      ) : null}
    </div>
  );
}

function mergeOptions(
  ...groups: UniversitySelectOption[][]
): UniversitySelectOption[] {
  const options = new Map<string, UniversitySelectOption>();
  groups.flat().forEach((option) => options.set(option.value, option));
  return [...options.values()];
}

function renderUniversityImage(
  option: UniversitySelectOption,
  failedImages: Set<string>,
  onError: (imageUrl: string) => void,
) {
  const imageUrl = normalizeMediaUrl(option.imageUrl);
  if (!imageUrl || failedImages.has(imageUrl)) return getInitials(option.name);

  return (
    <Image
      alt=""
      fill
      onError={() => onError(imageUrl)}
      sizes="40px"
      src={imageUrl}
      unoptimized
    />
  );
}

function getInitials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  );
}
