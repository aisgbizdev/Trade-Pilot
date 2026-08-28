---
name: Account tier selection
description: Product rule separating account type, available trading funds, and account-opening requirements.
---

Micro, Mini, and Regular must be selected explicitly according to the user's real account. Never silently infer or switch the account tier from the available-funds amount; that amount may only drive capacity calculations and a clearly optional suggestion.

**Why:** The same amount can mean free margin in an existing Mini account or the balance of a Micro account. Minimum funds to open an account are also different from free margin remaining after the account is active.

**How to apply:** Keep account tier, free trading funds, and risk style as separate inputs. For Micro, display the USD 50 opening minimum as information, but do not reject a smaller free-margin amount solely because the account-opening minimum is higher.