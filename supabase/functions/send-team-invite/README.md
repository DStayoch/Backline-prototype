# send-team-invite

Supabase Edge Function for sending Backline team invite emails.

Required secrets:

```bash
RESEND_API_KEY=your_resend_api_key
INVITE_FROM_EMAIL="Backline <invite@yourdomain.com>"
BACKLINE_APP_URL=https://backlineoffice.com/app/
```

Optional:

```bash
INVITE_REPLY_TO_EMAIL=office@yourshop.com
```

The function expects a signed-in Backline user and a JSON body:

```json
{
  "inviteId": "pending-team-invite-uuid"
}
```

It verifies the caller is an `owner` or `admin` member of the invite's organization before sending through Resend. The invite link always uses the trusted `BACKLINE_APP_URL` secret.
