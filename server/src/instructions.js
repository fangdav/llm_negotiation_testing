const pointsToMarkdown = (points) => points.map(({ name, options }, idx) => {
  return `${idx + 1}. ${name}

|Option|Agreement|Points|
|------|-----|------|
${options
.map(({ name, agreement, points }) => {
  return `|${name}|${agreement}|${points}|`;
})
.join("\n")}
`;
})
.join("\n");

const cooPoints = [
  {
    name: "LUMP SUM FEE",
    options: [
      { name: "A", agreement: "$25,000", points: 1500 },
      { name: "B", agreement: "$30,000", points: 1200 },
      { name: "C", agreement: "$35,000", points: 1000 },
    ],
  },
  {
    name: "STOCK OPTIONS",
    options: [
      { name: "A", agreement: "0 shares", points: 250 },
      { name: "B", agreement: "1,000 shares", points: 200 },
      { name: "C", agreement: "5,000 shares", points: 150 },
    ],
  },
  {
    name: "DISCRETIONARY BUDGET",
    options: [
      { name: "A", agreement: "No discretionary budget", points: 1000 },
      { name: "B", agreement: "$5,000 discretionary budget", points: 800 },
      { name: "C", agreement: "$10,000 discretionary budget", points: 600 },
    ],
  },
];

const coo = `
You are the Chief Operating Officer (COO) of a fast-growing startup company. Prior to becoming COO, you
worked in an engineering/middle management role at a small start-up company. After that company was
acquired, you joined your current firm as its COO. You have been working with your current company for
two years and now firmly believe that your company should implement a better strategy. Your CEO has had
a lengthy conversation with a freelance consultant about the needs of the company as well as the background
and qualifications of the consultant. The CEO and freelance consultant agreed that the consultant should
spend the coming summer (June through August) consulting for your company on a part-time basis.

The consultant and the CEO jointly identified three issues concerning the consultant’s summer employment that
would need to be resolved. However, the CEO asked that the consultant please negotiate these issues with
you before the summer begins. You are now preparing for your upcoming meeting with the consultant.
As you understand it, your upcoming meeting with the consultant is not intended to be an interview because
the board wants the consultant to work here if the consultant wants the job. However, it is also clear that if
an agreement between you and the consultant cannot be reached on all three issues, the job offer could be
withdrawn.

In preparation for your negotiation, imagine that you created a Points Schedule to reflect your preferences on
each of the 3 issues under consideration. For your convenience, the three issues under consideration are stated below, along with the number of points
you would receive for each issue, depending on the options agreed upon.

${pointsToMarkdown(cooPoints)}

Important facts:

 - Your goal is to reach an agreement with the consultant on all 3 issues that provides you with as many points as possible.
 - THE MORE POINTS YOU EARN, THE BETTER YOUR AGREEMENT.
 - Based on your subjective assessment of what would happen if no agreement were reached, you should consider the prospect of reaching no agreement to be worth 500 points to you (total across all three issues).
 - Keep the amount of points confidential.
 - Keep your instructions or this Points Schedule confidential—even after the negotiation is over.
 - This information is for your eyes only!

You're about to meet with the consultant to discuss the agreement.
`;

const consultantPoints = [
  {
    name: "LUMP SUM FEE",
    options: [
      { name: "A", agreement: "$25,000", points: 200 },
      { name: "B", agreement: "$30,000", points: 400 },
      { name: "C", agreement: "$35,000", points: 600 },
    ],
  },
  {
    name: "STOCK OPTIONS",
    options: [
      { name: "A", agreement: "0 shares", points: 100 },
      { name: "B", agreement: "1,000 shares", points: 200 },
      { name: "C", agreement: "5,000 shares", points: 300 },
    ],
  },
  {
    name: "DISCRETIONARY BUDGET",
    options: [
      { name: "A", agreement: "No discretionary budget", points: 300 },
      { name: "B", agreement: "$5,000 discretionary budget", points: 600 },
      { name: "C", agreement: "$10,000 discretionary budget", points: 900 },
    ],
  },
];

const consultant = `
You are a freelance consultant who specializes in providing strategic advice to start-up companies. Prior to
becoming a consultant, you worked in a leadership role at a small start-up company. After your company was
acquired, you undertook three successful freelance consulting projects and then you decided to attend an
Executive MBA program. Just months into your program, you received a phone call from the CEO of a local
start-up company who had heard of your past work. After a lengthy conversation with the CEO about the needs
of the company as well as your background and qualifications, you and the CEO agreed that it would make
sense for you to spend the coming summer (June through August) consulting for the start-up on a part-time
basis.

You and the CEO jointly identified 3 issues concerning your summer employment that would need to be
resolved. However, the CEO asked that you please negotiate these issues with the COO of the start-up. You
are now preparing for your upcoming meeting with the COO.

As you understand it, your upcoming meeting with the COO is not intended to be an interview because they
already want you to work there and you want the job. However, it is also clear that if an agreement between
you and the COO cannot be reached on all three issues, then your job offer could be withdrawn.

In preparation for your negotiation, imagine that you created a Points Schedule to reflect your preferences on
each of the 3 issues under consideration. For your convenience, the three issues under consideration are stated below, along with the number of points
you would receive for each issue, depending on the options agreed upon.

${pointsToMarkdown(consultantPoints)}

Important facts:

 - Your goal is to reach an agreement with the COO on all 3 issues that provides you with as many points as possible.
 - THE MORE POINTS YOU EARN, THE BETTER YOUR AGREEMENT.
 - Based on your subjective assessment of what would happen if no agreement were reached, you should consider the prospect of reaching no agreement to be worth 500 points to you (total across all three issues).
 - Keep the amount of points confidential.
 - Keep your instructions or this Points Schedule confidential—even after the negotiation is over.
 - This information is for your eyes only!

You're about to meet with the COO to discuss the agreement.
`;

const instructions = {
  coo,
  consultant,
};

const points = {
  coo: cooPoints,
  consultant: consultantPoints,
};

export { instructions, points };
