import { Boxes, Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../../shared/i18n/useTranslation";
import Button from "../../../shared/ui/Button";
import FormField from "../../../shared/ui/FormField";
import PreferenceControls from "../../../shared/ui/PreferenceControls";
import { useLogin } from "../hooks/useLogin";

const DEMO_CREDENTIALS = {
  username: "emilys",
  password: "emilyspass",
};

export default function LoginPage() {
  const { localizeError, t } = useTranslation();
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    loginMutation.reset();
  }

  function useDemoAccount() {
    setCredentials(DEMO_CREDENTIALS);
    setErrors({});
    loginMutation.reset();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (!credentials.username.trim())
      nextErrors.username = "auth.validation.usernameRequired";
    if (!credentials.password)
      nextErrors.password = "auth.validation.passwordRequired";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      await loginMutation.mutateAsync(credentials);
      navigate("/", { replace: true });
    } catch {
      // The API error is surfaced by the login mutation.
    }
  }

  return (
    <main className="login-page">
      <PreferenceControls floating />
      <section
        className="login-visual"
        aria-label={t("auth.introduction.ariaLabel")}
      >
        <div className="login-visual__content">
          <div className="brand brand--light">
            <span className="brand__mark">
              <Boxes aria-hidden="true" />
            </span>
            <span>
              {t("app.brand.catalog")}
              <span>{t("app.brand.admin")}</span>
            </span>
          </div>
          <div className="login-visual__copy">
            <span className="login-visual__eyebrow">
              {t("auth.hero.eyebrow")}
            </span>
            <h1>{t("auth.hero.title")}</h1>
            <p>{t("auth.hero.description")}</p>
          </div>
        </div>
        <div className="login-visual__glow" />
      </section>

      <section className="login-panel">
        <div className="login-card">
          <div className="login-card__header">
            <span className="login-card__eyebrow">
              {t("auth.signIn.eyebrow")}
            </span>
            <h2>{t("auth.signIn.title")}</h2>
            <p>{t("auth.signIn.description")}</p>
          </div>

          {loginMutation.error ? (
            <div className="alert alert--error" role="alert">
              <strong>{t("auth.signIn.errorTitle")}</strong>
              <span>{localizeError(loginMutation.error?.message)}</span>
            </div>
          ) : null}

          <form className="login-form" noValidate onSubmit={handleSubmit}>
            <FormField
              error={errors.username ? t(errors.username) : undefined}
              label={t("auth.fields.username")}
              name="username"
              required
            >
              {(fieldProps) => (
                <div className="input-group">
                  <UserRound aria-hidden="true" />
                  <input
                    {...fieldProps}
                    autoComplete="username"
                    onChange={updateField}
                    placeholder={t("auth.placeholders.username")}
                    type="text"
                    value={credentials.username}
                  />
                </div>
              )}
            </FormField>

            <FormField
              error={errors.password ? t(errors.password) : undefined}
              label={t("auth.fields.password")}
              name="password"
              required
            >
              {(fieldProps) => (
                <div className="input-group">
                  <LockKeyhole aria-hidden="true" />
                  <input
                    {...fieldProps}
                    autoComplete="current-password"
                    onChange={updateField}
                    placeholder={t("auth.placeholders.password")}
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                  />
                  <button
                    aria-label={
                      showPassword
                        ? t("auth.password.hideAria")
                        : t("auth.password.showAria")
                    }
                    className="input-group__action"
                    onClick={() => setShowPassword((current) => !current)}
                    type="button"
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden="true" />
                    ) : (
                      <Eye aria-hidden="true" />
                    )}
                  </button>
                </div>
              )}
            </FormField>

            <Button
              className="login-form__submit"
              isLoading={loginMutation.isPending}
              type="submit"
            >
              {t("auth.signIn.action")}
            </Button>
          </form>

          <div className="demo-credentials">
            <div>
              <span>{t("auth.demo.title")}</span>
              <code>emilys / emilyspass</code>
            </div>
            <button onClick={useDemoAccount} type="button">
              {t("auth.demo.useCredentials")}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
