import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRef } from "react";

interface HCaptchaComponentProps {
  onVerify: (token: string) => void;
  sitekey?: string;
}

export function HCaptchaComponent({ onVerify, sitekey = "10000000-ffff-ffff-ffff-000000000001" }: HCaptchaComponentProps) {
  const captchaRef = useRef<HCaptcha>(null);

  const handleVerificationSuccess = (token: string) => {
    onVerify(token);
  };

  return (
    <div className="flex justify-center my-4">
      <HCaptcha
        ref={captchaRef}
        sitekey={sitekey}
        onVerify={handleVerificationSuccess}
        theme="light"
      />
    </div>
  );
}
