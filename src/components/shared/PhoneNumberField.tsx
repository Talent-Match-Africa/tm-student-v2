'use client';

import {
  type FocusEvent,
  type KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import clsx from 'clsx';
import { ArrowDown01Icon, SmartPhone01Icon } from '@hugeicons/core-free-icons';
import type { CountryCode } from 'libphonenumber-js';
import {
  buildInternationalPhoneNumber,
  COUNTRY_CALLING_CODE_OPTIONS,
  DEFAULT_PHONE_COUNTRY,
  getCallingCode,
  getNationalPhoneNumber,
  getPhonePlaceholder,
  sanitizeNationalPhoneNumber,
  type CountryCallingCodeOption,
} from '@/lib/phone-number';
import {
  FieldRequirementBadge,
  type FieldRequirement,
} from './FieldRequirementBadge';
import { HugeIcon } from './HugeIcon';
import styles from './PhoneNumberField.module.css';

interface PhoneNumberFieldProps {
  autoComplete?: string;
  error?: string;
  hint?: string;
  id?: string;
  label: string;
  name?: string;
  onChange: (value: string) => void;
  requirement?: FieldRequirement;
  requirementLabel?: string;
  value: string;
}

function filterCountryCallingCodeOptions(searchValue: string) {
  const normalizedSearch = searchValue.trim().toLowerCase();

  if (!normalizedSearch) {
    return COUNTRY_CALLING_CODE_OPTIONS;
  }

  return COUNTRY_CALLING_CODE_OPTIONS.filter((option) =>
    [
      option.countryName,
      option.countryCode,
      option.callingCode,
      `+${option.callingCode}`,
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch),
  );
}

export function PhoneNumberField({
  autoComplete = 'tel-national',
  error,
  hint,
  id,
  label,
  name,
  onChange,
  requirement,
  requirementLabel,
  value,
}: PhoneNumberFieldProps) {
  const generatedId = useId();
  const inputId = id ?? name ?? generatedId;
  const rootRef = useRef<HTMLDivElement>(null);
  const countrySearchRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [countryCode, setCountryCode] = useState<CountryCode>(
    DEFAULT_PHONE_COUNTRY,
  );
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [activeCountryIndex, setActiveCountryIndex] = useState(-1);

  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [errorId, !error ? hintId : undefined]
    .filter(Boolean)
    .join(' ') || undefined;
  const callingCode = getCallingCode(countryCode);
  const nationalNumber = useMemo(
    () => getNationalPhoneNumber(value, callingCode, countryCode),
    [callingCode, countryCode, value],
  );
  const selectedCountry = useMemo(
    () =>
      COUNTRY_CALLING_CODE_OPTIONS.find(
        (option) => option.countryCode === countryCode,
      ) ?? COUNTRY_CALLING_CODE_OPTIONS[0],
    [countryCode],
  );
  const selectedCountryIndex = useMemo(
    () =>
      COUNTRY_CALLING_CODE_OPTIONS.findIndex(
        (option) => option.countryCode === countryCode,
      ),
    [countryCode],
  );
  const filteredCountries = useMemo(
    () => filterCountryCallingCodeOptions(countrySearch),
    [countrySearch],
  );

  useEffect(() => {
    if (!isCountryOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeCountryPicker();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isCountryOpen]);

  useEffect(() => {
    if (isCountryOpen) {
      countrySearchRef.current?.focus();
    }
  }, [isCountryOpen]);

  useEffect(() => {
    if (!isCountryOpen || activeCountryIndex < 0) {
      return;
    }

    if (activeCountryIndex >= filteredCountries.length) {
      return;
    }

    if (document.activeElement === countrySearchRef.current) {
      return;
    }

    optionRefs.current[activeCountryIndex]?.focus();
  }, [activeCountryIndex, filteredCountries.length, isCountryOpen]);

  function closeCountryPicker() {
    setIsCountryOpen(false);
    setCountrySearch('');
    setActiveCountryIndex(-1);
  }

  function openCountryPicker() {
    setIsCountryOpen(true);
    setCountrySearch('');
    setActiveCountryIndex(
      selectedCountryIndex >= 0 ? selectedCountryIndex : 0,
    );
  }

  function handleCountryChange(nextCountry: CountryCode) {
    setCountryCode(nextCountry);
    onChange(buildInternationalPhoneNumber(nextCountry, nationalNumber));
    closeCountryPicker();
  }

  function handlePhoneChange(input: string) {
    const nextNationalNumber = sanitizeNationalPhoneNumber(
      input,
      callingCode,
      countryCode,
    );

    onChange(nextNationalNumber ? `${callingCode}${nextNationalNumber}` : '');
  }

  function handleRootBlur(event: FocusEvent<HTMLDivElement>) {
    if (event.currentTarget.contains(event.relatedTarget as Node)) {
      return;
    }

    closeCountryPicker();
  }

  function handleCountryButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openCountryPicker();
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      if (isCountryOpen) {
        closeCountryPicker();
        return;
      }

      openCountryPicker();
    }
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeCountryPicker();
      return;
    }

    if (event.key === 'ArrowDown' && filteredCountries.length > 0) {
      event.preventDefault();
      setActiveCountryIndex(0);
      optionRefs.current[0]?.focus();
    }
  }

  function handleOptionKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    option: CountryCallingCodeOption,
    index: number,
  ) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeCountryPicker();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveCountryIndex((index + 1) % filteredCountries.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveCountryIndex(
        (index - 1 + filteredCountries.length) % filteredCountries.length,
      );
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCountryChange(option.countryCode);
    }
  }

  return (
    <div
      className={clsx(styles.field, isCountryOpen && styles.fieldOpen)}
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
          isCountryOpen && styles.controlOpen,
          error && styles.controlError,
        )}
      >
        <span className={styles.leadingIcon} aria-hidden="true">
          <HugeIcon icon={SmartPhone01Icon} size={19} />
        </span>

        <input
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          autoComplete={autoComplete}
          className={styles.phoneInput}
          id={inputId}
          inputMode="numeric"
          name={name}
          onChange={(event) => handlePhoneChange(event.target.value)}
          placeholder={getPhonePlaceholder(countryCode)}
          type="tel"
          value={nationalNumber}
        />

        <button
          aria-controls={`${inputId}-country-listbox`}
          aria-expanded={isCountryOpen}
          aria-haspopup="listbox"
          aria-label={`Phone country code ${selectedCountry.countryName} +${selectedCountry.callingCode}`}
          className={styles.countryButton}
          onClick={() => {
            if (isCountryOpen) {
              closeCountryPicker();
              return;
            }

            openCountryPicker();
          }}
          onKeyDown={handleCountryButtonKeyDown}
          type="button"
        >
          <span className={styles.countryCallingCode}>+{callingCode}</span>
          <span className={styles.countryIso}>{countryCode}</span>
          <span className={styles.selectArrow} aria-hidden="true">
            <HugeIcon icon={ArrowDown01Icon} size={14} />
          </span>
        </button>

        {isCountryOpen ? (
          <div className={styles.countryPicker}>
            <div className={styles.countrySearchWrap}>
              <input
                aria-label="Search country calling code"
                className={styles.countrySearchInput}
                onChange={(event) => {
                  const nextSearch = event.target.value;
                  const nextCountries =
                    filterCountryCallingCodeOptions(nextSearch);

                  setCountrySearch(nextSearch);
                  setActiveCountryIndex(
                    nextCountries.length > 0 ? 0 : -1,
                  );
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search country or code"
                ref={countrySearchRef}
                type="search"
                value={countrySearch}
              />
            </div>

            <div id={`${inputId}-country-listbox`} role="listbox">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((option, index) => {
                  const isSelected = option.countryCode === countryCode;

                  return (
                    <button
                      aria-selected={isSelected}
                      className={clsx(
                        styles.countryOption,
                        isSelected && styles.countryOptionSelected,
                      )}
                      key={option.countryCode}
                      onClick={() => handleCountryChange(option.countryCode)}
                      onKeyDown={(event) =>
                        handleOptionKeyDown(event, option, index)
                      }
                      ref={(node) => {
                        optionRefs.current[index] = node;
                      }}
                      role="option"
                      type="button"
                    >
                      <span className={styles.countryOptionText}>
                        <span className={styles.countryOptionName}>
                          {option.countryName}
                        </span>
                        <span className={styles.countryOptionMeta}>
                          {option.countryCode}
                        </span>
                      </span>
                      <span className={styles.countryOptionCode}>
                        +{option.callingCode}
                      </span>
                    </button>
                  );
                })
              ) : (
                <p className={styles.countryEmptyState}>
                  No country code matches your search.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="tm-field-error" id={errorId}>
          {error}
        </p>
      ) : hint ? (
        <p className="tm-field-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
