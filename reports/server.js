import Stripe from 'stripe';
import express from 'express';
import bodyParser from 'body-parser';
import { createReportRun } from './reportRunner.js';

const app = express();
app.use(bodyParser());
const testKey = 'sk_test_51M33UZIxl9dECv39YPff5m4eJkN3hplRNhsveHZEDGCFdC6q1rokQbPzZcxYsLR0pfVds9U7cYlqY1i41PYnjbJ700IiLyLpzp';
const stripeClient = new Stripe(testKey);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_49ebb9ba81de269ba6955e1f10ae9e836a7ffebf995e3c6c2618d5665245345f";

app.post('/createReportRun', express.raw({type: 'application/json'}), async (request, response) => {
  const reportType = request.body.reportType;
  const intervalStart = request.body.intervalStart;
  const intervalEnd = request.body.intervalEnd;

  const data = await createReportRun(reportType, intervalStart, intervalEnd);
  response.send(data).status(200);
});

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripeClient.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'reporting.report_run.succeeded':
      const reportRunDetails = event.data.object;
      console.log(reportRunDetails);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.send();
});

app.listen(4242, () => console.log('Running on port 4242'));