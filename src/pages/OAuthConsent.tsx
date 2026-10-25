import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Check, X, Loader2 } from "lucide-react";

type AuthDetails = {
  client?: { name?: string } | null;
  redirect_url?: string;
  redirect_to?: string;
  scopes?: string;
};

const OAuthConsent = () => {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<AuthDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        if (active) setError("Missing authorization request reference.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/auth?next=" + encodeURIComponent(next);
        return;
      }
      setEmail(sess.session.user.email ?? null);
      const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) {
        setError(error.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails((data as AuthDetails) ?? null);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error } = approve
      ? await supabase.auth.oauth.approveAuthorization(authorizationId)
      : await supabase.auth.oauth.denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect was returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "this app";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">SmartStudy AI</span>
          </div>
        </div>

        {error ? (
          <Card className="border-none shadow-md">
            <CardContent className="p-6 text-center space-y-3">
              <p className="font-medium text-foreground">Could not load this connection request</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" className="w-full" onClick={() => (window.location.href = "/")}>
                Back to SmartStudy AI
              </Button>
            </CardContent>
          </Card>
        ) : !details ? (
          <Card className="border-none shadow-md">
            <CardContent className="p-10 flex justify-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </CardContent>
          </Card>
        ) : (
          <Card className="border-none shadow-md">
            <CardContent className="p-6 space-y-5">
              <div>
                <h1 className="font-display font-bold text-lg text-foreground">
                  Connect {clientName} to your SmartStudy AI account
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  This lets {clientName} use SmartStudy AI as you — while you are signed in.
                </p>
              </div>

              <div className="rounded-xl bg-muted px-4 py-3 space-y-1.5 text-sm">
                <p className="text-muted-foreground">Signed in as</p>
                <p className="font-medium text-foreground">{email ?? "your account"}</p>
              </div>

              <div className="rounded-xl bg-muted px-4 py-3 space-y-1.5 text-sm">
                <p className="text-muted-foreground">This connection can</p>
                <ul className="space-y-1 text-foreground">
                  <li>• Share your basic profile</li>
                  <li>• Share your email address</li>
                  <li>• Read your learning progress (quizzes, answers, topics studied)</li>
                </ul>
              </div>

              <p className="text-xs text-muted-foreground">
                This does not bypass SmartStudy AI's permissions or backend policies.
              </p>

              <div className="space-y-2">
                <Button className="w-full gap-2" disabled={busy} onClick={() => decide(true)}>
                  <Check className="w-4 h-4" />
                  Approve connection
                </Button>
                <Button variant="outline" className="w-full gap-2" disabled={busy} onClick={() => decide(false)}>
                  <X className="w-4 h-4" />
                  Cancel connection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OAuthConsent;
