import { Suspense } from "react";
import VerifyEmail from "./VerifyEmail";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading verification page...</div>}>
      <VerifyEmail />
    </Suspense>
  );
}
