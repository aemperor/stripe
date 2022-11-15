# Automatically Running Reports Steps

## Create a Schedule (via Dashboard)
1. In the Stripe Dashboard, navigate to Reports -> Financial Reports -> Balance
2. Click "Schedule" to create a Daily, Weekly, or Monthly Schedule of the report
3. Repeat for all necessary reports

## Task to Retrieve Reports
#### _TODO once the report schedules have been created_
1. On a cron of once a day for daily reports (timing TBD), hit the `/v1/reporting/report_runs` API to retrieve all report runs.
2. Loop through the data body to find the `report_type` required to find the sought after `report_type` with `status: succeeded` and the _latest_ `succeeded_at` date (this is EPOCH so can just be greatest).
3. Grab the `fileId` from `result.id` field
4. Hit the `/v1/files/<fileId>` with the `fileId` from Step 3 to retrieve the report file