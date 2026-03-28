import Waitlist from "../waitlist/waitlist.model.js";
import { waitlistFollowUpEmail, waitlistDesignerEmail } from "../helpers/email.js";
import Labels from "../utils/labels.js";
import cron from "node-cron";

let isSending = false;
let isSendingDesigner = false;

// Sends follow-up emails to all users with notified: false

const sendFollowUpEmails = async () => {
  if (isSending) {
    Labels.serviceLog.info("Follow-up job already running. Skipping.");
    return;
  }

  isSending = true;

  try {
    const users = await Waitlist.find({ notified: false });

    if (!users.length) {
      Labels.serviceLog.info("No pending users to notify.");
      return;
    }

    Labels.serviceLog.info(`Notifying ${users.length} user(s)...`);

    for (const user of users) {
      try {
        await waitlistFollowUpEmail(user.email, user.role);
        user.notified = true;
        await user.save();
        Labels.serviceLog.info(`Email sent to ${user.email}`);
      } catch (err) {
        Labels.serviceLog.error(`Failed to email ${user.email}`, {
          error: err.message,
        });
      }
    }

    Labels.serviceLog.info("Follow-up job complete.");
  } catch (err) {
    Labels.serviceLog.error("Follow-up job failed.", { error: err.message });
  } finally {
    isSending = false;
  }
};

// Sends designer-specific follow-up emails to designers with designerNotified: false

const sendDesignerFollowUpEmails = async () => {
  if (isSendingDesigner) {
    Labels.serviceLog.info("Designer follow-up job already running. Skipping.");
    return;
  }

  isSendingDesigner = true;

  try {
    const designers = await Waitlist.find({ role: "designer", designerNotified: false });

    if (!designers.length) {
      Labels.serviceLog.info("No pending designers to notify.");
      return;
    }

    Labels.serviceLog.info(`Notifying ${designers.length} designer(s)...`);

    for (const designer of designers) {
      try {
        await waitlistDesignerEmail(designer.email);
        designer.designerNotified = true;
        await designer.save();
        Labels.serviceLog.info(`Designer email sent to ${designer.email}`);
      } catch (err) {
        Labels.serviceLog.error(`Failed to email designer ${designer.email}`, {
          error: err.message,
        });
      }
    }

    Labels.serviceLog.info("Designer follow-up job complete.");
  } catch (err) {
    Labels.serviceLog.error("Designer follow-up job failed.", { error: err.message });
  } finally {
    isSendingDesigner = false;
  }
};

//  Runs every day at 9AM — only emails users who haven't been notified yet

const startFollowUpManager = () => {
  cron.schedule("0 9 * * *", async () => {
    Labels.serviceLog.info("Running daily follow-up job...");
    await sendFollowUpEmails();
  });

  cron.schedule("0 9 * * *", async () => {
    Labels.serviceLog.info("Running daily designer follow-up job...");
    await sendDesignerFollowUpEmails();
  });

  Labels.serviceLog.info("Follow-up manager started. Scheduled daily at 9AM.");
};

export default startFollowUpManager;