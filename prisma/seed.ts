import { PrismaClient, Role, TaskStatus } from "@prisma/client";

const prisma = new PrismaClient();

const FIRST_NAMES = [
  "Rahul", "Priya", "Amit", "Vikram", "Neha", "Arjun", "Aditi", "Rohan", "Anjali", "Sanjay",
  "Kiran", "Meera", "Vijay", "Divya", "Rajesh", "Shalini", "Sunil", "Ritu", "Deepak", "Pooja",
  "Aravind", "Shruti", "Manish", "Kavita", "Siddharth", "Aisha", "Harish", "Sneha", "Gaurav", "Swati"
];

const LAST_NAMES = [
  "Sharma", "Nair", "Gupta", "Patel", "Verma", "Sen", "Mehta", "Joshi", "Iyer", "Rao",
  "Kumar", "Singh", "Reddy", "Choudhury", "Bose", "Das", "Mishra", "Pillai", "Trivedi", "Deshmukh",
  "Nagar", "Kulkarni", "Menon", "Jha", "Pande", "Gowda", "Sethi", "Bhat", "Dhar", "Saxena"
];

const COMPANY_NAMES = [
  "Meridian", "Coastal", "Gupta", "Patel", "Verma", "Deccan", "Himalaya", "Vedic", "BlueStar", "Quantum",
  "Apex", "Summit", "Indus", "Ganges", "Matrix", "Cyber", "Orient", "Imperial", "Mercurial", "Pinnacle"
];

const COMPANY_SUFFIXES = [
  "Textiles", "Technologies", "Solutions", "Exports", "Crafts", "Global", "Logistics", "Enterprises", "Industries", "Consulting"
];

const DEALS = [
  "Bulk Supply order", "Software Integration", "Consulting Contract", "Q3 Logistics Renewal", "Materials Procurement", 
  "Cloud Migration Setup", "Equipment Leasing", "Facility Maintenance", "Bulk Fabric Import", "Widgets Supply"
];

const STAGES = ["NEW", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"];

const NEXT_ACTIONS = [
  "Follow up via WhatsApp regarding quotation details",
  "Send updated volume pricing catalog",
  "Schedule callback with accounts lead",
  "Prepare draft supply agreement for Q3",
  "Review custom weave specifications with production desk",
  "Bypass further actions — deal closed"
];

const REASONS = [
  "Inquired about volume discounts twice this week — high intent.",
  "Initial outreach complete, awaiting catalog download.",
  "Contract renewal deadline approaching in 10 days.",
  "Expressed budget constraints, negotiating custom pricing margins.",
  "Requested custom weave specs. Need alignment with factory supervisor.",
  "Closed won transaction."
];

async function main() {
  const tenant = await prisma.tenant.findFirst({ orderBy: { createdAt: "asc" } });
  if (!tenant) {
    console.log("No tenant found yet — sign in with Google once first, then re-run: npm run db:seed");
    return;
  }

  const tenantId = tenant.id;
  console.log(`Cleaning old demo data for tenant: ${tenant.name}...`);

  // Clear old data for idempotency
  await prisma.opportunity.deleteMany({ where: { tenantId } });
  await prisma.task.deleteMany({ where: { tenantId } });
  await prisma.auditLog.deleteMany({ where: { tenantId } });
  await prisma.message.deleteMany({ where: { conversation: { tenantId } } });
  await prisma.conversation.deleteMany({ where: { tenantId } });
  await prisma.contact.deleteMany({ where: { tenantId } });

  console.log(`Generating 100 complete mock customer and pipeline data entries...`);

  // Seed 100 complete contacts and opportunities
  for (let i = 1; i <= 100; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const name = `${firstName} ${lastName}`;
    
    const companyPrefix = COMPANY_NAMES[(i * 7) % COMPANY_NAMES.length];
    const companySuffix = COMPANY_SUFFIXES[(i * 2) % COMPANY_SUFFIXES.length];
    const company = `${companyPrefix} ${companySuffix}`;
    
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}_${i}@${companyPrefix.toLowerCase()}${companySuffix.toLowerCase()}.in`;
    const phone = `+9198${(10000000 + i * 87293) % 90000000}`;
    
    // Choose stage distribution
    let stage = STAGES[0]; // NEW
    if (i <= 20) stage = "NEW";
    else if (i <= 40) stage = "QUALIFIED";
    else if (i <= 60) stage = "PROPOSAL";
    else if (i <= 75) stage = "NEGOTIATION";
    else if (i <= 90) stage = "WON";
    else stage = "LOST";

    const value = Math.floor((10000 + (i * 148293) % 490000) / 1000) * 1000;
    const score = 40 + (i * 13) % 59; // score between 40 and 99
    
    const dealTitle = DEALS[i % DEALS.length];
    const title = `${company} — ${dealTitle}`;

    const nextBestAction = stage === "WON" || stage === "LOST" ? undefined : NEXT_ACTIONS[i % NEXT_ACTIONS.length];
    const nbaReasoning = stage === "WON" || stage === "LOST" ? undefined : REASONS[i % REASONS.length];

    // Create Contact
    const contact = await prisma.contact.create({
      data: {
        tenantId,
        name,
        phone,
        email,
        company,
        tags: stage === "WON" ? ["existing-customer"] : stage === "LOST" ? ["inactive"] : ["lead"],
      },
    });

    // Create Opportunity
    await prisma.opportunity.create({
      data: {
        tenantId,
        contactId: contact.id,
        title,
        stage,
        value,
        score,
        nextBestAction,
        nbaReasoning,
      },
    });

    // Create Task for pending deals (e.g. for every 3rd lead)
    if (stage !== "WON" && stage !== "LOST" && i % 3 === 0) {
      await prisma.task.create({
        data: {
          tenantId,
          contactId: contact.id,
          title: `Follow up with ${name} regarding ${dealTitle}`,
          status: TaskStatus.PENDING,
          dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000 * 2), // 2 days from now
        },
      });
    }

    // Seed full Conversation timeline for the first 8 contacts
    if (i <= 8) {
      const isPositive = i % 3 === 0;
      const isNegative = i % 4 === 0;
      const sentiment = isPositive ? "positive" : isNegative ? "negative" : "neutral";
      const intent = isNegative ? "delivery_issue" : i % 2 === 0 ? "pricing_query" : "general_inquiry";
      
      const conv = await prisma.conversation.create({
        data: {
          tenantId,
          contactId: contact.id,
          channel: i % 2 === 0 ? "WHATSAPP" : i % 3 === 0 ? "EMAIL" : "CALL",
          summary: `AI compiled summary of contact transaction for ${name}. Details: ${dealTitle} discuss.`,
          sentiment,
          intent,
          nextAction: nextBestAction,
        },
      });

      const userText = isNegative 
        ? `Hi, checking on our ${dealTitle} shipment. The payment link returned error.`
        : `Do you have custom volume rates for ${dealTitle}?`;
      
      const botText = isNegative
        ? `Hello ${firstName}, I apologize for the inconvenience. Let me refresh the link parameters.`
        : `Hi ${firstName}! Yes, for ${company} we can apply customized wholesale pricing.`;

      await prisma.message.createMany({
        data: [
          { conversationId: conv.id, direction: "INBOUND", content: userText },
          { conversationId: conv.id, direction: "OUTBOUND", content: botText },
        ],
      });
    }

    // Create Audit Logs
    if (i % 2 === 0) {
      await prisma.auditLog.create({
        data: {
          tenantId,
          action: i % 4 === 0 ? "lead.qualified" : "reply.suggested",
          entity: `Contact:${contact.id}`,
          metadata: {
            contactName: name,
            companyName: company,
            leadScore: score,
            dealValue: value,
          },
        },
      });
    }
  }

  // Create general system login log
  await prisma.auditLog.create({
    data: {
      tenantId,
      action: "auth.login",
      metadata: {
        method: "bypass",
        role: "OWNER",
        ip: "127.0.0.1",
      },
    },
  });

  console.log(`Successfully seeded 100 contacts, opportunities, conversations, and audit logs for tenant: ${tenant.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
