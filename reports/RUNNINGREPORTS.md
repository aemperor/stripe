# Automatically Running Reports Steps

## Data Availability Information
* Stripe publishes data for the reports 12 hours after the previous day close. 
* * https://stripe.com/docs/reports/options#data-availability
* * Example: "For example, all account activity on October 16, 2022 (from 12:00 am to 11:59 pm UTC) is available in the Balance financial reports tab by October 17, 2022 at 12:00 pm UTC"
* Recommendation - run this task at 1pm UTC daily

## Option 1: Create a Schedule (via Dashboard)
1. In the Stripe Dashboard, navigate to Reports -> Financial Reports -> Balance
2. Click "Schedule" to create a Daily, Weekly, or Monthly Schedule of the report
3. Repeat for all necessary reports

### Task to Retrieve Reports
#### _TODO once the report schedules have been created_
1. On a cron of once a day for daily reports (1pm UTC), hit the `[GET] /v1/reporting/report_runs` API to retrieve all report runs.
2. Loop through the data body to find the `report_type` required to find the sought after `report_type` with `status: succeeded` and the _latest_ `succeeded_at` date (this is EPOCH so can just be greatest).
3. Grab the `file url` from `result.url` field
4. This grabs the report file link - download the file from the report file link (this requires user/password - need an answer on what this user/password is)

## Recommended - Option 2: Create a Report Run and use Webhook
1. On a cron of once a day for daily reports (1pm UTC), hit the `[POST] /v1/reporting/report_runs` API to create a new report run with the `report_type`, `interval_start`, and `interval_end` required. There are SDK methods for these in NodeJS, .NET, etc.
2. Webhook endpoint to listen for `event.type=reporting.report_run.succeeded`. This returns a `reportId`. 
3. Hit `[GET] /v1/reporting/report_runs/<reportId>` with the reportID from the previous step.
4. Hit the `file url` - download the file from the report file link (this requires user/password - need an answer on what this user/password is) and store where 