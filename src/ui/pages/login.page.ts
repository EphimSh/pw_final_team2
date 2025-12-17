import { SalesPortalPage } from "./salesPortal.page";
import { ICredentials } from "data/types/credentials.types";
import { logStep } from "utils/report/logStep.utils";

export class LoginPage extends SalesPortalPage {
  readonly loginForm = this.page.locator("//form");
  readonly pageTitle = this.page.getByText("Sign in with");
  readonly emailInput = this.page.locator("#emailinput");
  readonly passwordInput = this.page.locator("#passwordinput");
  readonly loginButton = this.page.locator("button[type='submit']");
  readonly uniqueElement = this.loginForm;

  @logStep("Click Login button on Login page")
  async clickLoginButton() {
    await this.loginButton.click();
  }

  @logStep("Fill credentials on Login page")
  async fillCredentials(credentials: ICredentials) {
    if (credentials.username) await this.emailInput.fill(credentials.username);
    if (credentials.password) await this.passwordInput.fill(credentials.password);
  }
}
