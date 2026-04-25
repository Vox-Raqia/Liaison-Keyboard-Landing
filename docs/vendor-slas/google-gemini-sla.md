# Google Gemini for Google Cloud Service Level Agreement (SLA)

## Overview
This document outlines the Service Level Agreement between Liaison Keyboard and Google Cloud for Gemini AI model access used in reply generation.

## Service Description
Google Cloud provides access to:
- Gemini AI models (including gemini-2.5-flash and gemini-2.5-flash-lite) via API
- Model inference and text generation
- Global infrastructure and redundancy

## Service Commitments

### Uptime/Availability
- **Monthly Uptime Percentage:** >= 99.9%
- **Measurement:** Calculated monthly as (Total Minutes - Downtime Minutes) / Total Minutes
- **Downtime Definition:** More than 10% Error Rate (HTTP 5XX "Internal Error" responses) in a 5+ consecutive minute period, based on server-side error rate with minimum 2000 valid requests in measurement period

### Performance
- **API Response Time:** Not explicitly stated in public SLA (variable based on model and prompt complexity)
- **Success Rate:** Implicit in uptime measurement (valid requests resulting in non-error responses)
- **Rate Limits:** As specified in Google Cloud quota documentation (per project/per model)

### Support
- **Response Times:** Not explicitly stated in public Gemini SLA (standard Google Cloud support tiers apply based on support package)
- **Availability:** Via Google Cloud Support Hub (https://support.google.com/cloud/)
- **Support Channels:** Web portal, email, phone (depending on support tier)
- **Documentation:** Comprehensive API documentation at cloud.google.com/docs

## Remedies

### Financial Credits
If Google does not meet the Monthly Uptime Percentage SLO and Customer meets obligations:

| Monthly Uptime Percentage | Credit Percentage |
|---------------------------|------------------|
| 99.0% - < 99.9% | 10% |
| 95.0% - < 99.0% | 25% |
| < 95.0% | 50% |

Credit is applied to future monthly bills for the affected service.

### Maximum Credit Cap
- Aggregate credits for all Downtime Periods in a billing month shall not exceed 50% of the amount due for the affected service.

### Claim Procedure
1. Customer must notify Google technical support within **30 days** from becoming eligible
2. Provide log files showing Downtime Periods with dates/times
3. Credits applied within 60 days after request approval
4. Claims submitted via: https://support.google.com/cloud/contact/cloud_platform_sla

## SLA Exclusions
SLA does not apply to:
- Features or services in pre-General Availability (preview/beta)
- Errors caused by factors outside Google's reasonable control
- Errors from Customer's software/hardware or third-party software/hardware
- Errors from behaviors violating the Agreement
- Errors from quotas applied by the system (rate limits)
- Scheduled maintenance (with notice)
- Force majeure events

## Contact Information
- **Google Cloud Support:** https://support.google.com/cloud/
- **SLA Specific Contact:** https://support.google.com/cloud/contact/cloud_platform_sla
- **Documentation:** https://cloud.google.com/docs
- **Service Status:** https://status.cloud.google.com/

## Review and Amendment
This SLA is governed by the Google Cloud Agreement and may be modified per its terms. Reviewed annually or upon significant service changes.

**Effective Date:** TBD (as per Google Cloud Agreement)
**Last Reviewed:** 2026-04-25
**Version:** 1.0 (derived from public SLA at https://cloud.google.com/products/gemini/sla)

**Liaison Keyboard Representative:** ___________________ Date: _________
**Google Cloud Representative:** ___________________________ Date: _________

## Notes
- This SLA applies to Gemini for Google Cloud (including API-based access)
- Uptime measured per Project on a calendar month basis
- Customers must have a paid Google Cloud account; free tier may have different terms
- Always refer to the latest SLA at the official URL for current terms
