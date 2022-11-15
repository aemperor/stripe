import got from 'got';
import Stripe from 'stripe';
import { FormDataEncoder } from 'form-data-encoder';
import { FormData } from 'formdata-node';
import qs from 'qs';
const baseUrl = 'https://api.stripe.com//v1/reporting';
const testKey = 'sk_test_51M33UZIxl9dECv39YPff5m4eJkN3hplRNhsveHZEDGCFdC6q1rokQbPzZcxYsLR0pfVds9U7cYlqY1i41PYnjbJ700IiLyLpzp';
const stripeClient = new Stripe(testKey);

const listReports = async () => {
    // const {data} = await got({
    //     url: `${baseUrl}/report_types`,
    //     headers: {
    //         'Content-Type':'application/x-www-form-urlencoded',
    //         'Authorization': `Bearer ${testKey}`
    //     }
    // }).json()

    const {data} = await stripeClient.reporting.reportTypes.list();

    console.log(data);
};

const createReportRun = async (reportType, intervalStart, intervalEnd) => {
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

const generateReportAndDownload = async (reportType, intervalStart, intervalEnd) => {
    const reportRunDetails = await createReportRun(reportType, intervalStart, intervalEnd);
    
    // wait 60 seconds
    await sleep(60000);

    const retrieveReportDetails = await retrieveReportFile(reportRunDetails.id);

    console.log(JSON.stringify(retrieveReportDetails));
}

// listReports();
// createReportRun('balance.summary.1', 1668136668, 1668309530);
console.log(await retrieveReportRun('frr_1M4GwaIxl9dECv390V4k5OPC'));
// retrieveReportFile('file_1M4GeQIxl9dECv39cGUUUbXo');
// downloadFromFileLink('https://files.stripe.com/v1/files/file_1M4GeQIxl9dECv39cGUUUbXo/contents')
// generateReportAndDownload('balance.summary.1', 1668136668, 1668309530);