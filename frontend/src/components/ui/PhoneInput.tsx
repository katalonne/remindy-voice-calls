import "react-international-phone/style.css";
import { usePhoneInput, CountrySelector } from "react-international-phone";
import { Input } from "./input";

export function PhoneInput({
  value,
  onChange,
  defaultCountry = "us",
  preferredCountries = ["us", "gb", "ca", "au"],
  ...props
}: any) {
  const phone = usePhoneInput({
    value,
    onChange,
    defaultCountry,
    preferredCountries,
  });
  return (
    <div className="relative flex items-center ">
      <CountrySelector
        selectedCountry={phone.country.iso2}
        onSelect={(c) => phone.setCountry(c.iso2)}
        preferredCountries={preferredCountries}
        className="!absolute left-0 top-1/2 -translate-y-1/2 z-10"
        flagClassName="w-6 h-4 rounded-sm"
        buttonClassName="rounded-l-md"
      />
      <Input
        className="pl-13"
        value={phone.inputValue}
        onChange={phone.handlePhoneValueChange}
        ref={phone.inputRef}
        placeholder={props.placeholder || "+14155552671"}
        aria-invalid={false}
        {...props}
      />
    </div>
  );
}
