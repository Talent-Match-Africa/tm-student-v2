'use client';

import {
  type CSSProperties,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type SelectHTMLAttributes,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { ArrowDown01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react';
import {
  FieldRequirementBadge,
  type FieldRequirement,
} from './FieldRequirementBadge';
import { HugeIcon } from './HugeIcon';
import styles from './SelectField.module.css';

interface SelectOption {
  description?: string;
  label: string;
  value: string;
}

interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  icon: IconSvgElement;
  label: string;
  emptyStateLabel?: string;
  error?: string;
  isSearchable?: boolean;
  listboxAlign?: 'start' | 'end';
  listboxClassName?: string;
  options: SelectOption[];
  requirement?: FieldRequirement;
  requirementLabel?: string;
  searchPlaceholder?: string;
}

function normalizeValue(
  value: SelectHTMLAttributes<HTMLSelectElement>['value'],
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  if (value === undefined || value === null) {
    return undefined;
  }

  return String(value);
}

function filterSelectOptions(
  options: SelectOption[],
  searchValue: string,
  isSearchable: boolean,
) {
  const normalizedSearch = searchValue.trim().toLowerCase();

  if (!isSearchable || !normalizedSearch) {
    return options;
  }

  return options.filter((option) =>
    `${option.label} ${option.value}`.toLowerCase().includes(normalizedSearch),
  );
}

export function SelectField({
  className,
  defaultValue,
  disabled,
  emptyStateLabel = 'No options found.',
  error,
  icon,
  id,
  isSearchable = false,
  label,
  listboxAlign = 'start',
  listboxClassName,
  name,
  onBlur,
  onChange,
  options,
  requirement,
  requirementLabel,
  searchPlaceholder = 'Search options',
  value,
  ...props
}: SelectFieldProps) {
  const generatedId = useId();
  const inputId = id ?? name ?? generatedId;
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const fallbackValue = options[0]?.value ?? '';
  const defaultSelectValue = normalizeValue(defaultValue) ?? fallbackValue;
  const controlledValue = normalizeValue(value);
  const isControlled = controlledValue !== undefined;

  const [internalValue, setInternalValue] = useState(defaultSelectValue);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchValue, setSearchValue] = useState('');
  const [listboxStyle, setListboxStyle] = useState<CSSProperties>({});

  const selectedValue = isControlled ? controlledValue : internalValue;

  const selectedOption = useMemo(
    () =>
      options.find((option) => option.value === selectedValue) ??
      options[0] ??
      null,
    [options, selectedValue],
  );

  const selectedIndex = useMemo(
    () => options.findIndex((option) => option.value === selectedOption?.value),
    [options, selectedOption],
  );
  const filteredOptions = useMemo(
    () => filterSelectOptions(options, searchValue, isSearchable),
    [isSearchable, options, searchValue],
  );

  const describedBy =
    [props['aria-describedby'], error ? `${inputId}-error` : undefined]
      .filter(Boolean)
      .join(' ') || undefined;

  const updateListboxPosition = useCallback(() => {
    if (!isOpen || !triggerRef.current) {
      return;
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuWidth = Math.max(
      triggerRect.width,
      listboxRef.current?.offsetWidth ?? 0,
    );
    const menuHeight = listboxRef.current?.offsetHeight ?? 0;
    const viewportPadding = 12;
    const menuGap = 8;
    const availableBelow = window.innerHeight - triggerRect.bottom - menuGap;
    const shouldOpenAbove =
      menuHeight > 0 &&
      menuHeight > availableBelow &&
      triggerRect.top > availableBelow;
    const preferredLeft =
      listboxAlign === 'end'
        ? triggerRect.right - menuWidth
        : triggerRect.left;
    const maximumLeft = Math.max(
      viewportPadding,
      window.innerWidth - menuWidth - viewportPadding,
    );
    const left = Math.min(
      Math.max(preferredLeft, viewportPadding),
      maximumLeft,
    );
    const top = shouldOpenAbove
      ? Math.max(viewportPadding, triggerRect.top - menuHeight - menuGap)
      : triggerRect.bottom + menuGap;
    const nextStyle: CSSProperties = {
      left,
      right: 'auto',
      top,
      width: triggerRect.width,
    };

    setListboxStyle((current) =>
      current.left === nextStyle.left &&
      current.top === nextStyle.top &&
      current.width === nextStyle.width
        ? current
        : nextStyle,
    );
  }, [isOpen, listboxAlign]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (
        !rootRef.current?.contains(target) &&
        !listboxRef.current?.contains(target)
      ) {
        setIsOpen(false);
        setSearchValue('');
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    updateListboxPosition();
    const frameId = window.requestAnimationFrame(updateListboxPosition);

    window.addEventListener('resize', updateListboxPosition);
    window.addEventListener('scroll', updateListboxPosition, true);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', updateListboxPosition);
      window.removeEventListener('scroll', updateListboxPosition, true);
    };
  }, [filteredOptions.length, isOpen, updateListboxPosition]);

  useEffect(() => {
    if (isOpen && isSearchable) {
      searchInputRef.current?.focus();
    }
  }, [isOpen, isSearchable]);

  useEffect(() => {
    if (!isOpen || activeIndex < 0) {
      return;
    }

    if (activeIndex >= filteredOptions.length) {
      return;
    }

    if (isSearchable && document.activeElement === searchInputRef.current) {
      return;
    }

    optionRefs.current[activeIndex]?.focus();
  }, [activeIndex, filteredOptions.length, isOpen, isSearchable]);

  function emitChange(nextValue: string) {
    if (!selectRef.current) {
      return;
    }

    selectRef.current.value = nextValue;

    onChange?.({
      target: selectRef.current,
      currentTarget: selectRef.current,
    } as ChangeEvent<HTMLSelectElement>);
  }

  function chooseOption(nextValue: string) {
    if (disabled) {
      return;
    }

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    emitChange(nextValue);
    setIsOpen(false);
    setActiveIndex(-1);
    setSearchValue('');
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function handleNativeChange(event: ChangeEvent<HTMLSelectElement>) {
    chooseOption(event.target.value);
  }

  function openList() {
    if (disabled) {
      return;
    }

    setIsOpen(true);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setSearchValue('');
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      setIsOpen(false);
      setActiveIndex(-1);
      setSearchValue('');
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openList();
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen((current) => {
        if (current) {
          setSearchValue('');
        }

        return !current;
      });
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }

  function handleOptionKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    option: SelectOption,
    index: number,
  ) {
    if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
      setActiveIndex(-1);
      setSearchValue('');
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index + 1) % filteredOptions.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex(
        (index - 1 + filteredOptions.length) % filteredOptions.length,
      );
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(filteredOptions.length - 1);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      chooseOption(option.value);
    }
  }

  function handleRootBlur(event: FocusEvent<HTMLDivElement>) {
    const nextTarget = event.relatedTarget as Node | null;

    if (
      event.currentTarget.contains(nextTarget) ||
      listboxRef.current?.contains(nextTarget)
    ) {
      return;
    }

    setIsOpen(false);
    setSearchValue('');

    if (selectRef.current) {
      onBlur?.({
        target: selectRef.current,
        currentTarget: selectRef.current,
      } as FocusEvent<HTMLSelectElement>);
    }
  }

  return (
    <div
      className={clsx(styles.field, isOpen && styles.fieldOpen, className)}
      onBlur={handleRootBlur}
      ref={rootRef}
    >
      <label
        className={clsx(styles.label, 'tm-field-label-row')}
        htmlFor={inputId}
      >
        <span className="tm-field-label-text">{label}</span>
        <FieldRequirementBadge requirement={requirement}>
          {requirementLabel}
        </FieldRequirementBadge>
      </label>

      <div
        className={clsx(
          styles.control,
          isOpen && styles.controlOpen,
          error && styles.controlError,
          disabled && styles.controlDisabled,
        )}
      >
        <span className={styles.leadingIcon} aria-hidden="true">
          <HugeIcon icon={icon} size={20} />
        </span>

        <button
          aria-controls={`${inputId}-listbox`}
          aria-describedby={describedBy}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className={styles.trigger}
          disabled={disabled}
          id={inputId}
          onClick={() => {
            if (isOpen) {
              setIsOpen(false);
              setSearchValue('');
              return;
            }

            openList();
          }}
          onKeyDown={handleTriggerKeyDown}
          ref={triggerRef}
          type="button"
        >
          <span className={styles.selectedText}>
            {selectedOption?.label ?? 'Select an option'}
          </span>
        </button>

        <span className={styles.chevron} aria-hidden="true">
          <HugeIcon icon={ArrowDown01Icon} size={18} />
        </span>

        <select
          {...props}
          aria-hidden="true"
          className={styles.nativeSelect}
          defaultValue={isControlled ? undefined : defaultSelectValue}
          disabled={disabled}
          name={name}
          onChange={handleNativeChange}
          ref={selectRef}
          tabIndex={-1}
          value={isControlled ? selectedValue : undefined}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {isOpen
          ? createPortal(
              <div
                className={clsx(
                  styles.listbox,
                  styles.listboxPortal,
                  listboxClassName,
                )}
                ref={listboxRef}
                style={listboxStyle}
              >
                {isSearchable ? (
                  <div className={styles.searchWrap}>
                    <input
                      aria-label={`Search ${label.toLowerCase()}`}
                      className={styles.searchInput}
                      onChange={(event) => {
                        const nextSearch = event.target.value;
                        const nextOptions = filterSelectOptions(
                          options,
                          nextSearch,
                          isSearchable,
                        );

                        setSearchValue(nextSearch);
                        setActiveIndex(nextOptions.length > 0 ? 0 : -1);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Escape') {
                          event.preventDefault();
                          setIsOpen(false);
                          setSearchValue('');
                        }

                        if (
                          event.key === 'ArrowDown' &&
                          filteredOptions.length > 0
                        ) {
                          event.preventDefault();
                          setActiveIndex(0);
                          optionRefs.current[0]?.focus();
                        }
                      }}
                      placeholder={searchPlaceholder}
                      ref={searchInputRef}
                      type="search"
                      value={searchValue}
                    />
                  </div>
                ) : null}

                <div id={`${inputId}-listbox`} role="listbox">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option, index) => {
                      const isSelected = option.value === selectedOption?.value;

                      return (
                        <button
                          aria-selected={isSelected}
                          className={clsx(
                            styles.option,
                            isSelected && styles.optionSelected,
                          )}
                          key={option.value}
                          onClick={() => chooseOption(option.value)}
                          onKeyDown={(event) =>
                            handleOptionKeyDown(event, option, index)
                          }
                          ref={(node) => {
                            optionRefs.current[index] = node;
                          }}
                          role="option"
                          type="button"
                        >
                          <span className={styles.optionCopy}>
                            <span className={styles.optionLabel}>
                              {option.label}
                            </span>
                            {option.description ? (
                              <span className={styles.optionDescription}>
                                {option.description}
                              </span>
                            ) : null}
                          </span>
                          {isSelected ? (
                            <span
                              className={styles.selectedMarker}
                              aria-hidden="true"
                            >
                              <HugeIcon icon={Tick02Icon} size={15} />
                            </span>
                          ) : null}
                        </button>
                      );
                    })
                  ) : (
                    <p className={styles.emptyState}>{emptyStateLabel}</p>
                  )}
                </div>
              </div>,
              document.body,
            )
          : null}
      </div>

      {error ? (
        <p className="tm-field-error" id={`${inputId}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
