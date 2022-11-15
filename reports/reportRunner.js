import got from 'got';
import Stripe from 'stripe';
const testKey = 'sk_test_51M33UZIxl9dECv39YPff5m4eJkN3hplRNhsveHZEDGCFdC6q1rokQbPzZcxYsLR0pfVds9U7cYlqY1i41PYnjbJ700IiLyLpzp';
const stripeClient = new Stripe(testKey);

const listReports = async () => {
    const {data} = await stripeClient.reporting.reportTypes.list();
    return data;
};

export const createReportRun = async (reportType, intervalStart, intervalEnd) => {
    const data = await stripeClient.reporting.reportRuns.create({
        report_type: reportType,
        parameters: {
            interval_start: intervalStart,
            interval_end: intervalEnd
        }
    });

    return data;
}

const retrieveReportRun = async (reportRunId) => {
    const data = await stripeClient.reporting.reportRuns.retrieve(reportRunId);
    return data;
}

const retrieveReportFile = async (fileId) => {
    const data = await stripeClient.files.retrieve(fileId);
    return data;
}

const downloadFromFileLink = async (fileLink) => {
    return await got({
        url: fileLink,
        headers: {
            Authentication: `Bearer ${testKey}`
        }
    });
}

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export const generateReportAndDownload = async (reportType, intervalStart, intervalEnd) => {
    const createReportRunDetails  = await createReportRun(reportType, intervalStart, intervalEnd);

    let reportRunDetails = await retrieveReportRun(createReportRunDetails.id);

    let sleepTime = 1000; // 1 second
    while (reportRunDetails.status !== 'succeeded' && sleepTime <= 600000) {
        reportRunDetails = await retrieveReportRun(createReportRunDetails.id);

        console.log(`Status is ${reportRunDetails.status}. Sleeping for ${sleepTime}`);

        await sleep(sleepTime); // start 
        sleepTime *= 6; // increase backoff
    }

    console.log(reportRunDetails);

    if (reportRunDetails.status !== 'succeeded') {
        console.error('Application Timed Out Waiting for Report to Finish');
        return;
    }

    const retrieveReportDetails = await retrieveReportFile(reportRunDetails.id);
    return JSON.stringify(retrieveReportDetails);
}

// listReports();
// createReportRun('balance.summary.1', 1668136668, 1668309530);
// console.log(await retrieveReportRun('frr_1M4TuZIxl9dECv39CyuJfkP6'));
// retrieveReportFile('file_1M4GeQIxl9dECv39cGUUUbXo');
// downloadFromFileLink('https://files.stripe.com/v1/files/file_1M4GeQIxl9dECv39cGUUUbXo/contents')
// generateReportAndDownload('balance.summary.1', 1668283472, 1668456272);