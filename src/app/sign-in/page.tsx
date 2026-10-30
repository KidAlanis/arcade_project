import { AuthForm } from "@/components/auth-form";
import { authSetupMessage } from "@/lib/auth";
import { safeReturnPath } from "@/lib/player-contract";
export const dynamic = "force-dynamic";
export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  return (
    <AuthForm
      mode="sign-in"
      next={safeReturnPath(params.next)}
      setupMessage={authSetupMessage()}
    />
  );
}
