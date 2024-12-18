import {
  useRef,
  KeyboardEvent,
  useId,
  useState,
  useEffect,
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  ClipboardEvent,
} from "react";
import Input from "@/components/shared/Input";
import { cn } from "@/lib/utils";

export interface InputOTPRef {
  focus: () => void;
}

interface InputOTPProps {
  length: number;
  value?: string;
  defaultValue?: string;
  label?: string;
  error?: boolean;
  hintText?: string;
  labelClassName?: string;
  hintTextClassName?: string;
  autoFocus?: boolean;
  onChange?: (value: string) => void;
}

const InternalInputOTP: ForwardRefRenderFunction<InputOTPRef, InputOTPProps> = (
  {
    length,
    value,
    defaultValue = "",
    label,
    error,
    hintText,
    labelClassName,
    hintTextClassName,
    autoFocus,
    onChange,
  },
  ref
) => {
  const reactId = useId();
  const inputOPTId = `input_opt_${reactId}`;
  const [chars, setChars] = useState(() => (value || defaultValue).split(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const inputIds = Array.from({ length }, (_, i) => `${inputOPTId}_${i}`);

  const updateChars = (newChars: string[]) => {
    setChars(newChars);
    onChange?.(newChars.join(""));
  };

  const handleChange = (value: string, index: number) => {
    const newChars = [...chars];
    newChars[index] = value;
    updateChars(newChars);
  };

  const shiftCharsLeftByIndex = (index: number) => {
    updateChars([...chars.slice(0, index), "", ...chars.slice(index + 2)]);
  };

  const focusNextInput = (index: number) => {
    if (index < length - 1) inputsRef.current[index + 1]?.focus();
  };

  const focusPreviousInput = (index: number) => {
    if (index > 0) inputsRef.current[index - 1]?.focus();
  };

  const handleKeyUp = (index: number) => (e: KeyboardEvent) => {
    const isArrowLeft = e.key === "ArrowLeft";
    const isArrowRight = e.key === "ArrowRight";
    const isBackspace = e.key === "Backspace";
    const isDelete = e.key === "Delete";
    const isNumeric = /\d/.test(e.key);

    if (isArrowLeft) {
      focusPreviousInput(index);
    } else if (isArrowRight) {
      focusNextInput(index);
    } else if ((isDelete || isBackspace) && chars[index]) {
      handleChange("", index);
    } else if (isBackspace) {
      focusPreviousInput(index);
      handleChange("", index - 1);
    } else if (isDelete) {
      shiftCharsLeftByIndex(index);
    } else if (isNumeric) {
      handleChange(e.key, index);
      focusNextInput(index);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pastePassword = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .split("");

    pastePassword.length = length;

    setChars(pastePassword);
  };

  useEffect(() => {
    if (typeof value === "string") {
      setChars(value.split(""));
    }
  }, [value]);

  useEffect(() => {
    if (autoFocus) inputsRef.current[0]?.focus();
  }, [autoFocus]);

  useImperativeHandle(
    ref,
    () => {
      const firstElement = inputsRef.current[0];

      return {
        focus() {
          firstElement?.focus();
        },
      };
    },
    []
  );

  return (
    <div>
      {label && (
        <label
          htmlFor={inputOPTId}
          className={cn(
            "block mb-1 font-medium text-primary-200",
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      <div className="flex gap-2">
        {inputIds.map((id, index) => (
          <Input
            key={id}
            id={index === 0 ? inputOPTId : undefined}
            ref={(element) => (inputsRef.current[index] = element)}
            inputClassName="w-10 px-3 py-2.5 text-center"
            maxLength={1}
            error={error}
            value={chars[index] || ""}
            onKeyUp={handleKeyUp(index)}
            onPaste={handlePaste}
          />
        ))}
      </div>
      {hintText && (
        <div
          className={cn(
            "text-grey-500 text-sm",
            error && "text-error-300",
            hintTextClassName
          )}
        >
          {hintText}
        </div>
      )}
    </div>
  );
};

const InputOTP = forwardRef(InternalInputOTP);

export default InputOTP;
