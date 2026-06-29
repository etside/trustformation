# CEO Email Setup — ceo@trustformation.net

## Step 1: Create the Email in cPanel

1. Log in to your hosting cPanel
2. Go to **Email Accounts**
3. Click **Create**
4. Fill in:
   - **Domain:** trustformation.net
   - **Username:** ceo
   - **Password:** (choose a strong password)
5. Click **Create**

---

## Step 2: Configure on iPhone / iOS (Manual)

1. Go to **Settings → Mail → Accounts → Add Account → Other → Add Mail Account**
2. Fill in:
   - **Name:** Trust Formation CEO
   - **Email:** ceo@trustformation.net
   - **Password:** (your email password)
   - **Description:** Trust Formation CEO

3. Tap **Next** — choose **IMAP**

4. **Incoming Mail Server:**
   - Host: mail.trustformation.net
   - Username: ceo@trustformation.net
   - Password: (your email password)

5. **Outgoing Mail Server (SMTP):**
   - Host: mail.trustformation.net
   - Username: ceo@trustformation.net
   - Password: (your email password)

6. Tap **Save**

---

## Step 3: Configure on Android

1. Open **Gmail** or **Email** app → Add Account → Other
2. Enter: ceo@trustformation.net → Next
3. Choose **IMAP**
4. **Incoming:** mail.trustformation.net | Port 993 | SSL
5. **Outgoing:** mail.trustformation.net | Port 465 | SSL
6. Enter password → Save

---

## Step 4: Configure in Desktop Email Client (Outlook / Thunderbird)

| Setting        | Value                        |
|----------------|------------------------------|
| Email          | ceo@trustformation.net       |
| IMAP Host      | mail.trustformation.net      |
| IMAP Port      | 993 (SSL)                    |
| SMTP Host      | mail.trustformation.net      |
| SMTP Port      | 465 (SSL) or 587 (STARTTLS)  |
| Username       | ceo@trustformation.net       |
| Password       | (your email password)        |

---

## Step 5: Webmail Access

Access email directly at:
**https://webmail.trustformation.net**
or
**https://trustformation.net/webmail**

---

## Notes
- The `.mobileconfig` file referenced in your setup can be generated from cPanel → Email → Email Accounts → Connect Devices
- Make sure MX records for trustformation.net point to your hosting server
