import {
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from 'libphonenumber-js';

export interface CountryCallingCodeOption {
  countryCode: CountryCode;
  countryName: string;
  callingCode: string;
  label: string;
}

export interface CountryOption {
  countryCode: CountryCode;
  label: string;
  value: string;
}

export const DEFAULT_PHONE_COUNTRY: CountryCode = 'RW';
export const DEFAULT_COUNTRY_NAME = 'Rwanda';

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

export const COUNTRY_OPTIONS: CountryOption[] = getCountries()
  .map((countryCode) => {
    const countryName = regionNames.of(countryCode) ?? countryCode;

    return {
      countryCode,
      label: countryName,
      value: countryName,
    };
  })
  .sort((first, second) => first.label.localeCompare(second.label));

export const COUNTRY_CALLING_CODE_OPTIONS: CountryCallingCodeOption[] =
  getCountries()
    .map((countryCode) => {
      const callingCode = getCountryCallingCode(countryCode);
      const countryName = regionNames.of(countryCode) ?? countryCode;

      return {
        countryCode,
        countryName,
        callingCode,
        label: `${countryName} +${callingCode}`,
      };
    })
    .sort((first, second) => first.countryName.localeCompare(second.countryName));

export function getCallingCode(countryCode: CountryCode): string {
  return getCountryCallingCode(countryCode);
}

export function sanitizeNationalPhoneNumber(
  input: string,
  callingCode: string,
  countryCode: CountryCode,
): string {
  let digits = input.replace(/\D+/g, '');

  while (digits.startsWith(callingCode)) {
    digits = digits.slice(callingCode.length);
  }

  digits = digits.replace(/^0+/, '');

  if (countryCode === 'RW') {
    while (digits.startsWith('250')) {
      digits = digits.slice(3);
    }

    digits = digits.replace(/^0+/, '');
  }

  return digits;
}

export function getNationalPhoneNumber(
  value: string,
  callingCode: string,
  countryCode: CountryCode,
): string {
  return sanitizeNationalPhoneNumber(value, callingCode, countryCode);
}

export function buildInternationalPhoneNumber(
  countryCode: CountryCode,
  nationalNumber: string,
): string {
  const callingCode = getCallingCode(countryCode);
  const sanitizedNational = sanitizeNationalPhoneNumber(
    nationalNumber,
    callingCode,
    countryCode,
  );

  return sanitizedNational ? `${callingCode}${sanitizedNational}` : '';
}

export function getPhonePlaceholder(countryCode: CountryCode): string {
  if (countryCode === 'RW') {
    return '788123456';
  }

  return 'Phone number';
}
