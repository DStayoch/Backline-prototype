-- Backline customer-facing shop settings.
-- Run after schemas 01 through 26. Public approval and portal links used to
-- return the shop's whole settings object, so anyone holding a customer link
-- could read internal values (labor cost rate, target margin, custom roles,
-- readiness checklists). Both public functions now return an allowlist of
-- customer-facing fields only. Add a key here when a customer page needs it.

create or replace function public.backline_customer_company_settings(settings jsonb)
returns jsonb
language sql
immutable
set search_path = public
as $$
  select coalesce(jsonb_object_agg(entry.key, entry.value), '{}'::jsonb)
  from jsonb_each(case when jsonb_typeof(settings) = 'object' then settings else '{}'::jsonb end) as entry
  where entry.key = any (array[
    'companyName', 'name', 'companySlogan', 'tagline', 'businessType', 'legalName',
    'phone', 'email', 'supportPhone', 'supportEmail', 'customerSupportPhone', 'customerSupportEmail',
    'address', 'serviceArea', 'timeZone',
    'invoiceTerms', 'defaultTaxRate', 'defaultDepositPercent', 'estimateExpirationDays',
    'estimateIntroText', 'estimateWarrantyText', 'estimateDisclaimer', 'defaultDepositWording',
    'approvalWording', 'approvalDisclaimerText', 'pdfFooter', 'customerFooterText',
    'receiptSupportLine', 'privacyUrl', 'termsUrl', 'servicePolicyText', 'reviewLink',
    'defaultPaymentLink', 'paymentInstructions'
  ]);
$$;

-- Same logic as schema 17, with the settings passed through the allowlist.
create or replace function public.get_approval_by_token(input_token text)
returns table (
  job jsonb,
  company_settings jsonb,
  link_status text,
  expires_at timestamptz,
  used_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    public.customer_safe_job(j.payload) as job,
    public.backline_customer_company_settings(coalesce(o.payload->'companySettings', '{}'::jsonb))
      || jsonb_build_object(
        'companyName',
        coalesce(
          nullif(o.payload#>>'{companySettings,companyName}', ''),
          nullif(o.payload->>'companyName', ''),
          o.name,
          'Backline'
        )
      ) as company_settings,
    case
      when l.expires_at is not null and l.expires_at < now() then 'expired'
      when l.used_at is not null then 'used'
      else 'active'
    end as link_status,
    l.expires_at,
    l.used_at
  from public.approval_links l
  join public.jobs j on j.id = l.job_id and j.organization_id = l.organization_id
  join public.organizations o on o.id = l.organization_id
  where l.token = input_token
  limit 1;
$$;

-- Same logic as schema 24, with the settings passed through the allowlist.
create or replace function public.get_customer_portal_by_token(input_token text)
returns table (
  job jsonb,
  company_settings jsonb
)
language sql
stable
security definer
set search_path = public
as $$
  select
    public.customer_safe_job(j.payload) as job,
    public.backline_customer_company_settings(coalesce(o.payload->'companySettings', '{}'::jsonb))
      || jsonb_build_object(
        'companyName',
        coalesce(
          nullif(o.payload#>>'{companySettings,companyName}', ''),
          nullif(o.payload->>'companyName', ''),
          o.name,
          'Backline'
        )
      ) as company_settings
  from public.jobs j
  join public.organizations o on o.id = j.organization_id
  where public.backline_valid_portal_token(input_token)
    and j.payload->>'portalToken' = input_token
  limit 1;
$$;

revoke all on function public.backline_customer_company_settings(jsonb) from public;
grant execute on function public.get_approval_by_token(text) to anon, authenticated;
grant execute on function public.get_customer_portal_by_token(text) to anon, authenticated;

notify pgrst, 'reload schema';
